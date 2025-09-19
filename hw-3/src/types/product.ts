// Базовый интерфейс для всех сущностей Strapi
interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Интерфейс для форматов изображения
export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

// Интерфейс для изображения
export interface Image extends StrapiEntity {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
}

// Интерфейс для категории
export interface Category extends StrapiEntity {
  title: string;
}

// Основной интерфейс для товара
export interface Product extends StrapiEntity {
  title: string;
  description: string;
  price: number;
  discountPercent: number;
  rating: number;
  isInStock: boolean;
  images: Image[];
  productCategory: Category;
}

// Интерфейс для ответа API с пагинацией
export interface ProductsResponse {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Интерфейс для пропсов пагинации
export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  className?: string;
}

// Утилитарные типы для компонентов
export type ProductCardProps = {
  product: Product;
};

export type ProductsPageProps = {
  products?: Product[];
  loading?: boolean;
  error?: string | null;
};