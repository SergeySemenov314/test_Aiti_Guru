import { useForm } from 'react-hook-form';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AddProductFormValues {
  name: string;
  price: string;
  vendor: string;
  article: string;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; price: number; vendor: string; article: string }) => void;
}

export function AddProductModal({ open, onClose, onSubmit }: AddProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddProductFormValues>({
    defaultValues: { name: '', price: '', vendor: '', article: '' },
  });

  const nameValue = watch('name');
  const priceValue = watch('price');
  const vendorValue = watch('vendor');
  const articleValue = watch('article');

  const handleFormSubmit = (data: AddProductFormValues) => {
    onSubmit({
      name: data.name,
      price: parseFloat(data.price),
      vendor: data.vendor,
      article: data.article,
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  const nameRegister = register('name', { required: 'Введите наименование' });
  const priceRegister = register('price', {
    required: 'Введите цену',
    validate: (v) => {
      const num = parseFloat(v);
      if (isNaN(num) || num <= 0) return 'Укажите корректную цену';
      return true;
    },
  });
  const vendorRegister = register('vendor', { required: 'Введите вендора' });
  const articleRegister = register('article', { required: 'Введите артикул' });

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Добавить товар</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <Input
            label="Наименование"
            placeholder="Название товара"
            error={errors.name?.message}
            {...nameRegister}
            value={nameValue}
            onClear={() => setValue('name', '', { shouldValidate: true })}
          />
          <Input
            label="Цена"
            placeholder="0.00"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...priceRegister}
            value={priceValue}
            onClear={() => setValue('price', '', { shouldValidate: true })}
          />
          <Input
            label="Вендор"
            placeholder="Название бренда"
            error={errors.vendor?.message}
            {...vendorRegister}
            value={vendorValue}
            onClear={() => setValue('vendor', '', { shouldValidate: true })}
          />
          <Input
            label="Артикул"
            placeholder="SKU / Артикул"
            error={errors.article?.message}
            {...articleRegister}
            value={articleValue}
            onClear={() => setValue('article', '', { shouldValidate: true })}
          />

          <div className="mt-2 flex gap-3">
            <Button type="button" variant="secondary" size="md" fullWidth onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" variant="primary" size="md" fullWidth>
              Добавить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
