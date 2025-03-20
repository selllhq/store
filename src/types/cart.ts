import { Product } from './product';

export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock?: number;
  quantity?: 'unlimited' | 'limited';
  quantity_items?: string; // Available stock when quantity is 'limited'
  cartQuantity?: number; // Quantity of this item in the cart
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}
