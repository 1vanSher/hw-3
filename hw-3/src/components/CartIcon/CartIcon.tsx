import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores/StoreContext';
import { useEffect, useRef } from 'react';
import styles from './CartIcon.module.scss';

export const CartIcon = observer(() => {
  const { cartStore } = useStore();
  const cartRef = useRef<HTMLDivElement>(null);
  
  // Закрытие корзины при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        cartStore.closeCart();
      }
    };

    if (cartStore.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartStore.isOpen]);

  const handleCloseCart = () => {
    cartStore.closeCart();
  };

  const handleToggleCart = () => {
    cartStore.toggleCart();
  };

  return (
    <div className={styles.cartIcon} ref={cartRef}>
      <div className={styles.iconContainer} onClick={handleToggleCart}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.375 9.58751V8.37501C9.375 5.56251 11.6375 2.80001 14.45 2.53751C17.8 2.21251 20.625 4.85001 20.625 8.13751V9.86251" stroke="#151411" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.25 27.5H18.75C23.775 27.5 24.675 25.4875 24.9375 23.0375L25.875 15.5375C26.2125 12.4875 25.3375 10 20 10H10C4.66253 10 3.78753 12.4875 4.12503 15.5375L5.06253 23.0375C5.32503 25.4875 6.22503 27.5 11.25 27.5Z" stroke="#151411" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19.3694 15H19.3806" stroke="#151411" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.6181 15H10.6294" stroke="#151411" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
        {cartStore.totalItems > 0 && (
          <span className={styles.badge}>
            {cartStore.totalItems}
          </span>
        )}
      </div>
      
      {cartStore.isOpen && (
        <div className={styles.cartDropdown}>
          <div className={styles.cartHeader}>
            <h3>Корзина</h3>
            <button 
              onClick={handleCloseCart}
              className={styles.closeButton}
              aria-label="Закрыть корзину"
            >
              ×
            </button>
          </div>
          
          {cartStore.items.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Корзина пуста</p>
            </div>
          ) : (
            <>
              <div className={styles.cartItems}>
                {cartStore.items.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className={styles.itemImage}
                      />
                    )}
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemTitle}>{item.title}</h4>
                      <div className={styles.itemPrice}>
                        {item.price} ₽ × {item.quantity}
                      </div>
                    </div>
                    <button 
                      onClick={() => cartStore.removeItem(item.id)}
                      className={styles.removeButton}
                      aria-label="Удалить товар"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className={styles.cartFooter}>
                <div className={styles.cartTotal}>
                  Итого: <span>{cartStore.total} ₽</span>
                </div>
                <button className={styles.checkoutButton}>
                  Оформить заказ
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default CartIcon;