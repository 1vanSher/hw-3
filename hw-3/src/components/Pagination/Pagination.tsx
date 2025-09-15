import { PaginationProps } from '@/types/product';
import { Text } from '@/components/Text';
import styles from './Pagination.module.scss';

export const Pagination = ({ 
  pagination, 
  onPageChange, 
  className = '' 
}: PaginationProps) => {
  const { page, pageCount, total } = pagination;

  if (pageCount <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount) {
      onPageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <button
        key="prev"
        className={`${styles.pageNavigation} ${page === 1 ? styles.disabled : ''}`}
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.0063 5.95005L12.498 15.4584C11.3751 16.5813 11.3751 18.4188 12.498 19.5417L22.0063 29.05" stroke={styles.pageNavigation} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

      </button>
    );

    // Первая страница
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className={styles.pageButton}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className={styles.ellipsis}>...</span>);
      }
    }

    // Основные страницы
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${i === page ? styles.active : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Последняя страница
    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        pages.push(<span key="ellipsis2" className={styles.ellipsis}>...</span>);
      }
      pages.push(
        <button
          key={pageCount}
          className={styles.pageButton}
          onClick={() => handlePageChange(pageCount)}
        >
          {pageCount}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className={`${styles.pageNavigation} ${page === pageCount ? styles.disabled : ''}`}
        onClick={() => handlePageChange(page + 1)}
        disabled={page === pageCount}
      >
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.9938 29.05L22.5021 19.5416C23.625 18.4187 23.625 16.5812 22.5021 15.4583L12.9938 5.94995" stroke={styles.pageNavigation} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

      </button>
    );

    return pages;
  };

  return (
    <div className={`${styles.pagination} ${className}`}>
      <Text view="p-14" color="secondary" className={styles.info}>
        Показано {(page - 1) * pagination.pageSize + 1} - {Math.min(page * pagination.pageSize, total)} из {total} товаров
      </Text>
      
      <div className={styles.pages}>
        {renderPageNumbers()}
      </div>
    </div>
  );
};
export default Pagination;