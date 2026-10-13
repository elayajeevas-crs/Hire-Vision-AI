import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { uid } from '@/lib/utils';

type ToastKind = 'success' | 'error' | 'info';
interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = uid('toast');
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const iconFor = (kind: ToastKind) => {
    if (kind === 'success') return <CheckCircle2 size={18} className="text-signal-teal" />;
    if (kind === 'error') return <XCircle size={18} className="text-signal-coral" />;
    return <Info size={18} className="text-signal-amber" />;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[min(360px,90vw)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="flex items-start gap-3 rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 shadow-glow"
          >
            {iconFor(t.kind)}
            <p className="flex-1 text-sm text-mist-100">{t.message}</p>
            <button
              aria-label="Dismiss notification"
              onClick={() => dismiss(t.id)}
              className="text-mist-400 hover:text-mist-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
