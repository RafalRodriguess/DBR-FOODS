/**
 * Popup de notificação «Post criado com sucesso» com som. Usado quando o n8n completa o callback.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

function playSuccessSound(): void {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.frequency.value = 523;
    osc2.frequency.value = 659;
    osc1.type = 'sine';
    osc2.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.08);
    osc1.stop(ctx.currentTime + 0.25);
    osc2.stop(ctx.currentTime + 0.33);
  } catch {
    /* ignore */
  }
}

type ContextValue = {
  showPostCreatedSuccess: () => void;
};

const PostCreatedToastContext = createContext<ContextValue | null>(null);

export function usePostCreatedToast(): ContextValue {
  const ctx = useContext(PostCreatedToastContext);
  if (!ctx) throw new Error('usePostCreatedToast must be used within PostCreatedToastProvider');
  return ctx;
}

export function PostCreatedToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  const showPostCreatedSuccess = useCallback(() => {
    playSuccessSound();
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, [visible]);

  const dismiss = useCallback(() => setVisible(false), []);

  return (
    <PostCreatedToastContext.Provider value={{ showPostCreatedSuccess }}>
      {children}
      {visible && (
        <div
          className="fixed top-4 right-4 z-[9999] translate-x-0 opacity-100 transition-all duration-300"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-green-300 bg-green-50 shadow-lg">
            <CheckCircle2 size={28} className="shrink-0 text-green-600" />
            <div>
              <p className="font-black text-green-950 text-sm uppercase tracking-wider">Post criado com sucesso</p>
              <p className="text-xs text-green-700 mt-0.5">O post está em rascunho. Abra em Finalizados para revisar.</p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="p-1.5 rounded-lg shrink-0 text-green-700 hover:bg-green-100 transition-colors"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </PostCreatedToastContext.Provider>
  );
}
