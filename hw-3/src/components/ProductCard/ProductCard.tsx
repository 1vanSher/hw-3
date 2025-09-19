import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ProductCardProps } from '@/types/product';
import { Text } from '@/components/Text';
import Card from '@/components/Card';

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/products/${product.documentId}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Add to cart:', product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = !imageError && product.images[0]?.url 
    ? product.images[0].url 
    : '/placeholder-image.svg';

  const discountedPrice = product.discountPercent > 0
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  return (
    <Card
      image={imageUrl}
      onImageError={handleImageError} 
      captionSlot={
        product.productCategory && (
          <Text view="p-14" color="secondary" weight="medium">
            {product.productCategory.title}
          </Text>
        )
      }
      title={product.title}
      subtitle={product.description}
      contentSlot={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: 'var(--color-text)' 
          }}>
            {discountedPrice} ₽
          </span>
          {product.discountPercent > 0 && (
            <span style={{ 
              background: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              -{product.discountPercent}%
            </span>
          )}
        </div>
      }
      actionSlot={
        <button
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={handleAddToCart}
          disabled={!product.isInStock}
          onMouseOver={(e) => {
            if (!product.isInStock) return;
            e.currentTarget.style.background = 'var(--color-primary-hover)';
          }}
          onMouseOut={(e) => {
            if (!product.isInStock) return;
            e.currentTarget.style.background = 'var(--color-primary)';
          }}
        >
          В корзину
        </button>
      }
      onClick={handleClick}
    />
  );
};