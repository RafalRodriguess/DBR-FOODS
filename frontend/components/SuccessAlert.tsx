import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

type Props = {
  message: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
  className?: string;
};

const SuccessAlert: React.FC<Props> = ({ message, onDismiss, autoDismissMs = 3500, className = '' }) => {
  useEffect(() => {
    if (!onDismiss || autoDismissMs <= 0) return;
    const timer = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  return (
    <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border border-green-200 bg-green-50 text-green-800 ${className}`} role="status" aria-live="polite">
      <CheckCircle2 size={22} className="shrink-0 text-green-600" />
      <p className="font-bold text-sm flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg shrink-0 text-green-600 hover:bg-green-100"
          aria-label="Fechar alerta"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SuccessAlert;
