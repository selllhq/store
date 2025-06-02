import useSWR from 'swr';

import type { Store } from '@/@types/store';
import type { ProductCategory } from '@/@types/product';

export function useCategories(id: Store['id']) {
  const { data, error, isLoading } = useSWR(`/stores/${id}/categories`);

  return {
    categories: data as ProductCategory[] | undefined,
    isLoading,
    isError: error,
  };
}
