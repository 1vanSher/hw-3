import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '@/api/productsApi';
import { Product } from '@/types/product';
import { Text } from '@/components/Text';
import { ProductCard } from '@/components/ProductCard';
import { ArrowLeft } from '@components/UI/ArrowLeft';
import styles from './ProductPage.module.scss';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        const productResponse = await productsApi.getProductById(id);
        setProduct(productResponse.data);
        
        const allProductsResponse = await productsApi.getProducts();
        const similar = allProductsResponse.data.filter(
          p => p.productCategory.id === productResponse.data.productCategory.id && 
               p.documentId !== productResponse.data.documentId
        ).slice(0, 3);
        
        setSimilarProducts(similar);
      } catch (err) {
        setError('Ошибка при загрузке товара');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

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

  const discountedPrice = product.discountPercent > 0
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.backSection}>
        <Link to="/products" className={styles.backLink}>
          <ArrowLeft />
          <Text view="p-16">Назад к товарам</Text>
        </Link>
      </div>
      <div className={styles.productSection}>
        <div className={styles.imageContainer}>
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alternativeText || product.title}
            className={styles.productImage}
          />
        </div>
        
        <div className={styles.infoContainer}>
          {product.productCategory && (
            <Text view="p-14" color="primary" weight="medium" className={styles.category}>
              {product.productCategory.title}
            </Text>
          )}
          
          <Text tag="h1" className={styles.title}>
            {product.title}
          </Text>
          
          <Text view="p-16" color="secondary" className={styles.description}>
            {product.description}
          </Text>
          
          <div className={styles.priceSection}>
            {discountedPrice ? (
              <>
                <Text tag="h1" className={styles.currentPrice}>
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
              <Text  tag="h1" className={styles.currentPrice}>
                {product.price} ₽
              </Text>
            )}
          </div>
          
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
      {similarProducts.length > 0 && (
        <div className={styles.similarSection}>
          <Text tag="h2" className={styles.similarTitle}>
            Related Items
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
};

export default ProductPage;