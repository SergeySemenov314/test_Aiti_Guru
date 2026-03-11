import { create } from 'zustand';
import { api } from '../api/axios';

export interface Product {
  id: number;
  name: string;
  category: string;
  vendor: string;
  article: string;
  rating: number;
  price: number;
  image?: string;
}

export type SortField = 'title' | 'price' | 'rating';
export type SortOrder = 'asc' | 'desc';

interface ProductsState {
  products: Product[];
  selectedIds: Set<number>;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  isLoading: boolean;

  sortField: SortField | null;
  sortOrder: SortOrder;

  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  toggleSelect: (id: number) => void;
  toggleSelectAll: () => void;
  fetchProducts: () => Promise<void>;
  setSort: (field: SortField) => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'category' | 'image'>) => void;
}

const SORT_STORAGE_KEY = 'products_sort';

function loadSortState(): { sortField: SortField | null; sortOrder: SortOrder } {
  try {
    const raw = localStorage.getItem(SORT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        (parsed.sortField === null || ['title', 'price', 'rating'].includes(parsed.sortField)) &&
        ['asc', 'desc'].includes(parsed.sortOrder)
      ) {
        return parsed;
      }
    }
  } catch { /* ignore corrupt data */ }
  return { sortField: null, sortOrder: 'asc' };
}

function saveSortState(sortField: SortField | null, sortOrder: SortOrder) {
  localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify({ sortField, sortOrder }));
}

function mapApiProduct(raw: Record<string, unknown>): Product {
  return {
    id: raw.id as number,
    name: raw.title as string,
    category: raw.category as string,
    vendor: (raw.brand as string) || '—',
    article: (raw.sku as string) || '—',
    rating: raw.rating as number,
    price: raw.price as number,
    image: raw.thumbnail as string | undefined,
  };
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  selectedIds: new Set<number>(),
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 20,
  totalItems: 0,
  isLoading: false,

  ...loadSortState(),

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().fetchProducts();
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().fetchProducts();
  },

  setSort: (field) => {
    const { sortField, sortOrder } = get();

    let newField: SortField | null;
    let newOrder: SortOrder;

    if (sortField !== field) {
      newField = field;
      newOrder = 'asc';
    } else if (sortOrder === 'asc') {
      newField = field;
      newOrder = 'desc';
    } else {
      newField = null;
      newOrder = 'asc';
    }

    set({ sortField: newField, sortOrder: newOrder, currentPage: 1 });
    saveSortState(newField, newOrder);
    get().fetchProducts();
  },

  fetchProducts: async () => {
    const { searchQuery, currentPage, itemsPerPage, sortField, sortOrder } = get();
    set({ isLoading: true });

    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const params: Record<string, string | number> = {
        limit: itemsPerPage,
        skip,
      };

      if (sortField) {
        params.sortBy = sortField;
        params.order = sortOrder;
      }

      let url = '/products';
      if (searchQuery.trim()) {
        url = '/products/search';
        params.q = searchQuery.trim();
      }

      const { data } = await api.get(url, { params });

      const products = (data.products as Record<string, unknown>[]).map(mapApiProduct);
      set({
        products,
        totalItems: data.total as number,
        isLoading: false,
        selectedIds: new Set<number>(),
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addProduct: (product) => {
    const { products, totalItems } = get();
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      rating: 0,
      category: 'Новый',
      image: undefined,
    };
    set({
      products: [newProduct, ...products],
      totalItems: totalItems + 1,
    });
  },

  toggleSelect: (id) => {
    const selected = new Set(get().selectedIds);
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    set({ selectedIds: selected });
  },

  toggleSelectAll: () => {
    const { selectedIds, products } = get();
    if (selectedIds.size === products.length) {
      set({ selectedIds: new Set() });
    } else {
      set({ selectedIds: new Set(products.map((p) => p.id)) });
    }
  },
}));
