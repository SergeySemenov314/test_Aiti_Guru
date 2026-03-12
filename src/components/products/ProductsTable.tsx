import type { Product, SortField, SortOrder } from '../../store/productsStore';
import { Checkbox } from '../ui/Checkbox';
import { SortIcon } from './ProductIcons';
import { ProductRowActions } from './ProductRowActions';
import { getRatingColor, formatPrice } from '../../utils/productUtils';
import crossIcon from '../../assets/cross.png';

export interface ProductsTableProps {
  products: Product[];
  selectedIds: Set<number>;
  searchQuery: string;
  isLoading: boolean;
  sortField: SortField | null;
  sortOrder: SortOrder;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (field: SortField) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({
  products,
  selectedIds,
  searchQuery,
  isLoading,
  sortField,
  sortOrder,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  onEdit,
  onDelete,
}: ProductsTableProps): JSX.Element {
  const sortableHeader = (label: string, field: SortField): JSX.Element => (
    <button
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
    >
      {label}
      <SortIcon active={sortField === field} order={sortOrder} />
    </button>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/50">
            <th className="w-12 px-4 py-3">
              <Checkbox
                checked={selectedIds.size === products.length && products.length > 0}
                onChange={onToggleSelectAll}
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
                  onChange={() => onToggleSelect(product.id)}
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
                  <ProductRowActions
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
