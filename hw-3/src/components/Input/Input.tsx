import React from 'react';
import './Input.css';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
  /** data-testid для тестирования */
  'data-testid'?: string;
};

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  afterSlot,
  className = '',
  disabled = false,
  placeholder = 'Текст',
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.value);
    }
  };

  const dataTestId = props['data-testid'];

  return (
    <div className={`input ${disabled ? 'input_disabled' : ''} ${afterSlot ? 'input_withAfterSlot' : ''} ${className}`}>
      <input
        {...props}
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="input__field"
        data-testid={dataTestId}
        placeholder = {placeholder}
      />
      {afterSlot && <div className="input__afterSlot">{afterSlot}</div>}
    </div>
  );
};

export default Input;