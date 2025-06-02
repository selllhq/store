import useSWR from 'swr';
import { useState } from 'react';
import queryString from 'query-string';

import type { Store } from '@/@types/store';
import type { Product, ProductFilters } from '@/@types/product';

export function useProducts(id: Store['id']) {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
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

export function getProductCartFunctions(
  product?: Product,
  quantity: number = 1,
  setQuantity: (value: number) => void = () => {}
): {
  quantity: number;
  setQuantity: (value: number) => void;
  maxQuantity: number;
  minQuantity: number;
  resetQuantity: () => void;
  isOutOfStock: () => boolean;
  isQuantityLimitReached: () => boolean;
  increment: () => void;
  decrement: () => void;
  validate: (value: string | number) => boolean;
} {
  const maxQuantity =
    product?.quantity === 'limited'
      ? parseInt(product?.quantity_items)
      : Infinity;

  return {
    quantity,
    setQuantity,
    maxQuantity,
    minQuantity: 1,
    resetQuantity: () => setQuantity(1),
    isOutOfStock: () => maxQuantity === 0,
    isQuantityLimitReached: () => quantity >= maxQuantity,
    increment: () => setQuantity(Math.min(quantity + 1, maxQuantity)),
    decrement: () => setQuantity(Math.max(quantity - 1, 1)),
    validate: (value: string | number) => {
      const numValue = typeof value === 'string' ? parseInt(value) : value;

      if (isNaN(numValue) || numValue <= 0) {
        return false;
      }

      if (numValue > maxQuantity) {
        return false;
      }

      return true;
    },
  };
}

export function useProductCartFunctions(product?: Product) {
  const [quantity, setQuantity] = useState(1);

  return getProductCartFunctions(
    product,
    quantity,
    setQuantity
  );
}
