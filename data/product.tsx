import useSWR from 'swr';
import { useState } from 'react';
import queryString from 'query-string';

import type { Store } from '@/@types/store';
import type { Product, ProductFilters } from '@/@types/product';

export function useProducts(id: Store['id']) {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    sortBy: 'created_at-desc',
  });

  const { data, error, isLoading } = useSWR(
    `/stores/${id}/products?${queryString.stringify(filters, {
      skipEmptyString: true,
    })}`
  );

  return {
    products: data as Product[] | undefined,
    isLoading,
    isError: error,
    filters,
    setFilters,
  };
}
