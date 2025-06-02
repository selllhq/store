import type { Product } from "./product";
import type { StoreCustomer } from "./store";

export interface BagItem {
    image: string;
    product: Product;
    quantity: number;
}

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
}

export interface CheckoutResponse {
  id: string;
  url: string;
}

export interface Order {
  id: 1;
  customer_id: 1;
  store_id: 1;
  total: string;
  currency: string;
  billing_session_id: string;
  store_url: string;
  items: OrderItem[];
  status: string;
  created_at: string;
  updated_at: string;
  customer: StoreCustomer;
}

export interface OrderItem {
  id: number;
  customer_id: number;
  product_id: number;
  cart_id: number;
  quantity: number;
  amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
  product: Product;
}
