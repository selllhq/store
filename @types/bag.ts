import type { Product } from "./product";

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
