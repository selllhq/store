import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreConfigContext } from '../App';
import { CartItem } from '../types/cart';
import * as apiService from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency?: string;
  storeId?: string; // Kept for future use
  storeName?: string; // Kept for future use
  onCheckoutComplete?: () => void;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
}

interface PaymentResponse {
  id: string;
  url: string;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  currency = 'USD',
  storeId,
  storeName,
  onCheckoutComplete
}: CheckoutModalProps) {
  const navigate = useNavigate();
  const storeConfig = useContext(StoreConfigContext) || {};
  const [step, setStep] = useState<'info' | 'payment' | 'confirmation'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: ''
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * Number(item.cartQuantity)), 0);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (step === 'info') {
        // Move to payment step after collecting customer information
        setStep('payment');
        setIsSubmitting(false);
        return;
      }
      
      if (step === 'payment') {
        // Format cart items for the API
        const formattedCart = cartItems.map(item => ({
          id: item.id,
          quantity: Number(item.cartQuantity)
        }));
        
        // Get the current URL for store_url and create a redirect URL
        const storeUrl = window.location.origin;
        const redirectUrl = `${storeUrl}/order`;
        
        // Prepare the payload
        const payload = {
          store_url: storeUrl,
          store_name: storeName, // Include store name in payload
          redirect_url: redirectUrl, // Add redirect URL for after payment
          cart: formattedCart,
          customer: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: customerInfo.address,
            city: customerInfo.city,
            country: customerInfo.country,
            notes: customerInfo.notes
          }
        };
        
        // Make the API request
        if (storeId) {
          // Use the same API configuration as in services/api.ts
          const response = await apiService.api.post(`/stores/${storeId}/pay`, payload);
          
          // Get the payment link from the response
          const paymentData = response.data as PaymentResponse;
          
          if (paymentData && paymentData.url) {
            // Check if it's an internal URL or external URL
            if (paymentData.url.includes(window.location.hostname)) {
              // Internal URL - use React Router navigation
              navigate(paymentData.url.replace(window.location.origin, ''));
            } else {
              // External URL - use window.location.href
              window.location.href = paymentData.url;
            }
          } else {
            // If no payment link is returned, move to confirmation
            setStep('confirmation');
            if (onCheckoutComplete) {
              onCheckoutComplete();
            }
          }
        } else {
          throw new Error('Store ID is missing');
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'An error occurred during checkout. Please try again.');
      // Stay on the current step to allow the user to retry
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  console.log(storeConfig, 'storeConfig');

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={step === 'confirmation' ? onClose : undefined}
      ></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative bg-white/95 backdrop-blur-xl rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}` : '#1E1E1EF2', color: storeConfig?.text_color || '#FFFFFF' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            {step === 'info' && (
              <>
                <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Order Summary</h3>
                  <div className="border rounded-lg divide-y" style={{ 
                    backgroundColor: storeConfig?.background_color || '#1A1A1A',
                    borderColor: storeConfig?.border_color || '#2A2A2A'
                  }}>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between p-3" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0" style={{ 
                            backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}` : '#1A1A1A'
                          }}>
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm opacity-70">Qty: {item.cartQuantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{currency} {(item.price * Number(item.cartQuantity)).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 flex justify-between font-medium" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
                      <span>Total</span>
                      <span style={{ color: storeConfig?.theme_color || '#FFA726' }}>{currency} {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: '#FF000022', color: '#FF0000' }}>
                      <p>{error}</p>
                    </div>
                  )}
                  <h3 className="text-lg font-medium mb-4">Your Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: storeConfig?.border_color || '#2A2A2A',
                          color: storeConfig?.text_color || '#FFFFFF'
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: storeConfig?.border_color || '#2A2A2A',
                          color: storeConfig?.text_color || '#FFFFFF'
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: storeConfig?.border_color || '#2A2A2A',
                          color: storeConfig?.text_color || '#FFFFFF'
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={customerInfo.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: storeConfig?.border_color || '#2A2A2A',
                          color: storeConfig?.text_color || '#FFFFFF'
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={customerInfo.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: storeConfig?.border_color || '#2A2A2A',
                          color: storeConfig?.text_color || '#FFFFFF'
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: storeConfig?.border_color || '#2A2A2A',
                          color: storeConfig?.text_color || '#FFFFFF'
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="notes" className="block text-sm font-medium mb-1">Order Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={customerInfo.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'transparent', 
                          borderColor: storeConfig?.border_color || '#2A2A2A',
                          color: storeConfig?.text_color || '#FFFFFF'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded font-medium transition-all duration-200 flex items-center justify-center cursor-pointer "
                    style={{
                      backgroundColor: storeConfig?.theme_color || '#FFA726',
                      color: '#FFFFFF',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Continue to Payment'
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <>
                <h2 className="text-2xl font-semibold mb-6">Payment Information</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Order Summary</h3>
                  <div className="border rounded-lg divide-y" style={{ 
                    backgroundColor: storeConfig?.background_color || '#1A1A1A',
                    borderColor: storeConfig?.border_color || '#2A2A2A'
                  }}>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between p-3" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0" style={{ 
                            backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}` : '#1A1A1A'
                          }}>
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm opacity-70">Qty: {item.cartQuantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{currency} {(item.price * Number(item.cartQuantity)).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 flex justify-between font-medium" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
                      <span>Total</span>
                      <span style={{ color: storeConfig?.theme_color || '#FFA726' }}>{currency} {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: '#FF000022', color: '#FF0000' }}>
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="mb-6 p-4 border rounded-lg" style={{ 
                    backgroundColor: storeConfig?.background_color || '#1A1A1A',
                    borderColor: storeConfig?.border_color || '#2A2A2A'
                  }}>
                    <div className="flex items-center mb-4">
                      <input 
                        type="radio" 
                        id="payment-online" 
                        name="payment-method" 
                        checked 
                        className="mr-2" 
                      />
                      <label htmlFor="payment-online" className="font-medium">Pay Online</label>
                    </div>
                    <p className="text-sm opacity-70">You'll be redirected to a secure payment page to complete your purchase.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 py-3 rounded font-medium transition-all duration-200 border cursor-pointer"
                      style={{
                        borderColor: storeConfig?.theme_color || '#FFA726',
                        color: storeConfig?.theme_color || '#FFA726',
                        backgroundColor: 'transparent'
                      }}
                      onClick={() => {
                        setStep('info');
                        setError(null);
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
                      style={{
                        backgroundColor: storeConfig?.theme_color || '#FFA726',
                        color: '#FFFFFF',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Proceed to Payment'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Confirmation Step */}
            {step === 'confirmation' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: storeConfig?.theme_color || '#4CAF50' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-3">Order Confirmed!</h2>
                <p className="mb-6 opacity-80">Thank you for your purchase, {customerInfo.name}.</p>
                <p className="mb-6 opacity-80">We've sent a confirmation email to {customerInfo.email}.</p>
                <p className="mb-6 opacity-80">You'll receive a payment confirmation once your payment is processed.</p>
                <p className="mb-8 opacity-80">Order total: <span style={{ color: storeConfig?.theme_color || '#FFA726' }}>{currency} {total.toFixed(2)}</span></p>
                
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded font-medium transition-all duration-200"
                  style={{
                    backgroundColor: storeConfig?.theme_color || '#FFA726',
                    color: '#FFFFFF',
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
