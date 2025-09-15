import React from 'react';
import { Text } from '../Text/Text';
import styles from './Card.module.scss';

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** URL изображения */
  image: string;
  /** Слот над заголовком */
  captionSlot?: React.ReactNode;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Описание карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  contentSlot?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
  /** Слот для действия */
  actionSlot?: React.ReactNode;
  /** Обработчик ошибки загрузки изображения */
  onImageError?: () => void;
};

export const Card: React.FC<CardProps> = ({
  className = '',
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  actionSlot,
  onClick,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
  };

  const cardClassName = `${styles.card} ${onClick ? styles.card_clickable : ''} ${className}`;

  return (
    <div
      className={cardClassName}
      onClick={handleClick}
      {...rest}
    >
      <div className={styles.card__image_container}>
        <img src={image} alt="" className={styles.card__image} />
      </div>
      
      <div className={styles.card__content}>
        {captionSlot && (
          <div className={styles.card__caption}>
            {captionSlot}
          </div>
        )}
        
        <div className={styles.card__text}>
          <Text 
            tag="h3" 
            view="p-16" 
            weight="bold" 
          >
            {title}
          </Text>
          
          <Text 
            tag="p" 
            view="p-14" 
            color="secondary" 
            maxLines={3}
          >
            {subtitle}
          </Text>
        </div>
        
        {(contentSlot || actionSlot) && (
          <div className={styles.card__footer}>
            {contentSlot && (
              <div className={styles.card__content_slot}>
                {contentSlot}
              </div>
            )}
            
            {actionSlot && (
              <div className={styles.card__action_slot}>
                {actionSlot}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;