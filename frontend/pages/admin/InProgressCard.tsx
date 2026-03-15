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

function payloadPostInfo(payload?: Record<string, unknown> | null): string {
  if (!payload || typeof payload !== 'object') return '';
  const post = payload.blog_post;
  if (!post || typeof post !== 'object') return '';
  const title = typeof (post as { title?: unknown }).title === 'string' ? String((post as { title?: unknown }).title).trim() : '';
  const idRaw = (post as { id?: unknown }).id;
  const id = typeof idRaw === 'number' || typeof idRaw === 'string' ? String(idRaw) : '';
  if (title && id) return `Post: ${title} (ID ${id})`;
  if (title) return `Post: ${title}`;
  if (id) return `Post ID: ${id}`;
  return '';
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

const InProgressCard: React.FC<{ refreshTrigger?: number }> = ({ refreshTrigger = 0 }) => {
  const [themes, setThemes] = useState<BlogTheme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThemes = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listThemes('in_progress');
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

  /** Polling a cada 12s enquanto houver itens (doc §2): ao callback saem daqui. Paragem em 3 min no máximo. */
  useEffect(() => {
    if (themes.length === 0) return;
    const POLL_INTERVAL_MS = 12000; // 10–15 s conforme doc
    const MAX_POLLING_MS = 180000;   // 3 min
    const id = setInterval(loadThemes, POLL_INTERVAL_MS);
    const maxTimeout = setTimeout(() => {
      clearInterval(id);
      loadThemes(); // último refetch antes de parar
    }, MAX_POLLING_MS);
    return () => {
      clearInterval(id);
      clearTimeout(maxTimeout);
    };
  }, [themes.length, loadThemes]);

  const inProgress = [...themes].sort((a, b) => {
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
        <p className="text-sm text-gray-500">Nenhum tema em processamento neste momento. Os enviados aparecem aqui até o callback; depois passam para «Finalizados».</p>
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
                {t.dispatch_completed_at && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Finalizado: {formatDate(t.dispatch_completed_at)}
                  </p>
                )}
                {t.dispatch_message && (
                  <p className={`text-xs mt-1 ${t.dispatch_status === 'failed' ? 'text-red-600' : 'text-green-700'}`}>
                    {t.dispatch_message}
                  </p>
                )}
                {!t.dispatch_message && payloadPostInfo(t.dispatch_payload) && (
                  <p className="text-xs text-green-700 mt-1">{payloadPostInfo(t.dispatch_payload)}</p>
                )}
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
