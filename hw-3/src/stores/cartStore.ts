import { makeAutoObservable } from 'mobx';
import { Product } from '@/types/product';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export class CartStore {
  items: CartItem[] = [];
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage();
  }

  // Загрузка из localStorage
  loadFromLocalStorage() {
    if (typeof window === 'undefined') return;
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        this.items = [];
      }
    }
  }

  // Сохранение в localStorage
  saveToLocalStorage() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  // Добавление товара в корзину
  addItem(product: Product) {
    const existingItem = this.items.find(item => item.id === product.documentId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.documentId,
        title: product.title,
        price: product.discountPercent > 0 
          ? Math.round(product.price * (1 - product.discountPercent / 100))
          : product.price,
        quantity: 1,
        image: product.images[0]?.url
      });
    }
    
    this.saveToLocalStorage();
  }

  // Удаление товара из корзины
  removeItem(id: string) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveToLocalStorage();
  }

  // Изменение количества товара
  updateQuantity(id: string, quantity: number) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(id);
      } else {
        item.quantity = quantity;
        this.saveToLocalStorage();
      }
    }
  }

  // Очистка корзины
  clearCart() {
    this.items = [];
    this.saveToLocalStorage();
  }

  // Открытие/закрытие корзины
  toggleCart() {
    this.isOpen = !this.isOpen;
  }

  openCart() {
    this.isOpen = true;
  }

  closeCart() {
    this.isOpen = false;
  }

  // Вычисляемое свойство: общая стоимость
  get total() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Вычисляемое свойство: общее количество товаров
  get totalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Проверка, есть ли товар в корзине
  isInCart(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}

export const cartStore = new CartStore();