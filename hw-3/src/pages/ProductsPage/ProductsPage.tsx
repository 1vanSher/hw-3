'use client';

import { observer } from 'mobx-react-lite';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { SearchProducts } from '@/components/SearchProducts';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Text } from '@/components/Text';
import { useStore } from '@/stores/StoreContext';
import { useEffect } from 'react';
import { useProductFilters } from '@/hooks/useProductFilters';
import styles from './ProductsPage.module.scss';

export const ProductsPage = observer(() => {
  const { productsStore } = useStore();
  const { products, loading, error, pagination } = productsStore;
  
  const {
    searchQuery,
    selectedCategories,
    currentPage,
    handleSearch,
    handleCategoryChange,
    handlePageChange,
    handleClearAll,
    hasActiveFilters
  } = useProductFilters();
  useEffect(() => {
    productsStore.fetchProductsC(currentPage, searchQuery, selectedCategories);
  }, [currentPage, searchQuery, selectedCategories]);

  const onPageChange = (newPage: number) => {
    handlePageChange(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles.loading}>
        <Text view="p-20">Загрузка товаров...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Text view="p-20" color="accent">{error}</Text>
        <button 
          onClick={() => productsStore.fetchProductsC(currentPage, searchQuery, selectedCategories)}
          className={styles.retryButton}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text view="title" tag="h1">Products</Text>
        <Text view="p-16" color="secondary" maxLines={2}>
          We display products based on the latest products we have, if you want
          to see our old products please enter the name of the item
        </Text>
      </div>
      <div className={styles.searchSection}>
        <SearchProducts 
          onSearch={handleSearch}
          placeholder="Search product"
          buttonText="Find now"
          initialValue={searchQuery}
        />
        
        {hasActiveFilters && (
          <button onClick={handleClearAll} className={styles.clearAllButton}>
            × Очистить все фильтры
          </button>
        )}
      </div>
      <div className={styles.filterSection}>
        <CategoryFilter 
          onFilterChange={handleCategoryChange}
          disabled={loading}
        />
      </div>
      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          <Text view="p-14" color="secondary">
            Активные фильтры:
            {searchQuery && <span className={styles.filterTag}>Поиск: "{searchQuery}"</span>}
            {selectedCategories.length > 0 && (
              <span className={styles.filterTag}>Категории: {selectedCategories.length}</span>
            )}
          </Text>
        </div>
      )}
      <div className={styles.productsTotal}>
        <Text>
          {searchQuery ? 'Found products' : 'Total products'} 
          <span className={styles.totalCount}> {pagination.total}</span>
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategories.length > 0 && ` in selected categories`}
        </Text>
      </div>
      <div className={styles.productsGrid}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className={styles.noResults}>
            <Text view="p-18" color="secondary">
              {searchQuery && selectedCategories.length > 0
                ? `No products found for "${searchQuery}" in selected categories`
                : searchQuery
                ? `No products found for "${searchQuery}"`
                : selectedCategories.length > 0
                ? 'No products found in selected categories'
                : 'No products available'
              }
            </Text>
            {hasActiveFilters && (
              <button onClick={handleClearAll} className={styles.clearSearchButton}>
                Show all products
              </button>
            )}
          </div>
        )}
      </div>
      {pagination.pageCount > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination 
            pagination={pagination}
            onPageChange={onPageChange}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
});

export default ProductsPage;