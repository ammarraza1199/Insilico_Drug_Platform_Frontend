import React from 'react';
import { useToastStore, ToastType } from '../../stores/toastStore';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/formatters';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="text-scientific-green" size={18} />,
  error: <AlertCircle className="text-scientific-red" size={18} />,
  info: <Info className="text-scientific-blue" size={18} />,
  warning: <AlertTriangle className="text-scientific-amber" size={18} />,
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "group flex items-center justify-between gap-3 p-4 rounded-xl border bg-white shadow-lg animate-in slide-in-from-right-10 duration-300",
            toast.type === 'error' && "border-red-100 bg-red-50/30",
            toast.type === 'success' && "border-green-100 bg-green-50/30"
          )}
        >
          <div className="flex items-center gap-3">
            {icons[toast.type]}
            <p className="text-sm font-medium text-slate-900">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
