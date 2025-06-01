export interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  quantity: 'limited' | 'unlimited';
  quantity_items: string;
  options: string | null;
  images: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  variants: string | null;
  physical: boolean;
  is_featured: boolean;
}

export type ProductImages = string[];

export interface ProductSortOptions {
    price_asc: 'price-asc';
    price_desc: 'price-desc';
    newest: 'created_at-desc';
    oldest: 'created_at-asc';
    popular: 'popular';
}

export interface CartItem {
  product: Product;
  quantity: number;
  options?: Record<string, string>;
  variant?: string;
}

export interface CartCheckout {
  store_url: string;
  store_name: string;
  redirect_url: string;
  cart: {
    id: Product['id'];
    quantity: CartItem['quantity'];
  }[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    notes: string;
  };
}
