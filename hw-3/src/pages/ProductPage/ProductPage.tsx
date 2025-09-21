import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Text } from '@/components/Text';
import { ProductCard } from '@/components/ProductCard';
import { ArrowLeft } from '@components/UI/ArrowLeft';
import { useStore } from '@/stores/StoreContext';
import styles from './ProductPage.module.scss';

export const ProductPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { productsStore, cartStore } = useStore();
  const { currentProduct: product, similarProducts, loading, error } = productsStore;

  useEffect(() => {
    if (id) {
      productsStore.fetchProductById(id);
    }
    
    return () => {
      productsStore.resetProductPage();
    };
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      cartStore.addItem(product);
    }
  };

  const discountedPrice = product && product.discountPercent > 0
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : null;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Text view="p-20">Загрузка товара...</Text>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <Text view="p-20" color="accent">{error || 'Товар не найден'}</Text>
          <Link to="/products" className={styles.backLink}>
            <ArrowLeft />
            <Text view="p-16">Вернуться к товарам</Text>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Кнопка назад */}
      <div className={styles.backSection}>
        <Link to="/products" className={styles.backLink}>
          <ArrowLeft />
          <Text view="p-16">Назад к товарам</Text>
        </Link>
      </div>

      {/* Основная информация о товаре */}
      <div className={styles.productSection}>
        <div className={styles.imageContainer}>
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alternativeText || product.title}
            className={styles.productImage}
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.svg';
            }}
          />
        </div>
        
        <div className={styles.infoContainer}>
          {/* Категория */}
          {product.productCategory && (
            <Text view="p-14" color="primary" weight="medium" className={styles.category}>
              {product.productCategory.title}
            </Text>
          )}
          
          {/* Заголовок */}
          <Text tag="h1" view="title" className={styles.title}>
            {product.title}
          </Text>
          
          {/* Описание */}
          <Text view="p-16" color="secondary" className={styles.description}>
            {product.description}
          </Text>
          
          {/* Цена и кнопка корзины */}
          <div className={styles.priceSection}>
            {discountedPrice ? (
              <>
                <Text tag="h2" view="title" className={styles.currentPrice}>
                  {discountedPrice} ₽
                </Text>
                <div className={styles.oldPriceContainer}>
                  <Text view="p-20" color="secondary" className={styles.oldPrice}>
                    {product.price} ₽
                  </Text>
                  <div className={styles.discountBadge}>
                    <Text view="p-14" color="secondary">
                      -{product.discountPercent}%
                    </Text>
                  </div>
                </div>
              </>
            ) : (
              <Text tag="h2" view="title" className={styles.currentPrice}>
                {product.price} ₽
              </Text>
            )}
            
            {/* Кнопка добавления в корзину */}
            <button 
              onClick={handleAddToCart}
              className={`${styles.addToCartButton} ${
                cartStore.isInCart(product.documentId) ? styles.inCart : ''
              }`}
              disabled={!product.isInStock}
            >
              {cartStore.isInCart(product.documentId) ? 'В корзине' : 'В корзину'}
            </button>
          </div>
          
          {/* Дополнительная информация */}
          <div className={styles.metaInfo}>
            <Text view="p-14" color="secondary">
              Рейтинг: ★ {product.rating}
            </Text>
            <Text 
              view="p-14" 
              color={product.isInStock ? 'primary' : 'accent'}
            >
              {product.isInStock ? 'В наличии' : 'Нет в наличии'}
            </Text>
          </div>
        </div>
      </div>

      {/* Похожие товары */}
      {similarProducts.length > 0 && (
        <div className={styles.similarSection}>
          <Text tag="h2" view="title" className={styles.similarTitle}>
            Смотрите также
          </Text>
          
          <div className={styles.similarGrid}>
            {similarProducts.map(similarProduct => (
              <ProductCard 
                key={similarProduct.id} 
                product={similarProduct} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default ProductPage;