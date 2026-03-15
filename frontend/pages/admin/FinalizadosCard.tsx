import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
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

const FinalizadosCard: React.FC<{ refreshTrigger?: number }> = ({ refreshTrigger = 0 }) => {
  const [themes, setThemes] = useState<BlogTheme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThemes = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listThemes('finalizados');
      setThemes(list);
    } catch {
      setThemes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThemes();
  }, [loadThemes, refreshTrigger]);

  const sorted = [...themes].sort((a, b) => {
    const da = a.dispatch_completed_at ?? '';
    const db = b.dispatch_completed_at ?? '';
    return db.localeCompare(da);
  });

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
      <h4 className="text-sm font-black text-green-950 uppercase tracking-widest">Finalizados</h4>
      <p className="text-xs text-gray-500">
        Temas processados pela automação — post criado (geralmente em rascunho). Abra o post para revisar e publicar.
      </p>
      {loading ? (
        <p className="text-sm text-gray-500">A carregar…</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum tema finalizado. Os enviados aparecem aqui quando o n8n conclui o callback.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((t) => (
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
                  Concluído: {formatDate(t.dispatch_completed_at)}
                </p>
                {t.dispatch_message && (
                  <p className="text-xs text-green-700 mt-1">{t.dispatch_message}</p>
                )}
                {(t.blog_post_title || t.blog_post_id) && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    Post: {t.blog_post_title ?? `ID ${t.blog_post_id}`} {t.blog_post_status && `(${t.blog_post_status})`}
                  </p>
                )}
              </div>
              {t.blog_post_id && (
                <Link
                  to={`/admin/blog/${t.blog_post_id}/edit`}
                  className="inline-flex items-center gap-1.5 bg-green-950 hover:bg-gold text-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-colors"
                >
                  <CheckCircle size={14} />
                  Abrir post / Aprovar
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FinalizadosCard;
