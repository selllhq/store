import axios from 'axios';
import { Store } from '../types/store';
import { Product } from '../types/product';

export const api = axios.create({
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

// Order interfaces
export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customer_id: number;
  store_id: number;
  total: string | number;
  billing_session_id: string;
  store_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer?: OrderCustomer;
  items?: OrderItem[];
}

// Fetch order details
export const getOrderDetails = async (storeId: string, orderId: string): Promise<Order> => {
  const response = await api.get(`/stores/${storeId}/orders/${orderId}`);
  return response.data;
};
