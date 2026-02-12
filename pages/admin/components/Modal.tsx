import React from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, title, children, onClose, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/45" onClick={onClose} aria-label="Fechar modal" />
      <div className="relative w-full max-w-2xl bg-white rounded-[1.5rem] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-black text-green-950 tracking-tight">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-lg bg-gray-50 text-gray-500 hover:text-green-950 transition-colors" aria-label="Fechar">
            <X size={18} className="mx-auto" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
