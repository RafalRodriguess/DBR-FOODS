import React, { useCallback, useEffect, useState } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import {
  createTheme,
  listSourceUrls,
  listCategories,
  listThemes,
  tavilyCrawl,
} from '../../utils/blogApi';
import type { ThemeSourceUrl } from '../../utils/blogApi';
import type { BlogCategory } from '../../utils/blogApi';
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
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [quantity, setQuantity] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [progress, setProgress] = useState<string>('');

  const loadSourceUrls = useCallback(async () => {
    try {
      const list = await listSourceUrls();
      setSourceUrls(list);
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

  useEffect(() => {
    if (configured) {
      loadSourceUrls();
      loadCategories();
    }
  }, [configured, loadSourceUrls, loadCategories]);

  /** Normaliza título para comparação (evitar duplicados). */
  const normalizeTitle = (t: string | null | undefined): string =>
    (t ?? '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 80);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceUrls.length === 0) {
      setMessage({ type: 'error', text: 'Cadastre pelo menos uma URL em «Cadastrar URLs».' });
      return;
    }
    if (categories.length === 0) {
      setMessage({ type: 'error', text: 'Nenhuma categoria do blog disponível.' });
      return;
    }
    const n = Math.max(1, Math.min(50, quantity));
    setMessage(null);
    setGenerating(true);

    let existingThemes: { url: string; title: string | null }[] = [];
    try {
      const list = await listThemes();
      existingThemes = list.map((t) => ({ url: t.url, title: t.title ?? null }));
    } catch {
      // segue sem lista de existentes
    }

    const totalUrls = sourceUrls.length;
    let created = 0;
    let urlRoundIndex = 0;
    const maxRounds = Math.ceil(n / Math.max(1, totalUrls)) + 2;
    const maxUrlAttempts = maxRounds * totalUrls;

    while (created < n && urlRoundIndex < maxUrlAttempts) {
      const urlIdx = urlRoundIndex % totalUrls;
      const urlObj = sourceUrls[urlIdx];
      const position = urlIdx + 1;
      setProgress(`URL ${position}/${totalUrls}: ${urlObj.label || urlObj.url} — ${created} tema(s) gerado(s)`);
      urlRoundIndex++;
      try {
        const data = await tavilyCrawl(urlObj.url);
        const results = data.results ?? [];
        for (const result of results) {
          if (created >= n) break;
          if (result.raw_content == null || result.raw_content === '') continue;
          const pageUrl = result.url || data.url;
          const displayText = getDisplayText(result);
          if (!displayText || displayText.trim().length < 50) continue;
          let matchedNames = matchCategoriesInText(displayText, categories);
          const useFallbackCategory = matchedNames.length === 0 && categories.length > 0;
          if (matchedNames.length === 0 && !useFallbackCategory) continue;
          if (useFallbackCategory) matchedNames = [categories[0].name];
          const blogCategoryIds = matchedNames
            .map((name) => categories.find((c) => c.name === name)?.id)
            .filter((id): id is number => id != null);
          const content = contentFromScrapeResult(result);
          const extractedTitle = extractTitleFromContent(displayText, pageUrl);
          const fallbackTitle = generateTitleFromTopics(matchedNames);
          const titleToSave = extractedTitle || fallbackTitle || null;
          const normNew = normalizeTitle(titleToSave);
          const alreadySameUrlAndTitle = existingThemes.some(
            (e) => e.url === pageUrl && normNew && normalizeTitle(e.title) === normNew
          );
          if (alreadySameUrlAndTitle) continue;
          await createTheme({
            url: pageUrl,
            title: titleToSave || null,
            blog_category_ids: blogCategoryIds.length > 0 ? blogCategoryIds : undefined,
            content: content || null,
            topics: matchedNames,
          });
          created++;
          existingThemes.push({ url: pageUrl, title: titleToSave });
        }
      } catch {
        // esta URL falhou, segue para a próxima na fila
      }
    }

    setGenerating(false);
    setProgress('');
    if (created > 0) {
      setMessage({ type: 'success', text: `${created} tema(s) gerado(s) e adicionados à fila. Vá à aba «Fila / Aprovar» para aprovar e enviar.` });
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
        Fila por URL: o sistema verifica <strong>uma URL de cada vez</strong>, na ordem da lista. Para cada URL gera no máximo 1 tema; depois passa à próxima. Com 5 URLs e quantidade 5, processa as 5 em sequência (1 tema por URL).
      </p>
      {sourceUrls.length === 0 ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-amber-800">Nenhuma URL cadastrada. Vá à aba <strong>Cadastrar URLs</strong> e adicione as URLs de referência.</p>
        </div>
      ) : (
        <>
          <ul className="text-xs text-gray-500 list-disc list-inside">
            {sourceUrls.slice(0, 10).map((u) => (
              <li key={u.id}>{u.label || u.url}</li>
            ))}
            {sourceUrls.length > 10 && <li>… e mais {sourceUrls.length - 10}</li>}
          </ul>
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
        </>
      )}
      {message && (
        <p className={`text-[10px] font-bold uppercase ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default GenerateThemesCard;
