import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsStore, type Product } from '../store/productsStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Pagination } from '../components/ui/Pagination';
import { AddProductModal, type ProductFormData } from '../components/AddProductModal';
import { SearchIcon, PlusIcon } from '../components/products/ProductIcons';
import { ProductsTable } from '../components/products/ProductsTable';
import { ConfirmDeleteModal } from '../components/products/ConfirmDeleteModal';
import arrowsClockwiseIcon from '../assets/ArrowsClockwise.svg';

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
        <ProductsTable
          products={products}
          selectedIds={selectedIds}
          searchQuery={searchQuery}
          isLoading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onSort={setSort}
          onEdit={(p) => setEditingProduct(p)}
          onDelete={(p) => setDeletingProduct(p)}
        />

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
