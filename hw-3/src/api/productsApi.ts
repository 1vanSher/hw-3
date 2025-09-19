import qs from 'qs';
import { Product, ProductsResponse, Pagination as PaginationType } from '@/types/product';

const API_BASE_URL = 'https://front-school-strapi.ktsdev.ru/api';

export const productsApi = {
  // Получить все товары
  getProducts: async (): Promise<ProductsResponse> => {
    const query = qs.stringify({
      populate: ['images', 'productCategory']
    }, { encodeValuesOnly: true });

    const response = await fetch(`${API_BASE_URL}/products?${query}`);
    return response.json();
  },

  // Получить товар по ID
  getProductById: async (documentId: string): Promise<{ data: Product }> => {
    const query = qs.stringify({
      populate: ['images', 'productCategory']
    }, { encodeValuesOnly: true });

    const response = await fetch(`${API_BASE_URL}/products/${documentId}?${query}`);
    return response.json();
  },

  // Получить товары с пагинацией
  getProductsPaginated: async (page: number, pageSize: number): Promise<{ data: Product[]; meta: { pagination: PaginationType } }> => {
    const query = qs.stringify({
      populate: ['images', 'productCategory'],
      pagination: {
        page,
        pageSize,
      },
    }, { encodeValuesOnly: true });

    const response = await fetch(`${API_BASE_URL}/products?${query}`);
    return response.json();
  },

  // Поиск товаров по названию
  searchProducts: async (query: string, page: number = 1, pageSize: number = 9): Promise<{ data: Product[]; meta: { pagination: PaginationType } }> => {
    const searchQuery = qs.stringify({
      populate: ['images', 'productCategory'],
      filters: {
        title: {
          $containsi: query,
        },
      },
      pagination: {
        page,
        pageSize,
      },
    }, { encodeValuesOnly: true });

    const response = await fetch(`${API_BASE_URL}/products?${searchQuery}`);
    return response.json();
  },
};