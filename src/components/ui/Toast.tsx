import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const bgColors = {
          success: 'bg-[#C8F2C2] border-[#A8EDE5] text-[#167F83]',
          warning: 'bg-[#FFF0AD] border-[#FFD8B8] text-[#167F83]',
          error: 'bg-[#FFD1DC] border-[#FFD8B8] text-[#167F83]',
          info: 'bg-[#B5EAF7] border-[#A8EDE5] text-[#167F83]',
        }[toast.type];

        const Icon = {
          success: CheckCircle2,
          warning: AlertCircle,
          error: AlertCircle,
          info: Info,
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border-3 shadow-md backdrop-blur-sm
              transition-all duration-300 animate-fadeIn
              ${bgColors}
            `}
          >
            <Icon className="w-6 h-6 flex-shrink-0 mt-0.5 stroke-[2.5]" />
            <div className="flex-1 text-sm font-black">
              {toast.title && <div className="font-black text-base mb-0.5">{toast.title}</div>}
              <div className="font-bold text-xs">{toast.message}</div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:brightness-105 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
