import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsStore, type SortField } from '../store/productsStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { Checkbox } from '../components/ui/Checkbox';
import { AddProductModal } from '../components/AddProductModal';

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
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
  } = useProductsStore();

  const [showAddModal, setShowAddModal] = useState(false);
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

  const handleAddProduct = (data: { name: string; price: number; vendor: string; article: string }) => {
    addProduct(data);
    addToast('Товар успешно добавлен');
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

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-6">
          <h1 className="text-2xl font-bold text-gray-900 shrink-0">Товары</h1>
          <div className="flex-1 max-w-lg">
            <Input
              placeholder="Поиск товаров..."
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              onClear={handleSearchClear}
              leftIcon={<SearchIcon />}
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
            <Button variant="icon" title="Обновить" onClick={handleRefresh}>
              <RefreshIcon />
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              <PlusIcon />
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
                <th className="px-4 py-3 text-right">
                  <div className="flex justify-end">
                    {sortableHeader('Цена, $', 'price')}
                  </div>
                </th>
                <th className="w-12 px-4 py-3" />
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
                  <td className="px-4 py-3 text-right font-mono text-gray-700">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <Button variant="icon" title="Добавить">
                        <PlusIcon />
                      </Button>
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
    </div>
  );
}
