import React, { useCallback, useEffect, useState } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import {
  createTheme,
  listSourceUrls,
  listCategories,
  listThemes,
  tavilyCrawl,
  suggestCategory,
} from '../../utils/blogApi';
import type { ThemeSourceUrl } from '../../utils/blogApi';
import type { BlogCategory } from '../../utils/blogApi';
import type { BlogTheme } from '../../utils/blogApi';
import {
  contentFromScrapeResult,
  getDisplayText,
  matchCategoriesInText,
  extractTitleFromContent,
  generateTitleFromTopics,
} from '../../utils/blogThemeUtils';

const GenerateThemesCard: React.FC<{
  configured: boolean;
  onThemesCreated: () => void;
}> = ({ configured, onThemesCreated }) => {
  const [sourceUrls, setSourceUrls] = useState<ThemeSourceUrl[]>([]);
  const [selectedUrlIds, setSelectedUrlIds] = useState<Set<number>>(new Set());
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [quantity, setQuantity] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [requestedCount, setRequestedCount] = useState(0);
  const [processedUrlsCount, setProcessedUrlsCount] = useState(0);
  const [lastGeneratedThemes, setLastGeneratedThemes] = useState<BlogTheme[]>([]);
  const [recentThemes, setRecentThemes] = useState<BlogTheme[]>([]);

  const loadSourceUrls = useCallback(async () => {
    try {
      const list = await listSourceUrls();
      setSourceUrls(list);
      setSelectedUrlIds((prev) => {
        if (prev.size === 0 && list.length > 0) return new Set(list.map((u) => u.id));
        return new Set([...prev].filter((id) => list.some((u) => u.id === id)));
      });
    } catch {
      setSourceUrls([]);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const list = await listCategories();
      setCategories(list);
    } catch {
      setCategories([]);
    }
  }, []);

  const loadRecentThemes = useCallback(async () => {
    try {
      const list = await listThemes();
      setRecentThemes(list.slice(0, 8));
    } catch {
      setRecentThemes([]);
    }
  }, []);

  useEffect(() => {
    if (configured) {
      loadSourceUrls();
      loadCategories();
      loadRecentThemes();
    }
  }, [configured, loadSourceUrls, loadCategories, loadRecentThemes]);

  /** Ao carregar URLs, selecionar todas por padrão. */
  useEffect(() => {
    if (sourceUrls.length > 0) {
      setSelectedUrlIds((prev) => {
        const allIds = new Set(sourceUrls.map((u) => u.id));
        if (prev.size === 0) return allIds;
        return new Set([...prev].filter((id) => allIds.has(id)));
      });
    }
  }, [sourceUrls]);

  const toggleUrlSelection = (id: number) => {
    setSelectedUrlIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectAllUrls = () => setSelectedUrlIds(new Set(sourceUrls.map((u) => u.id)));
  const selectNoneUrls = () => setSelectedUrlIds(new Set());

  const urlsToUse = sourceUrls.filter((u) => selectedUrlIds.has(u.id));

  /** Normaliza título para comparação (evitar duplicados). */
  const normalizeTitle = (t: string | null | undefined): string =>
    (t ?? '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 80);

  /** Assinatura estável dos tópicos para impedir temas semanticamente iguais. */
  const topicsSignature = (topics: string[] | null | undefined): string =>
    (topics ?? [])
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .join('|');

  const formatCreatedAt = (value?: string | null): string => {
    if (!value) return 'Data não disponível';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 'Data inválida';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (urlsToUse.length === 0) {
      setMessage({ type: 'error', text: 'Selecione pelo menos uma URL para buscar temas.' });
      return;
    }
    if (categories.length === 0) {
      setMessage({ type: 'error', text: 'Nenhuma categoria do blog disponível.' });
      return;
    }
    const n = Math.max(1, Math.min(50, quantity));
    setMessage(null);
    setGenerating(true);
    setRequestedCount(n);
    setProcessedUrlsCount(0);
    setLastGeneratedThemes([]);

    let existingThemes: { url: string; title: string | null; topics?: string[] }[] = [];
    const usedTopicSignatures = new Set<string>();
    const createdThisRun: BlogTheme[] = [];
    try {
      const list = await listThemes();
      existingThemes = list.map((t) => ({ url: t.url, title: t.title ?? null, topics: t.topics ?? [] }));
      for (const t of list) {
        const sig = topicsSignature(t.topics ?? []);
        if (sig) usedTopicSignatures.add(sig);
      }
    } catch {
      // segue sem lista de existentes
    }

    const totalUrls = urlsToUse.length;
    let created = 0;
    let urlRoundIndex = 0;
    const maxRounds = Math.ceil(n / Math.max(1, totalUrls)) + 2;
    const maxUrlAttempts = maxRounds * totalUrls;

    while (created < n && urlRoundIndex < maxUrlAttempts) {
      const urlIdx = urlRoundIndex % totalUrls;
      const urlObj = urlsToUse[urlIdx];
      const position = urlIdx + 1;
      setProgress(`URL ${position}/${totalUrls}: ${urlObj.label || urlObj.url} — ${created} tema(s) gerado(s)`);
      urlRoundIndex++;
      setProcessedUrlsCount(urlRoundIndex);
      try {
        const data = await tavilyCrawl(urlObj.url);
        const results = data.results ?? [];
        let createdForCurrentUrl = false;
        for (const result of results) {
          if (created >= n || createdForCurrentUrl) break;
          if (result.raw_content == null || result.raw_content === '') continue;
          const pageUrl = result.url || data.url;
          const displayText = getDisplayText(result);
          if (!displayText || displayText.trim().length < 50) continue;
          let matchedNames = matchCategoriesInText(displayText, categories);
          let blogCategoryIds: number[];
          const extractedTitle = extractTitleFromContent(displayText, pageUrl);
          if (matchedNames.length > 0) {
            blogCategoryIds = matchedNames
              .map((name) => categories.find((c) => c.name === name)?.id)
              .filter((id): id is number => id != null);
          } else {
            /** doc §2.1: categoria mais próxima — não exige match exato */
            const suggested = await suggestCategory({
              title: extractedTitle || undefined,
              text: extractedTitle ? undefined : displayText.slice(0, 500),
            });
            if (!suggested) continue;
            blogCategoryIds = [suggested.id];
            matchedNames = [suggested.name];
          }
          const signature = topicsSignature(matchedNames);
          if (signature && usedTopicSignatures.has(signature)) continue;
          const content = contentFromScrapeResult(result);
          const fallbackTitle = generateTitleFromTopics(matchedNames);
          const titleToSave = extractedTitle || fallbackTitle || null;
          const normNew = normalizeTitle(titleToSave);
          const alreadySameUrl = existingThemes.some((e) => e.url === pageUrl);
          if (alreadySameUrl) continue;
          const alreadySameTitle = existingThemes.some(
            (e) => normNew && normalizeTitle(e.title) === normNew
          );
          if (alreadySameTitle) continue;
          const createdTheme = await createTheme({
            url: pageUrl,
            title: titleToSave || null,
            blog_category_ids: blogCategoryIds.length > 0 ? blogCategoryIds : undefined,
            content: content || null,
            topics: matchedNames,
          });
          created++;
          createdForCurrentUrl = true;
          createdThisRun.push(createdTheme);
          existingThemes.push({ url: pageUrl, title: titleToSave, topics: matchedNames });
          if (signature) usedTopicSignatures.add(signature);
        }
      } catch {
        // esta URL falhou, segue para a próxima na fila
      }
    }

    setGenerating(false);
    setProgress('');
    setLastGeneratedThemes(createdThisRun);
    loadRecentThemes();
    if (created > 0) {
      setMessage({
        type: 'success',
        text: `${created} de ${n} tema(s) gerado(s) com sucesso e adicionados à fila. Agora pode aprovar e enviar na aba «Fila / Aprovar».`,
      });
      onThemesCreated();
    } else {
      setMessage({
        type: 'error',
        text: 'Nenhum tema novo encontrado. Verifique se as categorias do blog batem com o conteúdo das URLs ou cadastre mais URLs.',
      });
    }
  };

  if (!configured) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Zap size={18} className="text-gold" />
        <h4 className="text-sm font-black text-green-950 uppercase tracking-widest">Gerar temas (varredura de URLs)</h4>
      </div>
      <p className="text-xs text-gray-500">
        1º Cadastre URLs em «Cadastrar URLs» → 2º Selecione quais URLs usar abaixo → 3º Defina a quantidade e clique em Gerar. A busca será feita <strong>apenas nas URLs selecionadas</strong>.
      </p>
      {sourceUrls.length === 0 ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-amber-800">Nenhuma URL cadastrada. Vá à aba <strong>Cadastrar URLs</strong> e adicione as URLs de referência.</p>
        </div>
      ) : (
        <>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Selecionar URLs para a busca (marcadas serão varridas)</p>
            <div className="flex flex-wrap gap-2 mb-2">
              <button type="button" onClick={selectAllUrls} className="text-xs font-bold text-gold hover:text-green-950">Selecionar todas</button>
              <button type="button" onClick={selectNoneUrls} className="text-xs font-bold text-gray-500 hover:text-green-950">Desmarcar todas</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sourceUrls.map((u) => (
                <label
                  key={u.id}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                    selectedUrlIds.has(u.id)
                      ? 'border-green-950 bg-green-950/10 text-green-950'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedUrlIds.has(u.id)}
                    onChange={() => toggleUrlSelection(u.id)}
                    className="rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  {u.label || u.url}
                </label>
              ))}
            </div>
            {urlsToUse.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">{urlsToUse.length} URL(s) selecionada(s) — a busca usará apenas estas.</p>
            )}
          </div>
          <form onSubmit={handleGenerate} className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quantidade de temas</label>
              <input
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 5)}
                disabled={generating}
                className="w-24 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <button
              type="submit"
              disabled={generating}
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-green-950 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shrink-0"
            >
              <Zap size={16} />
              {generating ? 'A gerar…' : 'Gerar temas'}
            </button>
          </form>
          {generating && progress && <p className="text-xs text-gray-500">{progress}</p>}
          {generating && (
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Processo de geração</p>
              <p className="text-xs text-gray-600 mt-1">
                Solicitado: <strong>{requestedCount}</strong> tema(s) | URLs processadas: <strong>{processedUrlsCount}</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">A geração evita temas duplicados por URL, título e tópicos.</p>
            </div>
          )}
        </>
      )}
      {message && (
        <p className={`text-[10px] font-bold uppercase ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
      {lastGeneratedThemes.length > 0 && (
        <div className="rounded-xl border border-green-100 bg-green-50/40 p-4 space-y-2">
          <p className="text-[10px] font-black text-green-900 uppercase tracking-widest">Finalização: temas gerados</p>
          <ul className="space-y-2">
            {lastGeneratedThemes.map((t) => (
              <li key={t.id} className="rounded-lg border border-green-100 bg-white p-3">
                <p className="text-sm font-semibold text-green-950 truncate">{t.title || t.url}</p>
                <p className="text-xs text-gray-500 truncate">{t.url}</p>
                {t.topics && t.topics.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">Tópicos: {t.topics.join(', ')}</p>
                )}
                <p className="text-[11px] text-gray-400 mt-1">Gerado em: {formatCreatedAt(t.created_at)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {recentThemes.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Últimos temas gerados</p>
          <ul className="space-y-2">
            {recentThemes.map((t) => (
              <li key={`recent-${t.id}`} className="text-xs text-gray-700">
                <span className="font-semibold text-green-950">{t.title || t.url}</span>
                <span className="text-gray-500"> — {formatCreatedAt(t.created_at)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GenerateThemesCard;
