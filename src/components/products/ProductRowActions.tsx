import { useEffect, useState, useRef } from 'react';
import type { Product } from '../../store/productsStore';
import settingsIcon from '../../assets/settings.png';

interface ProductRowActionsProps {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

export function ProductRowActions({ product, onEdit, onDelete }: ProductRowActionsProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
      >
        <img src={settingsIcon} alt="Настройки" className="w-8 h-8" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            onClick={() => { setOpen(false); onEdit(product); }}
          >
            Изменить
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            onClick={() => { setOpen(false); onDelete(product); }}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}
