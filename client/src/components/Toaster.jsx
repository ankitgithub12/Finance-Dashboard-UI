import { useNotificationStore } from '../store/useNotificationStore';
import { X, Bell } from 'lucide-react';

export default function Toaster() {
  const { toasts, removeToast } = useNotificationStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="pointer-events-auto w-80 glass-panel p-4 shadow-xl border border-primary/20 animate-in slide-in-from-right-8 fade-in duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-textMain">{toast.title}</h4>
              <p className="text-xs text-textMuted mt-1 line-clamp-2">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-md text-textMuted hover:bg-surface-2 hover:text-textMain transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
