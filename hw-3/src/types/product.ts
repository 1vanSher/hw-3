// types/product.ts
export interface ProductImage {
  id: string;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string;
  provider: string;
  provider_metadata: string;
}

export interface ProductCategory {
  id: string;
  documentId: string;
  name: string; 
  slug: string;
}

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

export interface PaginationType {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    pagination: PaginationType;
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
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

export interface PaginationInfo {
  page: number;          
  pageSize: number;      
  pageCount: number;      
  total: number;       
}