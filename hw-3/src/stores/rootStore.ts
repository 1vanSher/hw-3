import { ProductsStore } from './productsStore';
import { CartStore } from './cartStore';

export class RootStore {
  productsStore: ProductsStore;
  cartStore: CartStore;

  constructor() {
    this.productsStore = new ProductsStore();
    this.cartStore = new CartStore();
  }
}

export const rootStore = new RootStore();