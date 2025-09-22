import React from 'react';
import { observer } from 'mobx-react-lite';
import { MultiDropdown } from '@/components/MultiDropdown';
import { useEffect } from 'react';
import { useStore } from '@/stores/StoreContext';
import { Option } from '@/types/category';

interface CategoryFilterProps {
  onFilterChange: (categoryIds: string[]) => void;
  disabled?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = observer(({ 
  onFilterChange,
  disabled = false
}) => {
  const { categoryFilterStore } = useStore();

  useEffect(() => {
        categoryFilterStore.loadCategoriesAlternative();
  }, []);

  const handleCategoryChange = (selectedOptions: Option[]) => {
    const selectedIds = selectedOptions.map(option => option.key);
    categoryFilterStore.setSelectedCategories(selectedIds);
    onFilterChange(selectedIds);
  };

  if (categoryFilterStore.state.isLoading) {
    return <div>Загрузка категорий...</div>;
  }

  if (categoryFilterStore.state.categories.length === 0) {
    return (
      <div>
        <div>Категории не найдены</div>
        <button onClick={() => categoryFilterStore.loadCategoriesAlternative()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <MultiDropdown
      options={categoryFilterStore.categoryOptions}
      value={categoryFilterStore.selectedOptions}
      onChange={handleCategoryChange}
      getTitle={(options) => options.length === 0 ? 'Все категории' : `Выбрано: ${options.length}`}
      disabled={disabled}
    />
  );
});

export default CategoryFilter;