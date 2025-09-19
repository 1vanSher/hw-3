import styles from './Text.module.scss';

export type TextProps = {
  className?: string;
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  weight?: 'normal' | 'medium' | 'bold';
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent';
  maxLines?: number;
};

export const Text: React.FC<TextProps> = ({
  className = '',
  view,
  tag: Tag = 'p',
  weight,
  children,
  color,
  maxLines,
  ...rest
}) => {
  const classNames = [
    styles.text,
    view && styles[`text_view_${view}`],
    weight && styles[`text_weight_${weight}`],
    color && styles[`text_color_${color}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = maxLines ? { 
    WebkitLineClamp: maxLines,
    fontFamily: 'Roboto, sans-serif' 
  } : { fontFamily: 'Roboto, sans-serif' };

  return (
    <Tag 
      className={classNames} 
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Text; 