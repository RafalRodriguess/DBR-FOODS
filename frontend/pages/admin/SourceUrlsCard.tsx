import React, { useCallback, useEffect, useState } from 'react';
import { Link2, Trash2, AlertCircle } from 'lucide-react';
import { listSourceUrls, createSourceUrl, deleteSourceUrl, getTavilyConfig } from '../../utils/blogApi';
import type { ThemeSourceUrl } from '../../utils/blogApi';

const SourceUrlsCard: React.FC = () => {
  const [sourceUrls, setSourceUrls] = useState<ThemeSourceUrl[]>([]);
  const [newUrlValue, setNewUrlValue] = useState('');
  const [newUrlLabel, setNewUrlLabel] = useState('');
  const [savingUrl, setSavingUrl] = useState(false);
  const [deletingUrlId, setDeletingUrlId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);

  const loadSourceUrls = useCallback(async () => {
    try {
      const list = await listSourceUrls();
      setSourceUrls(list);
    } catch {
      setSourceUrls([]);
    }
  }, []);

  useEffect(() => {
    getTavilyConfig()
      .then((c) => setConfigured(c.tavily_configured))
      .catch(() => setConfigured(false));
  }, []);

  useEffect(() => {
    if (configured) loadSourceUrls();
  }, [configured, loadSourceUrls]);

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
      await createSourceUrl({ url: u, label: newUrlLabel.trim() || null });
      setNewUrlValue('');
      setNewUrlLabel('');
      setMessage({ type: 'success', text: 'URL cadastrada. Use «Gerar temas» para varrer estas URLs.' });
      loadSourceUrls();
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
      loadSourceUrls();
    } finally {
      setDeletingUrlId(null);
    }
  };

  if (configured === null) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
        <p className="text-sm text-gray-500">A carregar…</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-sm font-bold text-green-950">URLs de referência</p>
          <p className="text-xs text-gray-600 mt-1">
            Configure <code className="bg-white px-1 rounded">TAVILY_API_KEY</code> no <code className="bg-white px-1 rounded">.env</code> do backend para usar o Gerar temas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Link2 size={18} className="text-gold" />
        <h4 className="text-sm font-black text-green-950 uppercase tracking-widest">Cadastrar URLs de referência</h4>
      </div>
      <p className="text-xs text-gray-500">
        Cadastre aqui as URLs que o «Gerar temas» vai varrer para extrair temas. Depois vá à aba <strong>Gerar temas</strong>, defina a quantidade e clique em Gerar.
      </p>
      {message && (
        <p className={`text-[10px] font-bold uppercase ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
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
          className="px-4 py-2 rounded-lg bg-green-950 text-white text-xs font-bold uppercase disabled:opacity-60 hover:bg-green-900"
        >
          {savingUrl ? 'A guardar…' : 'Cadastrar URL'}
        </button>
      </form>
      {sourceUrls.length > 0 && (
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">URLs cadastradas</p>
          <div className="flex flex-wrap gap-2">
            {sourceUrls.map((u) => (
              <span
                key={u.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs"
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
        </div>
      )}
    </div>
  );
};

export default SourceUrlsCard;
