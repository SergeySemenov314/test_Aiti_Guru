import { useEffect, useState, useCallback } from 'react';
import { create } from 'zustand';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastState {
  toasts: ToastData[];
  add: (message: string, type?: 'success' | 'error') => void;
  remove: (id: number) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  add: (message, type = 'success') => {
    const id = Date.now();
    set({ toasts: [...get().toasts, { id, message, type }] });
  },
  remove: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));

function ToastItem({ toast }: { toast: ToastData }) {
  const remove = useToastStore((s) => s.remove);
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => remove(toast.id), 200);
  }, [remove, toast.id]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(dismiss, 3000);
    return () => clearTimeout(timer);
  }, [dismiss]);

  const bg = toast.type === 'success'
    ? 'bg-green-600'
    : 'bg-red-600';

  return (
    <div
      className={`${bg} text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium
        transition-all duration-200 cursor-pointer
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
      onClick={dismiss}
    >
      {toast.message}
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
