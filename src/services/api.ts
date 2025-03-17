import axios from 'axios';
import { Store } from '../types/store';
import { Product } from '../types/product';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://selll.online/api',
});

export const getStore = async (storeName: string): Promise<Store> => {
  const response = await api.get(`/stores/${storeName}`);
  return response.data;
};

export const getStoreProducts = async (storeId: string): Promise<Product[]> => {
  const response = await api.get(`/stores/${storeId}/products`);
  return response.data;
};

export const getFeaturedProducts = async (storeId: string): Promise<Product[]> => {
  const response = await api.get(`/stores/${storeId}/products?featured=true`);
  return response.data;
};

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'popular';
  search?: string;
}

export const getFilteredProducts = async (storeId: string, filters: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.search) params.append('search', filters.search);
  
  const response = await api.get(`/stores/${storeId}/products?${params.toString()}`);
  return response.data;
};
