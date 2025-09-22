// stores/rootStore.ts
import { ProductsStore } from './productsStore';
import { CartStore } from './cartStore';
import { CategoryFilterStore } from './CategoryFilterStore';

export class RootStore {
  productsStore: ProductsStore;
  cartStore: CartStore;
  categoryFilterStore: CategoryFilterStore; 

  constructor() {
    this.productsStore = new ProductsStore();
    this.cartStore = new CartStore();
    this.categoryFilterStore = new CategoryFilterStore();
  }
}

export const rootStore = new RootStore();