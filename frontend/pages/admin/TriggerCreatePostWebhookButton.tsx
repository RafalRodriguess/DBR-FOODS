import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { triggerCreatePostWebhook } from '../../utils/blogApi';

const TriggerCreatePostWebhookButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleClick = async () => {
    setMessage(null);
    setLoading(true);
    try {
      await triggerCreatePostWebhook();
      setMessage({ type: 'success', text: 'Fluxo iniciado com sucesso.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao disparar webhook.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="bg-gold hover:bg-green-950 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 w-fit"
      >
        <Play size={16} />
        {loading ? 'A disparar…' : 'Disparar webhook (criar post)'}
      </button>
      {message && (
        <span
          className={`text-[10px] font-bold uppercase ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </span>
      )}
    </div>
  );
};

export default TriggerCreatePostWebhookButton;
