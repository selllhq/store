import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreConfigContext } from '../App';
import * as apiService from '../services/api';
import { Order } from '../services/api';

// Using the Order interface from api.ts

export default function OrderConfirmation() {
  const storeConfig = useContext(StoreConfigContext) || {};
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  
  const orderId = searchParams.get('order_id');
  
  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }
      
      try {
        // Get the store ID from the URL or localStorage
        const hostname = window.location.hostname;
        const storeName = hostname.split('.')[0];
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        const storeId = isLocalhost ? 'demo-store' : storeName;
        
        // Fetch order details using the new API function
        const orderData = await apiService.getOrderDetails(storeId, orderId);
        setOrderDetails(orderData);
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrderDetails();
  }, [orderId]);
  
  const handleContinueShopping = () => {
    // Clear cart and redirect to homepage
    localStorage.removeItem('cart');
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-t-4 border-b-4 rounded-full animate-spin" style={{ borderColor: storeConfig?.theme_color || '#FFA726' }}></div>
          <p className="mt-4 text-lg">Loading your order details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !orderId) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center py-12 px-4 rounded-lg" style={{ backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}80` : '#1E1E1E80' }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF000022', color: '#FF0000' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
          <p className="mb-8">{error || 'We could not find the order you are looking for.'}</p>
          <button 
            onClick={handleContinueShopping}
            className="px-6 py-2 rounded font-medium transition-all duration-200"
            style={{
              backgroundColor: storeConfig?.theme_color || '#FFA726',
              color: '#FFFFFF',
            }}
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${storeConfig?.theme_color || '#4CAF50'}22`, color: storeConfig?.theme_color || '#4CAF50' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-lg opacity-80 mb-2">Your order has been confirmed.</p>
        {orderDetails && (
          <p className="text-md opacity-70">Order #{orderDetails.id}</p>
        )}
      </div>
      
      {orderDetails ? (
        <>
          <div className="bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden mb-8" style={{ backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}40` : '#1E1E1E40', borderColor: storeConfig?.border_color || '#2A2A2A' }}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                  <p className="mb-1"><span className="opacity-70">Name:</span> {orderDetails.customer.name}</p>
                  <p className="mb-1"><span className="opacity-70">Email:</span> {orderDetails.customer.email}</p>
                  <p><span className="opacity-70">Phone:</span> {orderDetails.customer.phone}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                  <p className="mb-1"><span className="opacity-70">Order ID:</span> {orderDetails.id}</p>
                  <p className="mb-1"><span className="opacity-70">Status:</span> {orderDetails.status}</p>
                  <p className="mb-1"><span className="opacity-70">Date:</span> {new Date(orderDetails.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-3">Items</h3>
              <div className="border rounded-lg divide-y mb-6" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
                {orderDetails.items.map(item => (
                  <div key={item.id} className="flex justify-between p-4">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm opacity-70">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
                <div className="p-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span style={{ color: storeConfig?.theme_color || '#FFA726' }}>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={handleContinueShopping}
              className="px-8 py-3 rounded font-medium transition-all duration-200"
              style={{
                backgroundColor: storeConfig?.theme_color || '#FFA726',
                color: '#FFFFFF',
              }}
            >
              Continue Shopping
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p>No order details available.</p>
        </div>
      )}
    </div>
  );
}
