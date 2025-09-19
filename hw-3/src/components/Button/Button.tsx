import React from 'react';
import classNames from 'classnames';
import './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  loading = false,
  children,
  className,
  disabled,
  onClick,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const buttonClassName = classNames(
    'button',
    {
      'button--loading ls': loading,
      'button--disabled': disabled,
    },
    className
  );


  const isActuallyDisabled = disabled || loading;

  return (
    <button
      type="button"
      className={buttonClassName}
      disabled={isActuallyDisabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;