import { makeAutoObservable } from 'mobx';
import { ProductCategory } from '@/types/product';
import { productsApi } from '@/api/productsApi';
import { Option } from '@/types/category';
import { Product } from '@/types/product';

export interface CategoryFilterState {
  selectedCategoryIds: string[];
  categories: ProductCategory[];
  isLoading: boolean;
}

export class CategoryFilterStore {
  state: CategoryFilterState = {
    selectedCategoryIds: [],
    categories: [], 
    isLoading: false
  };

  constructor() {
    makeAutoObservable(this);
  }

  loadCategoriesFromProducts = async (): Promise<void> => {
    this.state.isLoading = true;
    try {
      const response = await productsApi.getProductsPaginated(1, 100);       
      const categoriesMap = new Map();
      
      response.data.forEach((product: Product ) => {
        if (product.productCategory) {
          categoriesMap.set(product.productCategory.id, product.productCategory);
        }
      });
      
      this.state.categories = Array.from(categoriesMap.values());
      
      console.log('📊 Извлечено категорий из продуктов:', this.state.categories.length);
      
    } catch (error) {
      console.error('Failed to load categories from products:', error);
      this.state.categories = [];
    } finally {
      this.state.isLoading = false;
    }
  };

  loadCategoriesAlternative = async (): Promise<void> => {
    this.state.isLoading = true;
    try {
      const response = await productsApi.getCategories();
      
      if (response.data === null) {
        console.log('⚠️ API вернуло null, пробую альтернативный метод...');
        await this.loadCategoriesFromProducts();
        return;
      }
      
      this.state.categories = response.data || [];
      
    } catch (error) {
      console.error('Failed to load categories:', error);
      await this.loadCategoriesFromProducts();
    } finally {
      this.state.isLoading = false;
    }
  };

  setSelectedCategories = (categoryIds: string[]): void => {
    this.state.selectedCategoryIds = categoryIds;
  };

  clearFilter = (): void => {
    this.state.selectedCategoryIds = [];
  };

  get categoryOptions(): Option[] {
    return this.state.categories.map(category => ({
      key: category.id.toString(), 
      value: category.name || category.name || 'Unnamed Category'
    }));
  }

  get selectedOptions(): Option[] {
    return this.state.categories
      .filter(category => this.state.selectedCategoryIds.includes(category.id.toString()))
      .map(category => ({
        key: category.id.toString(),
        value: category.name || category.name || 'Unnamed Category'
      }));
  }

  get isFilterActive(): boolean {
    return this.state.selectedCategoryIds.length > 0;
  }
}

export const categoryFilterStore = new CategoryFilterStore();