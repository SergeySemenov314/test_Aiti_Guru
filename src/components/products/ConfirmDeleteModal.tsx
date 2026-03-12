import type { Product } from '../../store/productsStore';
import { Button } from '../ui/Button';

interface ConfirmDeleteModalProps {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ product, onConfirm, onCancel }: ConfirmDeleteModalProps): JSX.Element {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-50 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="absolute right-4 top-4">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <h2 className="mb-2 text-lg font-bold text-gray-900">Удалить товар?</h2>
        <p className="mb-6 text-sm text-gray-500">
          Вы уверены, что хотите удалить «{product.name}»? Это действие нельзя отменить.
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" size="md" fullWidth onClick={onCancel}>
            Отмена
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            className="!bg-red-600 hover:!bg-red-700"
            onClick={onConfirm}
          >
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
}
