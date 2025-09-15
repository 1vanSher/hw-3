import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { SearchProducts } from '@/components/SearchProducts';
import { productsApi } from '@/api/productsApi';
import { Product, Pagination as PaginationType } from '@/types/product';
import { Text } from '@/components/Text';
import styles from './ProductsPage.module.scss';

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    pageSize: 9,
    pageCount: 1,
    total: 0
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async (page: number = 1, query: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (query.trim()) {
        response = await productsApi.searchProducts(query.trim(), page, pagination.pageSize);
      } else {
        response = await productsApi.getProductsPaginated(page, pagination.pageSize);
      }
      
      setProducts(response.data);
      setPagination(response.meta.pagination);
    } catch (err) {
      setError('Ошибка при загрузке товаров');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchProducts(1, query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchProducts(1);
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
          onClick={() => fetchProducts(1, searchQuery)}
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
      <div className={styles.productsTotal}>
        <Text >
          {searchQuery ? 'Found products' : 'Total products'} 
          <span className={styles.totalCount}> {pagination.total}</span>
          {searchQuery && ` for "${searchQuery}"`}
        </Text>
      </div>
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
};

export default ProductsPage;