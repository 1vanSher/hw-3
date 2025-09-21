import React, { useState, useRef, useEffect } from 'react';
import Input from '../Input/Input';
import './MultiDropdown.css';
import  ArrowDownIcon  from '../icons/ArrowDownIcon';

export type Option = {
  key: string;
  value: string;
};

export type MultiDropdownProps = {
  className?: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  getTitle: (value: Option[]) => string;
};

export const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className = '',
  options,
  value,
  onChange,
  disabled = false,
  getTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [tempPlaceholder, setTempPlaceholder] = useState(''); // Новое состояние для временного placeholder
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInputValue('');
        setSearchValue('');
        setTempPlaceholder(''); // Сбрасываем временный placeholder
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      setTempPlaceholder(inputValue || getTitle(value));
      setInputValue('');
      setSearchValue('');
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setSearchValue(newValue);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleOptionClick = (option: Option) => {
    const isSelected = value.some(item => item.key === option.key);
    const newValue = isSelected
      ? value.filter(item => item.key !== option.key)
      : [...value, option];

    onChange(newValue);
    
    const selectedValues = newValue.map(item => item.value);
    setInputValue(selectedValues.join(', '));
    setSearchValue('');
    setTempPlaceholder(''); 
  };

  const isOptionSelected = (option: Option) => {
    return value.some(item => item.key === option.key);
  };

  const displayValue = value.length > 0 ? getTitle(value) : '';
  const defaultPlaceholder = value.length === 0 ? getTitle(value) : '';

  return (
    <div className={`multi-dropdown ${className}`} ref={dropdownRef}>
      <Input
        value={isOpen ? inputValue : displayValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder={isOpen ? tempPlaceholder : defaultPlaceholder}
        disabled={disabled}
        afterSlot={<ArrowDownIcon color="secondary"/>}
        readOnly={!isOpen}
      />
      
      {isOpen && !disabled && (
        <div className="multi-dropdown__options">
          {filteredOptions.map(option => (
            <div
              key={option.key}
              className={`multi-dropdown__option ${
                isOptionSelected(option) ? 'multi-dropdown__option--selected' : ''
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.value}
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className="multi-dropdown__option multi-dropdown__option--empty">
              Ничего не найдено
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;