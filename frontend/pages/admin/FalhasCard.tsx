import React, { useCallback, useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { listThemes } from '../../utils/blogApi';
import type { BlogTheme } from '../../utils/blogApi';

function formatDate(iso?: string | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return '';
  }
}

const FalhasCard: React.FC = () => {
  const [themes, setThemes] = useState<BlogTheme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThemes = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listThemes('falhas');
      setThemes(list);
    } catch {
      setThemes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  const sorted = [...themes].sort((a, b) => {
    const da = a.dispatch_completed_at ?? '';
    const db = b.dispatch_completed_at ?? '';
    return db.localeCompare(da);
  });

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
      <h4 className="text-sm font-black text-green-950 uppercase tracking-widest">Falhas</h4>
      <p className="text-xs text-gray-500">
        Temas cujo envio ou processamento falhou. Verifique <code className="bg-white px-1 rounded">dispatch_message</code> e o fluxo n8n.
      </p>
      {loading ? (
        <p className="text-sm text-gray-500">A carregar…</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma falha registada.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-red-100 bg-red-50/30">
              <div className="flex-1 min-w-0">
                {t.category_names && t.category_names.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {t.category_names.map((name) => (
                      <span key={name} className="px-2 py-0.5 rounded-md bg-green-950/10 text-green-950 text-[10px] font-bold uppercase tracking-wider">
                        {name}
                      </span>
                    ))}
                  </div>
                )}
                <p className="font-medium text-green-950 truncate">{t.title || t.url}</p>
                <p className="text-xs text-gray-500 truncate">{t.url}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Enviado: {formatDate(t.dispatched_at)} — Falhou: {formatDate(t.dispatch_completed_at)}
                </p>
                {t.dispatch_message && (
                  <p className="text-xs text-red-700 mt-1 font-medium">{t.dispatch_message}</p>
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-widest shrink-0">
                <XCircle size={12} /> Erro
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FalhasCard;
