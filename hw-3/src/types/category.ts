export interface ProductCategory {
  id: string;
  documentId: string;
  name: string;
  slug: string;
}

export interface CategoryFilterState {
  selectedCategoryIds: string[];
  categories: ProductCategory[];
  isLoading: boolean;
}

export interface Option {
  key: string;
  value: string;
}

export type MultiDropdownProps = {
  className?: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  getTitle: (value: Option[]) => string;
};