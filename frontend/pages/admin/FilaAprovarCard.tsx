import React, { useCallback, useEffect, useState } from 'react';
import { Play, Trash2, CheckCircle, XCircle } from 'lucide-react';
import {
  listThemes,
  deleteTheme,
  approveTheme,
  unapproveTheme,
  triggerCreatePostWebhook,
  getPostsQuota,
  TriggerWebhookError,
} from '../../utils/blogApi';
import type { BlogTheme, PostsQuota } from '../../utils/blogApi';

const FilaAprovarCard: React.FC<{
  refreshTrigger?: number;
  onThemesChange?: () => void;
  onSentToProgress?: () => void;
  onSendComplete?: () => void;
}> = ({ refreshTrigger = 0, onThemesChange, onSentToProgress, onSendComplete }) => {
  const [themes, setThemes] = useState<BlogTheme[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThemes = useCallback(async () => {
    setLoading(true);
    try {
      /** Combinação: queue (backend garante dispatched_at=null) + temas não aprovados da lista completa. Evita que finalizados apareçam na Fila. */
      const [queueList, allList] = await Promise.all([listThemes('queue'), listThemes()]);
      const queueIds = new Set(queueList.map((t) => t.id));
      const isDispatchedTheme = (t: BlogTheme) =>
        t.dispatched === true ||
        (t.dispatched_at != null && String(t.dispatched_at).trim() !== '') ||
        t.dispatch_status === 'completed' ||
        t.dispatch_status === 'failed' ||
        (t.dispatch_completed_at != null && String(t.dispatch_completed_at).trim() !== '') ||
        (typeof t.blog_post_id === 'number' && t.blog_post_id > 0);
      const unapproved = allList.filter((t) => !t.approved && !queueIds.has(t.id) && !isDispatchedTheme(t));
      setThemes([...queueList, ...unapproved]);
    } catch {
      setThemes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThemes();
  }, [loadThemes, refreshTrigger]);

  const refresh = useCallback(() => {
    loadThemes();
    onThemesChange?.();
  }, [loadThemes, onThemesChange]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sendingSelected, setSendingSelected] = useState(false);
  const [sendingThemeId, setSendingThemeId] = useState<number | null>(null);
  const [justSentIds, setJustSentIds] = useState<Set<number>>(new Set());
  const [deletingThemeId, setDeletingThemeId] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasThemeInProgress, setHasThemeInProgress] = useState(false);
  const [themeInProgressId, setThemeInProgressId] = useState<number | null>(null);
  const [quota, setQuota] = useState<PostsQuota | null>(null);

  const loadQuota = useCallback(async () => {
    try {
      const q = await getPostsQuota();
      setQuota(q);
    } catch {
      setQuota(null);
    }
  }, []);

  const loadInProgress = useCallback(async () => {
    try {
      const list = await listThemes('in_progress');
      setHasThemeInProgress(list.length > 0);
      setThemeInProgressId(list[0]?.id ?? null);
    } catch {
      setHasThemeInProgress(false);
      setThemeInProgressId(null);
    }
  }, []);

  useEffect(() => {
    loadInProgress();
  }, [loadInProgress, refreshTrigger]);

  useEffect(() => {
    loadQuota();
  }, [loadQuota, refreshTrigger]);

  /** Polling a cada 8s enquanto houver tema em progresso; quando o n8n finalizar, desbloqueia o envio. */
  useEffect(() => {
    if (!hasThemeInProgress) return;
    const id = setInterval(loadInProgress, 8000);
    return () => clearInterval(id);
  }, [hasThemeInProgress, loadInProgress]);

  /** Exclui temas já enviados/finalizados: não devem aparecer na Fila. Alinhado com scope=finalizados (dispatch_status=completed) e falhas. */
  const isDispatched = (t: BlogTheme): boolean => {
    if (t.dispatched === true) return true;
    const hasDispatchedAt = t.dispatched_at != null && String(t.dispatched_at).trim() !== '';
    if (hasDispatchedAt) return true;
    if (t.dispatch_status === 'completed' || t.dispatch_status === 'failed') return true;
    const hasCompletedAt = t.dispatch_completed_at != null && String(t.dispatch_completed_at).trim() !== '';
    if (hasCompletedAt) return true;
    if (typeof t.blog_post_id === 'number' && t.blog_post_id > 0) return true;
    return false;
  };
  const queueThemes = themes.filter((t) => !isDispatched(t) && !justSentIds.has(t.id));
  const approvedThemes = queueThemes.filter((t) => t.approved);
  const canSelect = (t: BlogTheme) => !isDispatched(t) && t.approved;
  const noQuotaRemaining = quota != null && quota.posts_remaining <= 0;
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

  const toggleSelected = (id: number) => {
    const theme = themes.find((t) => t.id === id);
    if (!theme || !canSelect(theme)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApprove = async (id: number) => {
    setApprovingId(id);
    setMessage(null);
    try {
      await approveTheme(id);
      refresh();
    } catch {
      setMessage({ type: 'error', text: 'Erro ao aprovar tema.' });
    } finally {
      setApprovingId(null);
    }
  };

  const handleUnapprove = async (id: number) => {
    setApprovingId(id);
    setMessage(null);
    try {
      await unapproveTheme(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      refresh();
    } catch {
      setMessage({ type: 'error', text: 'Erro ao desaprovar tema.' });
    } finally {
      setApprovingId(null);
    }
  };

  const handleSendOne = async (themeId: number) => {
    setSendingThemeId(themeId);
    setJustSentIds((prev) => new Set(prev).add(themeId));
    setMessage(null);
    onSentToProgress?.(); // vai para Em progresso imediatamente para aguardar a resposta
    try {
      await triggerCreatePostWebhook(themeId);
      setMessage({ type: 'success', text: 'Tema enviado. Aparece em «Em progresso».' });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
      refresh();
      loadInProgress(); // mantém bloqueio (há 1 em progresso)
      loadQuota(); // atualiza quota após envio
      onSendComplete?.();
      setJustSentIds((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao enviar.';
      setMessage({ type: 'error', text: msg });
      if (err instanceof TriggerWebhookError) {
        if (err.status === 409) {
          setHasThemeInProgress(true);
          const tid = err.data?.theme_id_in_progress;
          setThemeInProgressId(typeof tid === 'number' ? tid : null);
        }
        if (err.status === 403 && err.data) {
          const used = Number(err.data.posts_used_this_month ?? 0);
          const limit = Number(err.data.posts_monthly_limit ?? 20);
          setQuota({ posts_used_this_month: used, posts_monthly_limit: limit, posts_remaining: 0, resets_at: String(err.data.resets_at ?? '') });
        }
      }
      setJustSentIds((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
    } finally {
      setSendingThemeId(null);
    }
  };

  const handleSendSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      setMessage({ type: 'error', text: 'Selecione pelo menos um tema aprovado para enviar.' });
      return;
    }
    if (ids.length > 1) {
      setMessage({ type: 'error', text: 'Só pode enviar um tema por vez. Selecione apenas um.' });
      return;
    }
    const themeId = ids[0];
    setSendingSelected(true);
    setJustSentIds((prev) => new Set([...prev, themeId]));
    setMessage(null);
    onSentToProgress?.();
    try {
      await triggerCreatePostWebhook(themeId);
      setMessage({ type: 'success', text: `${ids.length} tema(s) enviado(s). Aparecem em «Em progresso».` });
      setSelectedIds(new Set());
      refresh();
      loadInProgress(); // mantém bloqueio (há 1 em progresso)
      loadQuota(); // atualiza quota após envio
      onSendComplete?.();
      setJustSentIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao enviar.';
      setMessage({ type: 'error', text: msg });
      if (err instanceof TriggerWebhookError) {
        if (err.status === 409) {
          setHasThemeInProgress(true);
          const tid = err.data?.theme_id_in_progress;
          setThemeInProgressId(typeof tid === 'number' ? tid : null);
        }
        if (err.status === 403 && err.data) {
          const used = Number(err.data.posts_used_this_month ?? 0);
          const limit = Number(err.data.posts_monthly_limit ?? 20);
          setQuota({ posts_used_this_month: used, posts_monthly_limit: limit, posts_remaining: 0, resets_at: String(err.data.resets_at ?? '') });
        }
      }
      setJustSentIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    } finally {
      setSendingSelected(false);
    }
  };

  const handleDelete = async (themeId: number) => {
    if (!window.confirm('Eliminar este tema da fila?')) return;
    setDeletingThemeId(themeId);
    setMessage(null);
    try {
      await deleteTheme(themeId);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
      refresh();
    } catch {
      setMessage({ type: 'error', text: 'Erro ao eliminar.' });
    } finally {
      setDeletingThemeId(null);
    }
  };

  const selectAllApproved = () => setSelectedIds(new Set(approvedThemes.map((t) => t.id)));
  const selectNone = () => setSelectedIds(new Set());

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4">
      <h4 className="text-sm font-black text-green-950 uppercase tracking-widest">Fila / Aprovar</h4>
      <p className="text-xs text-gray-500">
        Temas na fila (ainda não enviados). Aprove os que deseja enviar; depois selecione a quantidade e use «Enviar selecionados». Assim há rotatividade e controlo antes do envio.
      </p>
      {hasThemeInProgress && (
        <p className="text-xs text-amber-700 font-medium">
          Há um tema em processamento {themeInProgressId != null ? `(tema #${themeInProgressId})` : ''}. Aguarde finalizar para enviar outro.
        </p>
      )}
      {quota != null && (
        <p className={`text-xs font-medium ${noQuotaRemaining ? 'text-amber-700' : 'text-gray-600'}`}>
          {quota.posts_used_this_month}/{quota.posts_monthly_limit} posts este mês. Limite renova no dia 1.
        </p>
      )}
      {message && (
        <p className={`text-[10px] font-bold uppercase ${message.type === 'success' ? 'text-green-600' : 'text-red-600'} ${message.type === 'error' ? 'whitespace-pre-line' : ''}`}>
          {message.text}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-gray-500">A carregar fila…</p>
      ) : queueThemes.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum tema na fila. Use «Pesquisa» para guardar temas manualmente ou «Gerar temas» para varredura automática.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSendSelected}
              disabled={sendingSelected || selectedIds.size === 0 || hasThemeInProgress || noQuotaRemaining}
              className="inline-flex items-center gap-1.5 bg-gold hover:bg-green-950 disabled:opacity-60 text-white px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all"
            >
              <Play size={14} />
              {sendingSelected ? 'A enviar…' : `Enviar selecionados (${selectedIds.size})`}
            </button>
            <button type="button" onClick={selectAllApproved} className="text-xs font-bold text-gold hover:text-green-950" disabled={approvedThemes.length === 0}>
              Selecionar todos aprovados
            </button>
            <button type="button" onClick={selectNone} className="text-xs font-bold text-gray-500 hover:text-green-950">
              Desmarcar todos
            </button>
          </div>
          <ul className="space-y-2">
            {queueThemes.map((t) => {
              const approved = Boolean(t.approved);
              const selected = selectedIds.has(t.id);
              const canSend = approved;
              return (
                <li
                  key={t.id}
                  className={`flex flex-wrap items-center gap-3 p-4 rounded-xl border ${approved ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100'}`}
                >
                  {canSend ? (
                    <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelected(t.id)}
                        className="w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
                      />
                      <div className="min-w-0 flex-1">
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
                        <p className="text-[11px] text-gray-400">Gerado em: {formatCreatedAt(t.created_at)}</p>
                      </div>
                    </label>
                  ) : (
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
                      <p className="text-[11px] text-gray-400">Gerado em: {formatCreatedAt(t.created_at)}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {approved ? (
                      <button
                        type="button"
                        onClick={() => handleUnapprove(t.id)}
                        disabled={approvingId !== null}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-950/10 text-green-950 text-[10px] font-bold uppercase disabled:opacity-50"
                        title="Desaprovar"
                      >
                        <XCircle size={12} /> Desaprovar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApprove(t.id)}
                        disabled={approvingId !== null}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold uppercase hover:bg-gold hover:text-white disabled:opacity-50"
                        title="Aprovar"
                      >
                        <CheckCircle size={12} /> Aprovar
                      </button>
                    )}
                    {canSend && (
                      <button
                        type="button"
                        onClick={() => handleSendOne(t.id)}
                        disabled={sendingThemeId !== null || hasThemeInProgress || noQuotaRemaining}
                        className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-green-950 px-3 py-1.5 rounded-lg font-bold text-[10px] tracking-widest uppercase transition-all disabled:opacity-50"
                      >
                        <Play size={12} /> Enviar este
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingThemeId !== null}
                      className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50"
                      aria-label="Eliminar"
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
  );
};

export default FilaAprovarCard;
