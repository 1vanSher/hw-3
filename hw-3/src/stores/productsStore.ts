import { makeAutoObservable, runInAction } from 'mobx';
import { Product, Pagination as PaginationType } from '@/types/product';
import { productsApi } from '@/api/productsApi';

export class ProductsStore {
  // Состояние для страницы товаров
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  pagination: PaginationType = {
    page: 1,
    pageSize: 9,
    pageCount: 1,
    total: 0
  };
  searchQuery = '';

  // Состояние для страницы конкретного товара
  currentProduct: Product | null = null;
  similarProducts: Product[] = [];
  productLoading = false;
  productError: string | null = null;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== 'undefined') {
      this.restoreFromUrl();
    }
  }
  restoreFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const query = urlParams.get('q');
    
    if (page) {
      this.pagination.page = parseInt(page, 10);
    }
    
    if (query) {
      this.searchQuery = query;
    }
  }
  updateUrl() {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams();
    
    if (this.pagination.page > 1) {
      urlParams.set('page', this.pagination.page.toString());
    }
    
    if (this.searchQuery) {
      urlParams.set('q', this.searchQuery);
    }
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }
  async fetchProducts(page: number = 1, query: string = '') {
    try {
      this.setLoading(true);
      this.setError(null);
      this.setSearchQuery(query);
      
      let response;
      
      if (query.trim()) {
        response = await productsApi.searchProducts(query.trim(), page, this.pagination.pageSize);
      } else {
        response = await productsApi.getProductsPaginated(page, this.pagination.pageSize);
      }
      
      runInAction(() => {
        this.products = response.data;
        this.pagination = response.meta.pagination;
        this.updateUrl(); // Обновляем URL после успешной загрузки
      });
    } catch (err) {
      runInAction(() => {
        this.setError('Ошибка при загрузке товаров');
        console.error('Error fetching products:', err);
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }
  clearSearch() {
    this.searchQuery = '';
    this.pagination.page = 1;
    this.fetchProducts(1);
    this.updateUrl();
  }
  async fetchProductById(id: string) {
    try {
      this.setProductLoading(true);
      this.setProductError(null);
      
      const productResponse = await productsApi.getProductById(id);
      
      runInAction(() => {
        this.currentProduct = productResponse.data;
      });
      
      // Загрузка похожих товаров
      await this.fetchSimilarProducts(productResponse.data);
      
    } catch (err) {
      runInAction(() => {
        this.setProductError('Ошибка при загрузке товара');
        console.error('Error fetching product:', err);
      });
    } finally {
      runInAction(() => {
        this.setProductLoading(false);
      });
    }
  }
  private async fetchSimilarProducts(product: Product) {
    try {
      const allProductsResponse = await productsApi.getProducts();
      const similar = allProductsResponse.data.filter(
        p => p.productCategory.id === product.productCategory.id && 
             p.documentId !== product.documentId
      ).slice(0, 3);
      
      runInAction(() => {
        this.similarProducts = similar;
      });
    } catch (err) {
      console.error('Error fetching similar products:', err);
    }
  }


  fetchProductsC = async (page: number = 1, searchQuery: string = '', categoryIds: string[] = []) => {
  this.loading = true;
  try {
    let response;
    
    if (categoryIds.length > 0) {
      response = await productsApi.getProductsByCategoryIds(categoryIds, page, 9);
    } else if (searchQuery) {
      response = await productsApi.searchProducts(searchQuery, page, 9);
    } else {
      response = await productsApi.getProductsPaginated(page, 9);
    }
    
    this.products = response.data;
    this.pagination = response.meta.pagination;
    this.searchQuery = searchQuery;
  } catch {
    this.error = 'Failed to load products';
  } finally {
    this.loading = false;
  }
};
  resetProductPage() {
    this.currentProduct = null;
    this.similarProducts = [];
    this.productError = null;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setProductLoading(loading: boolean) {
    this.productLoading = loading;
  }

  setProductError(error: string | null) {
    this.productError = error;
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  setPage(page: number) {
    this.pagination.page = page;
  }
  get hasSearchResults(): boolean {
    return this.searchQuery.trim() !== '' && this.products.length > 0;
  }
  get displayedTotal(): number {
    return this.pagination.total;
  }
  get currentRange(): { start: number; end: number } {
    const start = (this.pagination.page - 1) * this.pagination.pageSize + 1;
    const end = Math.min(this.pagination.page * this.pagination.pageSize, this.pagination.total);
    return { start, end };
  }
  reset() {
    this.products = [];
    this.currentProduct = null;
    this.similarProducts = [];
    this.loading = false;
    this.productLoading = false;
    this.error = null;
    this.productError = null;
    this.pagination = {
      page: 1,
      pageSize: 9,
      pageCount: 1,
      total: 0
    };
    this.searchQuery = '';
  }
  resetSearch() {
    this.searchQuery = '';
    this.pagination.page = 1;
  }
}

export const productsStore = new ProductsStore();