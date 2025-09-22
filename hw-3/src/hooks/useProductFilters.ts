'use client';

import { useState, useEffect } from 'react';
import { useQueryParams } from './useQueryParams';

export const useProductFilters = () => {
  const { getParam, getNumberParam, getArrayParam, setParams } = useQueryParams();

  const initialSearch = getParam('search');
  const initialCategories = getArrayParam('categories');
  const initialPage = getNumberParam('page', 1);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const params: Record<string, string> = {};
    
    if (searchQuery) params.search = searchQuery;
    if (selectedCategories.length > 0) params.categories = selectedCategories.join(',');
    if (currentPage > 1) params.page = currentPage.toString();
    
    setParams(params);
  }, [searchQuery, selectedCategories, currentPage, setParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  return {
    searchQuery,
    selectedCategories,
    currentPage,
    
    handleSearch,
    handleCategoryChange,
    handlePageChange,
    handleClearAll,

    hasActiveFilters: searchQuery !== '' || selectedCategories.length > 0
  };
};

