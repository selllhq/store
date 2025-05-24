import { createContext, useContext, useReducer, ReactNode } from "react";
import { CartItem, CartState, CartContextType } from "../types/cart";
import { Product } from "../types/product";

type CartAction =
  | { type: 'ADD_TO_CART', payload: { product: Product, quantity: number } }
  | { type: 'REMOVE_FROM_CART', payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY', payload: { productId: string, quantity: number } }
  | { type: 'CLEAR_CART' }

const defaultCartState: CartState = {
  items: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = (existingItem.cartQuantity || 0) + quantity;

        if (product.stock !== undefined && newQuantity > product.stock) {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            cartQuantity: product.stock
          };
        } else {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            cartQuantity: newQuantity
          };
        }

        return {
          ...state,
          items: updatedItems
        };
      } else {
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: product.stock > 0 ? 'limited' : 'unlimited',
          quantity_items: product.stock?.toString(),
          cartQuantity: Math.min(quantity, product.stock || quantity)
        };

        return {
          ...state,
          items: [...state.items, cartItem]
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.id !== productId)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId)
        };
      }

      const updatedItems = state.items.map(item => {
        if (item.id === productId) {
          // Check stock limits if quantity is limited
          const maxQuantity = item.stock || quantity;
          const newQuantity = Math.min(quantity, maxQuantity);
          
          return {
            ...item,
            cartQuantity: newQuantity
          };
        }
        return item;
      });

      return {
        ...state,
        items: updatedItems
      };
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        items: []
      };
    }

    default:
      return state;
  }
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, dispatch] = useReducer(cartReducer, defaultCartState);

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity }
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { productId }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

export const getCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.price * (item.cartQuantity || 0));
  }, 0);
};

export const getCartItemCount = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.cartQuantity || 0);
  }, 0);
};

export const getCartItem = (items: CartItem[], productId: string): CartItem | undefined => {
  return items.find(item => item.id === productId);
};