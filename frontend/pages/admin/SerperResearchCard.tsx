import React, { useCallback, useEffect, useState } from 'react';
import { Search, ExternalLink, AlertCircle, Play, Trash2, Save } from 'lucide-react';
import {
  getTavilyConfig,
  tavilyCrawl,
  listThemes,
  createTheme,
  deleteTheme,
  triggerCreatePostWebhook,
  listSourceUrls,
  createSourceUrl,
  deleteSourceUrl,
  listCategories,
} from '../../utils/blogApi';
import type { BlogTheme, ThemeSourceUrl } from '../../utils/blogApi';
import type { BlogCategory } from '../../utils/blogApi';
import {
  contentFromScrapeResult,
  getDisplayText,
  matchCategoriesInText,
  extractTitleFromContent,
  generateTitleFromTopics,
} from '../../utils/blogThemeUtils';

const SerperResearchCard: React.FC = () => {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [scrapedUrl, setScrapedUrl] = useState('');
  const [themes, setThemes] = useState<BlogTheme[]>([]);
  const [themesLoading, setThemesLoading] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [sendingThemeId, setSendingThemeId] = useState<number | null>(null);
  const [deletingThemeId, setDeletingThemeId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sendingSelected, setSendingSelected] = useState(false);
  const [sourceUrls, setSourceUrls] = useState<ThemeSourceUrl[]>([]);
  const [selectedSourceUrlId, setSelectedSourceUrlId] = useState<number | ''>('');
  const [newUrlValue, setNewUrlValue] = useState('');
  const [newUrlLabel, setNewUrlLabel] = useState('');
  const [savingUrl, setSavingUrl] = useState(false);
  const [deletingUrlId, setDeletingUrlId] = useState<number | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedTopicsToSave, setSelectedTopicsToSave] = useState<Set<string>>(new Set());

  const loadThemes = useCallback(async () => {
    setThemesLoading(true);
    try {
      const list = await listThemes();
      setThemes(list);
    } catch {
      setThemes([]);
    } finally {
      setThemesLoading(false);
    }
  }, []);

  useEffect(() => {
    getTavilyConfig()
      .then((c) => setConfigured(c.tavily_configured))
      .catch(() => setConfigured(false));
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const list = await listCategories();
      setCategories(list);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    if (configured) loadCategories();
  }, [configured, loadCategories]);

  useEffect(() => {
    if (configured) loadThemes();
  }, [configured, loadThemes]);

  const loadSourceUrls = useCallback(async () => {
    try {
      const list = await listSourceUrls();
      setSourceUrls(list);
      if (selectedSourceUrlId !== '' && !list.some((u) => u.id === selectedSourceUrlId)) {
        setSelectedSourceUrlId('');
        setUrl('');
      } else if (selectedSourceUrlId !== '') {
        const u = list.find((x) => x.id === selectedSourceUrlId);
        if (u) setUrl(u.url);
      }
    } catch {
      setSourceUrls([]);
    }
  }, [selectedSourceUrlId]);

  useEffect(() => {
    if (configured) loadSourceUrls();
  }, [configured, loadSourceUrls]);

  useEffect(() => {
    if (selectedSourceUrlId !== '') {
      const u = sourceUrls.find((x) => x.id === selectedSourceUrlId);
      if (u) setUrl(u.url);
    }
  }, [selectedSourceUrlId, sourceUrls]);


  const handleSelectSourceUrl = (id: number | '') => {
    setSelectedSourceUrlId(id);
    if (id === '') setUrl('');
  };

  const handleSaveNewUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = newUrlValue.trim();
    if (!u) {
      setMessage({ type: 'error', text: 'Informe a URL para cadastrar.' });
      return;
    }
    setSavingUrl(true);
    setMessage(null);
    try {
      const created = await createSourceUrl({ url: u, label: newUrlLabel.trim() || null });
      setNewUrlValue('');
      setNewUrlLabel('');
      setMessage({ type: 'success', text: 'URL cadastrada.' });
      loadSourceUrls();
      setSelectedSourceUrlId(created.id);
      setUrl(created.url);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao cadastrar URL.' });
    } finally {
      setSavingUrl(false);
    }
  };

  const handleDeleteSourceUrl = async (id: number) => {
    if (!window.confirm('Remover esta URL cadastrada?')) return;
    setDeletingUrlId(id);
    try {
      await deleteSourceUrl(id);
      if (selectedSourceUrlId === id) {
        setSelectedSourceUrlId('');
        setUrl('');
      }
      loadSourceUrls();
    } finally {
      setDeletingUrlId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = url.trim();
    if (!u) {
      setMessage({ type: 'error', text: 'Informe uma URL.' });
      return;
    }
    setMessage(null);
    setResult(null);
    setScrapedUrl('');
    setSaveTitle('');
    setSelectedTopicsToSave(new Set());
    setLoading(true);
    try {
      const data = await tavilyCrawl(u);
      const first = data.results?.[0] ?? null;
      setResult(first);
      setScrapedUrl(first?.url ?? data.url);
      const displayText = getDisplayText(first);
      const generatedTitle = extractTitleFromContent(displayText, first?.url ?? data.url);
      if (generatedTitle) setSaveTitle(generatedTitle);
      const count = data.results?.length ?? 0;
      setMessage({ type: 'success', text: count > 1 ? `Pesquisa concluída: ${count} página(s). Mostrado o primeiro. Pode editar e guardar.` : 'Pesquisa concluída. Pode editar e guardar.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao pesquisar tema.',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTopicToSave = (topic: string) => {
    setSelectedTopicsToSave((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapedUrl || result == null) return;
    const topicsToSave = Array.from(selectedTopicsToSave);
    if (topicsToSave.length === 0) {
      setMessage({ type: 'error', text: 'Selecione pelo menos um tema para guardar.' });
      return;
    }
    setSavingTheme(true);
    setMessage(null);
    try {
      const content = contentFromScrapeResult(result);
      const displayText = getDisplayText(result);
      const extractedTitle = extractTitleFromContent(displayText, scrapedUrl);
      const fallbackTitle = generateTitleFromTopics(topicsToSave);
      const titleToSave = saveTitle.trim() || extractedTitle || fallbackTitle;
      const firstTopicName = topicsToSave[0];
      const blogCategoryIds = topicsToSave
        .map((name) => categories.find((c) => c.name === name)?.id)
        .filter((id): id is number => id != null);
      await createTheme({
        url: scrapedUrl,
        title: titleToSave,
        blog_category_ids: blogCategoryIds.length > 0 ? blogCategoryIds : undefined,
        content: content || null,
        topics: topicsToSave,
      });
      setMessage({ type: 'success', text: 'Tema guardado. Aparece na lista de temas para enviar à automação.' });
      setResult(null);
      setScrapedUrl('');
      setSaveTitle('');
      setSelectedTopicsToSave(new Set());
      loadThemes();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao guardar tema.' });
    } finally {
      setSavingTheme(false);
    }
  };

  const handleSendToAutomation = async (themeId: number) => {
    setSendingThemeId(themeId);
    setMessage(null);
    try {
      await triggerCreatePostWebhook(themeId);
      setMessage({ type: 'success', text: 'Tema enviado para a automação com sucesso.' });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
      loadThemes();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao enviar para a automação.' });
    } finally {
      setSendingThemeId(null);
    }
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const dispatchableThemes = themes.filter((t) => !t.dispatched);
  const selectAll = () => setSelectedIds(new Set(dispatchableThemes.map((t) => t.id)));
  const selectNone = () => setSelectedIds(new Set());

  const handleSendSelected = async () => {
    const ids: number[] = Array.from(selectedIds);
    if (ids.length === 0) {
      setMessage({ type: 'error', text: 'Selecione pelo menos um tema.' });
      return;
    }
    setSendingSelected(true);
    setMessage(null);
    try {
      await triggerCreatePostWebhook(ids);
      setMessage({ type: 'success', text: `${ids.length} tema(s) enviado(s) para a automação.` });
      setSelectedIds(new Set());
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao enviar para a automação.' });
    } finally {
      setSendingSelected(false);
    }
  };

  const handleDeleteTheme = async (themeId: number) => {
    if (!window.confirm('Eliminar este tema?')) return;
    setDeletingThemeId(themeId);
    setMessage(null);
    try {
      await deleteTheme(themeId);
      setMessage({ type: 'success', text: 'Tema eliminado.' });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
      loadThemes();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao eliminar.' });
    } finally {
      setDeletingThemeId(null);
    }
  };

  if (configured === null) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
        <p className="text-sm text-gray-500">A verificar Tavily…</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-bold text-green-950">Pesquisa de tema (Tavily)</p>
          <p className="text-xs text-gray-600 mt-1">
            Configure <code className="bg-white px-1 rounded">TAVILY_API_KEY</code> no <code className="bg-white px-1 rounded">.env</code> do backend para usar o crawl por URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ExternalLink size={18} className="text-gold" />
          <h4 className="text-sm font-black text-green-950 uppercase tracking-widest">Pesquisa de tema (Tavily)</h4>
        </div>
        <p className="text-xs text-gray-500">
          Escolha uma URL cadastrada ou digite uma. Clique em «Pesquisar tema» para buscar; guarde os temas e use depois para enviar à automação.
        </p>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">URL cadastrada</label>
          <select
            value={selectedSourceUrlId}
            onChange={(e) => handleSelectSourceUrl(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="">— Digitar URL manualmente —</option>
            {sourceUrls.map((u) => (
              <option key={u.id} value={u.id}>{u.label || u.url}</option>
            ))}
          </select>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com/artigo"
            className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gold"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-green-950 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shrink-0"
          >
            <Search size={16} />
            {loading ? 'A pesquisar…' : 'Pesquisar tema'}
          </button>
        </form>
        {message && (
          <p
            className={`text-[10px] font-bold uppercase ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cadastrar nova URL fixa</p>
          <form onSubmit={handleSaveNewUrl} className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-gray-500 mb-0.5">URL</label>
              <input
                type="url"
                value={newUrlValue}
                onChange={(e) => setNewUrlValue(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                disabled={savingUrl}
              />
            </div>
            <div className="w-40">
              <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Rótulo</label>
              <input
                type="text"
                value={newUrlLabel}
                onChange={(e) => setNewUrlLabel(e.target.value)}
                placeholder="Ex.: The Independent Superfood"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                disabled={savingUrl}
              />
            </div>
            <button
              type="submit"
              disabled={savingUrl}
              className="px-4 py-2 rounded-lg bg-green-950 text-white text-xs font-bold uppercase disabled:opacity-60"
            >
              {savingUrl ? 'A guardar…' : 'Cadastrar URL'}
            </button>
          </form>
          {sourceUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {sourceUrls.map((u) => (
                <span
                  key={u.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs"
                >
                  {u.label || u.url}
                  <button
                    type="button"
                    onClick={() => handleDeleteSourceUrl(u.id)}
                    disabled={deletingUrlId !== null}
                    className="text-gray-400 hover:text-red-500 p-0.5"
                    aria-label="Remover URL"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {result !== null && (() => {
          const displayText = getDisplayText(result);
          const matchedCategories = matchCategoriesInText(displayText, categories);
          return (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Temas encontrados (baseado nas suas categorias) — selecione quais guardar
              </p>
              <p className="text-[10px] text-gray-500 mb-2">Cada opção é uma categoria do blog. O id da primeira que selecionar será enviado na requisição (blog_category_id).</p>
              {matchedCategories.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma das suas categorias apareceu neste conteúdo. Tente outra URL.</p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTopicsToSave(new Set(matchedCategories))}
                      className="text-xs font-bold text-gold hover:text-green-950"
                    >
                      Selecionar todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTopicsToSave(new Set())}
                      className="text-xs font-bold text-gray-500 hover:text-green-950"
                    >
                      Desmarcar todos
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchedCategories.map((name) => (
                      <label
                        key={name}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium cursor-pointer hover:border-gold has-[:checked]:border-green-950 has-[:checked]:bg-green-950/10 has-[:checked]:text-green-950"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTopicsToSave.has(name)}
                          onChange={() => toggleTopicToSave(name)}
                          className="rounded border-gray-300 text-gold focus:ring-gold"
                        />
                        {name}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Conteúdo (pode incluir menus e texto de interface)</p>
              <p className="text-[10px] text-gray-500 mb-1">O título do post é gerado a partir de «Result for …» ou do termo de busca na URL; o resto serve para encontrar as categorias.</p>
              <div className="text-xs bg-white border border-gray-100 rounded-xl p-4 overflow-auto max-h-48 whitespace-pre-wrap break-words text-gray-700">
                {displayText}
              </div>
            </div>
            {matchedCategories.length > 0 && (
              <form onSubmit={handleSaveTheme} className="flex flex-wrap items-center gap-3">
                <div>
                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    placeholder={generateTitleFromTopics(Array.from(selectedTopicsToSave)) || 'Título do tema (opcional)'}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gold w-64"
                    disabled={savingTheme}
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">Título já vem preenchido com um título completo extraído do conteúdo (pode editar). Este título é o que vai na requisição para a automação.</p>
                </div>
                <button
                  type="submit"
                  disabled={savingTheme || selectedTopicsToSave.size === 0}
                  className="inline-flex items-center gap-2 bg-green-950 hover:bg-gold text-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest disabled:opacity-60"
                >
                  <Save size={14} />
                  {savingTheme ? 'A guardar…' : `Guardar temas selecionados (${selectedTopicsToSave.size})`}
                </button>
              </form>
            )}
          </div>
          );
        })()}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
        <h4 className="text-sm font-black text-green-950 uppercase tracking-widest">Temas guardados</h4>
        <p className="text-xs text-gray-500">
          Marque os temas que quer enviar e use «Enviar selecionados» para a automação (webhook).
        </p>
        {themesLoading ? (
          <p className="text-sm text-gray-500">A carregar temas…</p>
        ) : themes.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum tema guardado. Pesquise uma URL e guarde como tema acima.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSendSelected}
                disabled={sendingSelected || selectedIds.size === 0}
                className="inline-flex items-center gap-1.5 bg-gold hover:bg-green-950 disabled:opacity-60 text-white px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all"
              >
                <Play size={14} />
                {sendingSelected ? 'A enviar…' : `Enviar selecionados (${selectedIds.size})`}
              </button>
              <button type="button" onClick={selectAll} className="text-xs font-bold text-gold hover:text-green-950" disabled={dispatchableThemes.length === 0}>
                Selecionar todos
              </button>
              <button type="button" onClick={selectNone} className="text-xs font-bold text-gray-500 hover:text-green-950">
                Desmarcar todos
              </button>
            </div>
            <ul className="space-y-2">
              {themes.map((t) => {
                const dispatched = Boolean(t.dispatched);
                return (
                  <li
                    key={t.id}
                    className={`flex flex-wrap items-center gap-3 p-4 rounded-xl border ${dispatched ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100'}`}
                  >
                    {dispatched ? (
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-widest shrink-0">
                          Enviado
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-green-950 truncate">{t.title || t.url}</p>
                          {t.title && <p className="text-xs text-gray-500 truncate">{t.url}</p>}
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(t.id)}
                          onChange={() => toggleSelected(t.id)}
                          className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-green-950 truncate">{t.title || t.url}</p>
                          {t.title && <p className="text-xs text-gray-500 truncate">{t.url}</p>}
                        </div>
                      </label>
                    )}
                    <div className="flex items-center gap-2">
                      {!dispatched && (
                        <button
                          type="button"
                          onClick={() => handleSendToAutomation(t.id)}
                          disabled={sendingThemeId !== null}
                          className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-green-950 px-3 py-1.5 rounded-lg font-bold text-[10px] tracking-widest uppercase transition-all"
                        >
                          <Play size={12} />
                          Enviar este
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteTheme(t.id)}
                        disabled={deletingThemeId !== null}
                        className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50"
                        aria-label="Eliminar tema"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default SerperResearchCard;
