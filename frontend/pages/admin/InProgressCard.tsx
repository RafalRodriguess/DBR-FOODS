import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
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

function statusBadge(status: BlogTheme['dispatch_status']) {
  const s = status ?? 'processing';
  if (s === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-widest">
        <CheckCircle size={12} /> Pronto
      </span>
    );
  }
  if (s === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-widest">
        <XCircle size={12} /> Erro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest">
      <Loader2 size={12} className="animate-spin" /> Em preparo
    </span>
  );
}

const InProgressCard: React.FC = () => {
  const [themes, setThemes] = useState<BlogTheme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThemes = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listThemes();
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

  const inProgress = themes.filter((t) => t.dispatched && t.approved).sort((a, b) => {
    const da = a.dispatched_at ?? '';
    const db = b.dispatched_at ?? '';
    return db.localeCompare(da);
  });

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
      <h4 className="text-sm font-black text-green-950 uppercase tracking-widest">Em progresso</h4>
      <p className="text-xs text-gray-500">
        Apenas temas que aprovaste antes de enviar. «Em preparo» = a processar; «Pronto» = post criado; «Erro» = falha.
      </p>
      {loading ? (
        <p className="text-sm text-gray-500">A carregar…</p>
      ) : inProgress.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum tema aprovado e enviado. Aprova e envia temas na aba «Fila / Aprovar».</p>
      ) : (
        <ul className="space-y-2">
          {inProgress.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white">
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
                  Enviado: {formatDate(t.dispatched_at)}
                </p>
              </div>
              {statusBadge(t.dispatch_status)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InProgressCard;
