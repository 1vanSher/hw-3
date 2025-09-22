import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { SearchProducts } from '@/components/SearchProducts';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Text } from '@/components/Text';
import { useStore } from '@/stores/StoreContext';
import styles from './ProductsPage.module.scss';


export const ProductsPage = observer(() => {
  const { productsStore } = useStore();
  const { products, loading, pagination, searchQuery } = productsStore;
  
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Единый эффект для загрузки продуктов при изменении фильтров
  useEffect(() => {
    productsStore.fetchProductsC(1, searchQuery, selectedCategoryIds);
  }, [searchQuery, selectedCategoryIds]);

  const handlePageChange = (newPage: number) => {
    productsStore.fetchProductsC(newPage, searchQuery, selectedCategoryIds);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Поиск - сбрасываем фильтр категорий
  const handleSearch = (query: string) => {
    setSelectedCategoryIds([]); // Сбрасываем категории
    productsStore.setSearchQuery(query); // Устанавливаем поисковый запрос
    // Продукты загрузятся автоматически благодаря useEffect
  };

  // Фильтрация по категориям - сбрасываем поиск
  const handleFilterChange = (categoryIds: string[]) => {
    productsStore.setSearchQuery(''); // Сбрасываем поиск
    setSelectedCategoryIds(categoryIds);
    // Продукты загрузятся автоматически благодаря useEffect
  };

  // Очистка поиска - сбрасываем и категории
  const handleClearSearch = () => {
    productsStore.setSearchQuery('');
    setSelectedCategoryIds([]);
  };

  // Очистка фильтра категорий - сбрасываем и поиск
  const handleClearFilter = () => {
    setSelectedCategoryIds([]);
    productsStore.setSearchQuery('');
  };

  // Общая очистка всех фильтров
  const handleClearAll = () => {
    productsStore.setSearchQuery('');
    setSelectedCategoryIds([]);
  };

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
        
        {/* Кнопка очистки если есть активные фильтры */}
        {(searchQuery || selectedCategoryIds.length > 0) && (
          <button 
            onClick={handleClearAll}
            className={styles.clearAllButton}
          >
            × Очистить все фильтры
          </button>
        )}
      </div>

      {/* Фильтр по категориям */}
      <div className={styles.filterSection}>
        <CategoryFilter 
          onFilterChange={handleFilterChange}
          disabled={loading}
        />
      </div>

      {/* Информация о активных фильтрах */}
      {(searchQuery || selectedCategoryIds.length > 0) && (
        <div className={styles.activeFilters}>
          <Text view="p-14" color="secondary">
            Активные фильтры:
            {searchQuery && (
              <span className={styles.filterTag}>
                Поиск: "{searchQuery}"
                <button onClick={handleClearSearch}>×</button>
              </span>
            )}
            {selectedCategoryIds.length > 0 && (
              <span className={styles.filterTag}>
                Категории: {selectedCategoryIds.length}
                <button onClick={handleClearFilter}>×</button>
              </span>
            )}
          </Text>
        </div>
      )}

      {/* Общее количество товаров */}
      <div className={styles.productsTotal}>
        <Text>
          {searchQuery ? 'Found products' : 'Total products'} 
          <span className={styles.totalCount}> {pagination.total}</span>
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategoryIds.length > 0 && ` in selected categories`}
        </Text>
      </div>

      {/* Сетка товаров */}
      <div className={styles.productsGrid}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className={styles.noResults}>
            <Text view="p-18" color="secondary">
              {searchQuery && selectedCategoryIds.length > 0
                ? `No products found for "${searchQuery}" in selected categories`
                : searchQuery
                ? `No products found for "${searchQuery}"`
                : selectedCategoryIds.length > 0
                ? 'No products found in selected categories'
                : 'No products available'
              }
            </Text>
            {(searchQuery || selectedCategoryIds.length > 0) && (
              <button onClick={handleClearAll} className={styles.clearSearchButton}>
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