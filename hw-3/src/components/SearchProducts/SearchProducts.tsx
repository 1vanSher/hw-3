import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import styles from './SearchProducts.module.scss';

export type SearchProductsProps = {
  /** Функция поиска */
  onSearch: (query: string) => void;
  /** Плейсхолдер инпута */
  placeholder?: string;
  /** Текст кнопки */
  buttonText?: string;
  /** Дополнительный класс */
  className?: string;
  /** Начальное значение поиска */
  initialValue?: string;
};

export const SearchProducts: React.FC<SearchProductsProps> = ({
  onSearch,
  placeholder = 'Search product',
  buttonText = 'Find now',
  className,
  initialValue = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  // Синхронизация с внешним initialValue
  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(searchQuery.trim());
    }
  };

  return (
    <form 
      className={`${styles.searchForm} ${className || ''}`} 
      onSubmit={handleSubmit}
    >
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        <Button
          type="submit"
          className={styles.searchButton}
          disabled={!searchQuery.trim()}
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
};

export default SearchProducts;