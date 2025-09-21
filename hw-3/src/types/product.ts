export interface Product {
  id: string;
  documentId: string;
  title: string;
  description: string;
  price: number;
  discountPercent: number;
  rating: number;
  isInStock: boolean;
  images: ProductImage[];
  productCategory: ProductCategory;
}

export interface ProductImage {
  id: string;
  url: string;
  alternativeText?: string;
}

export interface ProductCategory {
  id: string;
  title: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    pagination: Pagination;
  };
}

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  className?: string;
}