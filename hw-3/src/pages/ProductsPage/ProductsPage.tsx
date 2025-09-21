import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { SearchProducts } from '@/components/SearchProducts';
import { Text } from '@/components/Text';
import { useStore } from '@/stores/StoreContext';
import styles from './ProductsPage.module.scss';

export const ProductsPage = observer(() => {
  const { productsStore } = useStore();
  const { products, loading, error, pagination, searchQuery } = productsStore;

  // Загрузка продуктов при монтировании компонента
  useEffect(() => {
    productsStore.fetchProducts(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    productsStore.fetchProducts(newPage, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    productsStore.fetchProducts(1, query);
  };

  const handleClearSearch = () => {
    productsStore.clearSearch();
  };

  // Состояние загрузки
  if (loading && products.length === 0) {
    return (
      <div className={styles.loading}>
        <Text view="p-20">Загрузка товаров...</Text>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className={styles.error}>
        <Text view="p-20" color="accent">{error}</Text>
        <button 
          onClick={() => productsStore.fetchProducts(1, searchQuery)}
          className={styles.retryButton}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Заголовок страницы */}
      <div className={styles.header}>
        <Text view="title" tag="h1">Products</Text>
        <Text view="p-16" color="secondary" maxLines={2}>
          We display products based on the latest products we have, if you want
          to see our old products please enter the name of the item
        </Text>
      </div>

      {/* Поиск товаров */}
      <div className={styles.searchSection}>
        <SearchProducts 
          onSearch={handleSearch}
          placeholder="Search product"
          buttonText="Find now"
          initialValue={searchQuery}
        />
        {searchQuery && (
          <button 
            onClick={handleClearSearch}
            className={styles.clearSearchButton}
          >
            Clear search
          </button>
        )}
      </div>

      {/* Общее количество товаров */}
      <div className={styles.productsTotal}>
        <Text>
          {searchQuery ? 'Found products' : 'Total products'} 
          <span className={styles.totalCount}> {pagination.total}</span>
          {searchQuery && ` for "${searchQuery}"`}
        </Text>
      </div>

      {/* Сетка товаров */}
      <div className={styles.productsGrid}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <Text view="p-18" color="secondary">
              {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
            </Text>
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className={styles.clearSearchButton}
              >
                Show all products
              </button>
            )}
          </div>
        )}
      </div>

      {/* Пагинация */}
      {pagination.pageCount > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination 
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
});

export default ProductsPage;