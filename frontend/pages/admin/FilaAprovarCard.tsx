import React, { useCallback, useEffect, useState } from 'react';
import { Play, Trash2, CheckCircle, XCircle } from 'lucide-react';
import {
  listThemes,
  deleteTheme,
  approveTheme,
  unapproveTheme,
  triggerCreatePostWebhook,
} from '../../utils/blogApi';
import type { BlogTheme } from '../../utils/blogApi';

const FilaAprovarCard: React.FC<{
  onThemesChange?: () => void;
}> = ({ onThemesChange }) => {
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

  const queueThemes = themes.filter((t) => !t.dispatched && !justSentIds.has(t.id));
  const approvedThemes = queueThemes.filter((t) => t.approved);
  const canSelect = (t: BlogTheme) => !t.dispatched && t.approved;

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
    try {
      await triggerCreatePostWebhook(themeId);
      setMessage({ type: 'success', text: 'Tema enviado. Aparece em «Em progresso».' });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
      refresh();
      setJustSentIds((prev) => {
        const next = new Set(prev);
        next.delete(themeId);
        return next;
      });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao enviar.' });
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
    setSendingSelected(true);
    setJustSentIds((prev) => new Set([...prev, ...ids]));
    setMessage(null);
    try {
      await triggerCreatePostWebhook(ids);
      setMessage({ type: 'success', text: `${ids.length} tema(s) enviado(s). Aparecem em «Em progresso».` });
      setSelectedIds(new Set());
      refresh();
      setJustSentIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao enviar.' });
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
              disabled={sendingSelected || selectedIds.size === 0}
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
                        disabled={sendingThemeId !== null}
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
