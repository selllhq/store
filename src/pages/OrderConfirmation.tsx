import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreConfigContext } from '../App';
import * as apiService from '../services/api';
import { Order } from '../services/api';
import { Store } from '../types/store';
import { format } from 'date-fns';

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
        // Get the store slug from the URL
        const hostname = window.location.hostname;
        const storeName = hostname.split('.')[0];
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        const storeSlug = isLocalhost ? 'demo-store' : storeName;
        
        // First fetch the store data to get the store ID
        let storeData: Store;
        try {
          storeData = await apiService.getStore(storeSlug);
        } catch (storeErr) {
          console.error('Error fetching store data:', storeErr);
          setError('Failed to load store information. Please try again later.');
          setLoading(false);
          return;
        }
        
        if (!storeData || !storeData.id) {
          setError('Store information not available');
          setLoading(false);
          return;
        }
        
        // Now fetch order details using the store ID
        const orderData = await apiService.getOrderDetails(storeData.id, orderId);
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
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-lg mb-2">Your order has been confirmed.</p>
        {orderDetails && (
          <p className="text-md text-gray-500">Order #{orderDetails.id}</p>
        )}
      </div>
      
      {orderDetails ? (
        <>
          <div className="bg-gray-200 rounded-lg overflow-hidden mb-8 shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Order Information</h3>
                  <p className="mb-1"><span className="text-gray-600">Order ID:</span> {orderDetails.id}</p>
                  <p className="mb-1"><span className="text-gray-600">Status:</span> <span className="capitalize">{orderDetails.status}</span></p>
                  <p className="mb-1"><span className="text-gray-600">Date:</span> {format(new Date(orderDetails.created_at), 'MMMM do, yyyy')}</p>
                  <p className="mb-1"><span className="text-gray-600">Customer ID:</span> {orderDetails.customer_id}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Payment Information</h3>
                  <p className="mb-1"><span className="text-gray-600">Session ID:</span></p>
                  <p className="mb-1 text-xs break-all">{orderDetails.billing_session_id}</p>
                  <p className="mb-1"><span className="text-gray-600">Store URL:</span> <a href={orderDetails.store_url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: storeConfig?.theme_color || '#FFA726' }}>{orderDetails.store_url}</a></p>
                  <p className="mb-1"><span className="text-gray-600">Last Updated:</span> {format(new Date(orderDetails.updated_at), 'MMMM do, yyyy')}</p>
                </div>
              </div>
              
              {orderDetails.items && orderDetails.items.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium mb-3">Items</h3>
                  <div className="bg-black rounded-lg mb-6 overflow-hidden">
                    {orderDetails.items.map(item => (
                      <div key={item.id} className="flex justify-between p-4 border-b border-gray-700">
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-white">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                      </div>
                    ))}
                    <div className="p-4 flex justify-between font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-amber-500">${typeof orderDetails.total === 'number' ? orderDetails.total.toFixed(2) : orderDetails.total}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-black rounded-lg p-6 mb-6 text-center">
                  <p className="text-white mb-4">Order details are being processed. Check back later for more information.</p>
                  <div className="p-4 flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-amber-500">${typeof orderDetails.total === 'number' ? orderDetails.total.toFixed(2) : orderDetails.total}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={handleContinueShopping}
              className="px-8 py-3 rounded font-medium transition-all duration-200 bg-amber-500 text-white hover:bg-amber-600"
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
