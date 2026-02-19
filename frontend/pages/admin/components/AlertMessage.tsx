import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export type AlertMessageType = 'success' | 'error';

type Props = {
  type: AlertMessageType;
  message: string;
  onDismiss?: () => void;
  /** Auto-dismiss após N ms. Não define = não fecha sozinho. */
  autoDismissMs?: number;
  className?: string;
};

const AlertMessage: React.FC<Props> = ({ type, message, onDismiss, autoDismissMs, className = '' }) => {
  useEffect(() => {
    if (autoDismissMs == null || !onDismiss) return;
    const t = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [autoDismissMs, onDismiss]);

  const isSuccess = type === 'success';
  const wrapperClass = isSuccess
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-red-50 border-red-200 text-red-800';
  const iconClass = isSuccess ? 'text-green-600' : 'text-red-600';
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${wrapperClass} ${className}`}
      role="alert"
    >
      <Icon size={22} className={`shrink-0 ${iconClass}`} />
      <p className="font-bold text-sm flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={`p-1 rounded-lg shrink-0 ${isSuccess ? 'text-green-600 hover:bg-green-100' : 'text-red-600 hover:bg-red-100'}`}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
