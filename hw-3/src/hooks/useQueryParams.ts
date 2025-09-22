import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const currentParams = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const getParam = useCallback((key: string): string => {
    return searchParams.get(key) || '';
  }, [searchParams]);

  const getNumberParam = useCallback((key: string, defaultValue: number = 1): number => {
    const value = searchParams.get(key);
    return value ? parseInt(value, 10) : defaultValue;
  }, [searchParams]);

  const getArrayParam = useCallback((key: string): string[] => {
    const value = searchParams.get(key);
    return value ? value.split(',').filter(Boolean) : [];
  }, [searchParams]);

  const setParams = useCallback((params: Record<string, string | number | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    const newSearch = newSearchParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    
    navigate(newUrl, { replace: true });
  }, [searchParams, location.pathname, navigate]);

  const clearParams = useCallback(() => {
    navigate(location.pathname, { replace: true });
  }, [location.pathname, navigate]);

  return {
    getParam,
    getNumberParam,
    getArrayParam,
    setParams,
    clearParams,
    currentParams
  };
};