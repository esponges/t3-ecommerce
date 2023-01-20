import type { Category, Product } from "@/types";
import create from "zustand/react";

interface ProductsState {
  items: {
    categories: Category[];
    products?: Product[];
  }
  actions: {
    addCategories: (categories: Category[]) => void;
  };
}

const useProductsStore = create<ProductsState>((set) => ({
  items: {
    categories: [],
    products: []
  },
  actions: {
    addCategories: (categories) => {
      // todo: check for immutability when using set
      set({ items: { categories } });
    }
  }
}));

export const useProductItems = () => useProductsStore((state) => state.items);
export const useProductActions = () => useProductsStore((state) => state.actions);
