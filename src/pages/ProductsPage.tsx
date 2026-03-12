import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsStore, type SortField, type Product } from '../store/productsStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { Checkbox } from '../components/ui/Checkbox';
import { AddProductModal, type ProductFormData } from '../components/AddProductModal';
import settingsIcon from '../assets/settings.png';
import crossIcon from '../assets/cross.png';
import arrowsClockwiseIcon from '../assets/ArrowsClockwise.svg';

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SortIcon({ active, order }: { active: boolean; order: 'asc' | 'desc' }) {
  if (!active) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-30">
        <path d="M7 15l5 5 5-5" />
        <path d="M7 9l5-5 5 5" />
      </svg>
    );
  }
  if (order === 'asc') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
        <path d="M7 9l5-5 5 5" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
      <path d="M7 15l5 5 5-5" />
    </svg>
  );
}

function RowActions({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
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

function ConfirmDeleteModal({
  product,
  onConfirm,
  onCancel,
}: {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}) {
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

function getRatingColor(rating: number): string {
  if (rating < 3) return 'text-red-500';
  return 'text-gray-700';
}

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ProductsPage() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const addToast = useToastStore((s) => s.add);

  const {
    products,
    selectedIds,
    searchQuery,
    currentPage,
    itemsPerPage,
    totalItems,
    isLoading,
    sortField,
    sortOrder,
    setSearchQuery,
    setCurrentPage,
    toggleSelect,
    toggleSelectAll,
    fetchProducts,
    setSort,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductsStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchQuery(value);
      }, 400);
    },
    [setSearchQuery],
  );

  const handleSearchClear = useCallback(() => {
    setLocalSearch('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchQuery('');
  }, [setSearchQuery]);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  const handleAddProduct = (data: ProductFormData) => {
    addProduct(data);
    addToast('Товар успешно добавлен');
  };

  const handleEditProduct = (data: ProductFormData) => {
    if (!editingProduct) return;
    updateProduct(editingProduct.id, data);
    addToast('Товар успешно обновлён');
    setEditingProduct(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingProduct) return;
    deleteProduct(deletingProduct.id);
    addToast('Товар удалён');
    setDeletingProduct(null);
  };

  const sortableHeader = (label: string, field: SortField) => (
    <button
      onClick={() => setSort(field)}
      className="inline-flex items-center gap-1 font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
    >
      {label}
      <SortIcon active={sortField === field} order={sortOrder} />
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
          <div className="h-full bg-primary animate-progress rounded-r-full" />
        </div>
      )}

      <div className="w-full px-[30px] py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-6">
          <h1 className="text-2xl font-bold leading-normal text-gray-900 shrink-0">Товары</h1>
          <div className="flex-1 max-w-[1023px]">
            <Input
              placeholder="Найти"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              onClear={handleSearchClear}
              leftIcon={<SearchIcon />}
              className="!h-12 !rounded-lg !border-0 !bg-gray-100 !placeholder:text-gray-400 focus:!ring-2 focus:!ring-gray-200"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Выйти
          </Button>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">
            Все позиции
            {totalItems > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({totalItems})</span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              title="Обновить"
              onClick={handleRefresh}
              className="!h-[42px] !w-[42px] !min-w-[42px] !p-0 !rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-gray-100"
            >
              <img src={arrowsClockwiseIcon} alt="" className="h-[18px] w-[18px]" />
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)} className="!h-[42px]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white text-white">
                <PlusIcon />
              </span>
              Добавить
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selectedIds.size === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Наименование</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Вендор</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Артикул</th>
                <th className="px-4 py-3 text-left">
                  {sortableHeader('Оценка', 'rating')}
                </th>
                <th className="px-4 py-3 pr-16 text-right">
                  <div className="flex justify-end">
                    {sortableHeader('Цена, $', 'price')}
                  </div>
                </th>
                <th className="w-28 pl-16 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    {searchQuery ? 'Ничего не найдено' : 'Нет товаров'}
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`border-b border-gray-100 transition-colors hover:bg-gray-50
                    ${selectedIds.has(product.id) ? 'bg-indigo-50/50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[240px]">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {product.vendor}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.article}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${getRatingColor(product.rating)}`}>
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-400">/5</span>
                  </td>
                  <td className="px-4 py-3 pr-16 text-right font-mono text-gray-700">
                    {formatPrice(product.price)}
                  </td>
                  <td className="pl-16 px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        className="flex shrink-0 items-center justify-center transition-colors cursor-pointer"
                        title="Добавить"
                      >
                        <img src={crossIcon} alt="Добавить" className="w-[52px] h-[27px] shrink-0 object-contain" />
                      </button>
                      <RowActions
                        product={product}
                        onEdit={(p) => setEditingProduct(p)}
                        onDelete={(p) => setDeletingProduct(p)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProduct}
      />

      {/* Edit Product Modal */}
      <AddProductModal
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleEditProduct}
        initialData={editingProduct ? {
          name: editingProduct.name,
          price: editingProduct.price,
          vendor: editingProduct.vendor,
          article: editingProduct.article,
        } : null}
      />

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <ConfirmDeleteModal
          product={deletingProduct}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
}
