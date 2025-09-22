// stores/rootStore.ts
import { ProductsStore } from './productsStore';
import { CartStore } from './cartStore';
import { CategoryFilterStore } from './CategoryFilterStore'; // Добавляем импорт

export class RootStore {
  productsStore: ProductsStore;
  cartStore: CartStore;
  categoryFilterStore: CategoryFilterStore; // Добавляем хранилище категорий

  constructor() {
    this.productsStore = new ProductsStore();
    this.cartStore = new CartStore();
    this.categoryFilterStore = new CategoryFilterStore(); // Инициализируем
  }
}

export const rootStore = new RootStore();