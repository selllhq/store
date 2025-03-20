import { useContext, useState } from 'react';
import { StoreConfigContext } from '../App';
import CheckoutModal from './CheckoutModal';
import { CartItem } from '../types/cart';

interface CartSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency?: string;
  updateQuantity?: (productId: string, quantity: number) => void;
  removeItem?: (productId: string) => void;
  isLoading?: boolean;
  storeId?: string;
  storeName?: string;
  clearCart?: () => void;
}

export default function CartSlideout({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  currency = 'USD', 
  updateQuantity, 
  removeItem, 
  isLoading = false,
  storeId,
  storeName,
  clearCart
}: CartSlideoutProps) {
  const storeConfig = useContext(StoreConfigContext) || {};
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Helper function to check if stock is available
  const isOutOfStock = (item: CartItem) => {
    if (item.quantity === 'unlimited') return false;
    return item.quantity === 'limited' && parseInt(item.quantity_items || '0') === 0;
  };

  // Helper function to check if quantity exceeds limit
  const isQuantityLimitReached = (item: CartItem, checkQuantity: number = Number(item.cartQuantity)) => {
    console.log('check', checkQuantity, item.quantity_items);
    if (item.quantity === 'unlimited') return false;
    return item.quantity === 'limited' && checkQuantity >= Number(item.quantity_items);
  };

  // Helper function to get maximum allowed quantity
  const getMaxQuantity = (item: CartItem) => {
    if (isOutOfStock(item)) return 0;
    if (item.quantity === 'limited') return parseInt(item.quantity_items || '0');
    return Infinity;
  };

  const handleCheckoutComplete = () => {
    if (clearCart) {
      clearCart();
    }
    onClose();
  };
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * Number(item.cartQuantity)), 0);
  const shipping = 0; // Can be calculated based on store settings
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      
      {/* Slideout Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-xl`}
        style={{ backgroundColor: storeConfig?.background_color || '#1E1E1E', color: storeConfig?.text_color || '#FFFFFF' }}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100%-180px)] overflow-y-auto" style={{ backgroundColor: storeConfig?.background_color || '#1E1E1E' }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-400 mt-4">Loading cart items...</p>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="divide-y" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex gap-4 relative">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0" style={{ backgroundColor: storeConfig?.border_color || '#2A2A2A' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 flex flex-col min-h-[5rem]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{currency} {Number(item.price).toFixed(2)}</p>
                          {item.description && (
                            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <button 
                        className="text-gray-500 hover:text-gray-300 ml-4 flex-shrink-0"
                        onClick={() => removeItem && removeItem(item.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 mt-auto">
                      <div className="flex justify-between items-center">
                        {/* Stock indicator */}
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded-full" 
                          style={{ 
                            backgroundColor: isOutOfStock(item)
                              ? '#FF000022'
                              : `${storeConfig?.theme_color || '#4CAF50'}22`,
                            color: isOutOfStock(item)
                              ? '#FF0000'
                              : storeConfig?.theme_color || '#4CAF50'
                          }}
                        >
                          {item.quantity === 'unlimited' 
                            ? 'Unlimited'
                            : parseInt(item.quantity_items || '0') === 0
                              ? 'Out of stock'
                              : `${item.quantity_items} in stock`
                          }
                        </span>
                        <span className="font-medium">{currency} {(item.price * Number(item.cartQuantity)).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 border rounded-md" style={{ borderColor: storeConfig?.theme_color || '#2A2A2A' }}>
                        <button 
                          className={`w-8 h-8 flex items-center justify-center text-gray-400 ${isOutOfStock(item) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => {
                            if (!isOutOfStock(item) && Number(item.cartQuantity) > 1) {
                              updateQuantity && updateQuantity(item.id, Number(item.cartQuantity) - 1);
                            }
                          }}
                          disabled={isOutOfStock(item)}
                        >−</button>
                        <input
                          type="number"
                            value={item.cartQuantity}
                          min={1}
                          max={getMaxQuantity(item)}
                          disabled={isOutOfStock(item) || isQuantityLimitReached(item)}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value)) return;
                            
                            const maxQuantity = getMaxQuantity(item);
                            if (maxQuantity === 0) return;
                            
                            if (value <= 0) {
                              updateQuantity && updateQuantity(item.id, 1);
                            } else if (value > maxQuantity) {
                              updateQuantity && updateQuantity(item.id, maxQuantity);
                            } else {
                              updateQuantity && updateQuantity(item.id, value);
                            }
                          }}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value) || value <= 0) {
                              updateQuantity && updateQuantity(item.id, 1);
                            }
                          }}
                          className={`w-10 h-8 text-center bg-transparent border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isOutOfStock(item) || isQuantityLimitReached(item) ? 'opacity-50 bg-transparent' : ''}`}
                        />
                        <button 
                          className={`w-8 h-8 flex items-center justify-center text-gray-400 ${isOutOfStock(item) || isQuantityLimitReached(item) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => {
                            if (!isOutOfStock(item) && !isQuantityLimitReached(item, Number(item.cartQuantity) + 1)) {
                              updateQuantity && updateQuantity(item.id, Number(item.cartQuantity) + 1);
                            }
                          }}
                          disabled={isOutOfStock(item) || isQuantityLimitReached(item)}
                        >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center" style={{ color: storeConfig?.text_color || '#FFFFFF' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Your bag is empty</h3>
              <p className="text-gray-400 mb-6">Looks like you haven't added any items to your bag yet.</p>
              <button 
                onClick={onClose}
                className="px-6 py-3 w-full border rounded transition-colors"
                style={{ 
                  borderColor: storeConfig?.border_color || '#2A2A2A',
                  backgroundColor: 'transparent',
                  filter: 'brightness(1)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = storeConfig?.theme_color ? `${storeConfig.theme_color}22` : '#2A2A2A'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Keep Shopping
              </button>
            </div>
          )}
        </div>
        
        {/* Footer with Totals and Checkout */}
        {!isLoading && cartItems.length > 0 && (
          <div 
            className="absolute bottom-0 left-0 right-0 border-t p-4 space-y-4"
            style={{ 
              backgroundColor: storeConfig?.background_color || '#1E1E1E',
              borderColor: storeConfig?.border_color || '#2A2A2A'
            }}
          >
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">{currency} {total.toFixed(2)}</span>
                <span className="text-right text-gray-400">Shipping: {currency} {shipping.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <button 
                className="w-full py-3 font-medium rounded transition-colors text-white"
                style={{ 
                  backgroundColor: storeConfig?.theme_color || '#FFA726',
                  filter: 'brightness(1)'
                }}
                onClick={() => setIsCheckoutModalOpen(true)}
                onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
                onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              >
                Checkout
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 border font-medium rounded transition-colors"
                style={{ 
                  borderColor: storeConfig?.theme_color || '#2A2A2A',
                  backgroundColor: 'transparent',
                  filter: 'brightness(1)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = storeConfig?.theme_color ? `${storeConfig.theme_color}22` : '#2A2A2A'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Keep Shopping
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        currency={currency}
        storeId={storeId}
        storeName={storeName}
        onCheckoutComplete={handleCheckoutComplete}
      />
    </>
  );
}
