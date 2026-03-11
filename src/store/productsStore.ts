import { create } from 'zustand';

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

interface ProductsState {
  products: Product[];
  selectedIds: Set<number>;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  toggleSelect: (id: number) => void;
  toggleSelectAll: () => void;
}

const mockProducts: Product[] = [
  { id: 1, name: 'USB Флэшкарта 16GB', category: 'Аксессуары', vendor: 'Samsung', article: 'RCH45Q1A', rating: 4.3, price: 48652 },
  { id: 2, name: 'Утюг Braun TexStyle 9', category: 'Бытовая техника', vendor: 'TexStyle', article: 'DFCHQ1A', rating: 4.9, price: 4233 },
  { id: 3, name: 'Смартфон Apple iPhone 17', category: 'Телефоны', vendor: 'Apple', article: 'GUYHD2-X4', rating: 4.7, price: 88652 },
  { id: 4, name: 'Игровая консоль PlaySta...', category: 'Игровые приставки', vendor: 'Sony', article: 'HT45Q21', rating: 4.1, price: 56236 },
  { id: 5, name: 'Фен Dyson Supersonic Nural', category: 'Электроника', vendor: 'Dyson', article: 'FJHHGF-CR4', rating: 3.3, price: 48652 },
  { id: 6, name: 'Наушники Sony WH-1000XM5', category: 'Аксессуары', vendor: 'Sony', article: 'WH1000XM5', rating: 4.8, price: 32499 },
  { id: 7, name: 'Монитор LG UltraWide 34"', category: 'Электроника', vendor: 'LG', article: 'LG34WN80C', rating: 4.5, price: 45990 },
  { id: 8, name: 'Клавиатура Logitech MX Keys', category: 'Аксессуары', vendor: 'Logitech', article: 'MXK-920', rating: 4.6, price: 12850 },
  { id: 9, name: 'Планшет Samsung Galaxy Tab S9', category: 'Планшеты', vendor: 'Samsung', article: 'SM-X710', rating: 4.4, price: 67890 },
  { id: 10, name: 'Робот-пылесос Xiaomi', category: 'Бытовая техника', vendor: 'Xiaomi', article: 'STYTJ05ZHM', rating: 4.2, price: 29990 },
  { id: 11, name: 'Ноутбук ASUS ZenBook 14', category: 'Ноутбуки', vendor: 'ASUS', article: 'UX3405MA', rating: 4.7, price: 104990 },
  { id: 12, name: 'Умные часы Apple Watch Ultra', category: 'Аксессуары', vendor: 'Apple', article: 'MQDY3', rating: 4.9, price: 78900 },
  { id: 13, name: 'Микроволновка Samsung', category: 'Бытовая техника', vendor: 'Samsung', article: 'ME88SUG', rating: 4.0, price: 8990 },
  { id: 14, name: 'Фотоаппарат Canon EOS R6', category: 'Электроника', vendor: 'Canon', article: 'EOS-R6M2', rating: 4.8, price: 189990 },
  { id: 15, name: 'Колонка JBL Charge 5', category: 'Аксессуары', vendor: 'JBL', article: 'JBLCHARGE5', rating: 4.6, price: 14990 },
  { id: 16, name: 'Телевизор Samsung QLED 55"', category: 'Электроника', vendor: 'Samsung', article: 'QN55Q80C', rating: 4.5, price: 79990 },
  { id: 17, name: 'Стиральная машина Bosch', category: 'Бытовая техника', vendor: 'Bosch', article: 'WGB25690', rating: 4.3, price: 62490 },
  { id: 18, name: 'SSD Samsung 990 PRO 2TB', category: 'Комплектующие', vendor: 'Samsung', article: 'MZ-V9P2T0', rating: 4.9, price: 18990 },
  { id: 19, name: 'Кофемашина DeLonghi', category: 'Бытовая техника', vendor: 'DeLonghi', article: 'ECAM370.95', rating: 4.7, price: 84990 },
  { id: 20, name: 'Геймпад Xbox Wireless', category: 'Игровые приставки', vendor: 'Microsoft', article: 'QAT-00002', rating: 4.4, price: 5990 },
];

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: mockProducts,
  selectedIds: new Set<number>(),
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 20,
  totalItems: 120,
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
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
