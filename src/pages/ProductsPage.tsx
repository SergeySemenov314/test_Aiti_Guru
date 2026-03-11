import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '../store/productsStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { Checkbox } from '../components/ui/Checkbox';

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

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-gray-700';
  if (rating >= 3.5) return 'text-yellow-600';
  return 'text-red-500';
}

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU');
}

export function ProductsPage() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const {
    products,
    selectedIds,
    searchQuery,
    currentPage,
    itemsPerPage,
    totalItems,
    setSearchQuery,
    setCurrentPage,
    toggleSelect,
    toggleSelectAll,
  } = useProductsStore();

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.article.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-6">
          <h1 className="text-2xl font-bold text-gray-900 shrink-0">Товары</h1>
          <div className="flex-1 max-w-lg">
            <Input
              placeholder="Найти"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              leftIcon={<SearchIcon />}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Выйти
          </Button>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Все позиции</h2>
          <div className="flex items-center gap-2">
            <Button variant="icon" title="Обновить">
              <RefreshIcon />
            </Button>
            <Button variant="primary" size="sm">
              <PlusIcon />
              Добавить
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Наименование</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Вендор</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Артикул</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Оценка</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Цена, ₽</th>
                <th className="w-24 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
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
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">
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
                    {formatPrice(product.price)},<span className="text-gray-400">00</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="icon" title="Добавить">
                        <PlusIcon />
                      </Button>
                      <Button variant="icon" title="Ещё">
                        <MoreIcon />
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
    </div>
  );
}
