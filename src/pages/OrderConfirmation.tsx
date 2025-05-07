import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { StoreConfigContext } from '../App';
import * as apiService from '../services/api';
import { Order } from '../services/api';
import { Store } from '../types/store';
import { format } from 'date-fns';

// Using the Order interface from api.ts

export default function OrderConfirmation() {
  let storeConfig = useContext(StoreConfigContext) || {};
  
  // Set default colors if storeConfig is empty
  if (Object.keys(storeConfig).length === 0) {
    storeConfig = {
      background_color: '#FFFFFF',  // White background
      text_color: '#000000',       // Black text
      theme_color: '#3B82F6',      // Blue theme color
      border_color: '#E5E7EB'      // Light gray border
    };
  }
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
        {/* Order confirmation shimmer */}
        <div className="animate-pulse mb-8">
          <div className="h-10 w-64 bg-gray-300 rounded mb-2"></div>
          <div className="h-5 w-48 bg-gray-300 rounded"></div>
        </div>
        
        {/* Order details shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              <div className="h-5 w-full bg-gray-300 rounded"></div>
              <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-5 w-1/2 bg-gray-300 rounded"></div>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              <div className="h-5 w-full bg-gray-300 rounded"></div>
              <div className="h-5 w-2/3 bg-gray-300 rounded"></div>
              <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Items shimmer */}
        <div className="rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4 flex items-center">
                <div className="w-16 h-16 bg-gray-300 rounded mr-4"></div>
                <div className="flex-1">
                  <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Total shimmer */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <div className="h-5 w-24 bg-gray-300 rounded"></div>
              <div className="h-5 w-20 bg-gray-300 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-32 bg-gray-300 rounded"></div>
              <div className="h-5 w-20 bg-gray-300 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-6 w-24 bg-gray-300 rounded"></div>
              <div className="h-6 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
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

  console.log('Order Details:', orderDetails);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header section */}
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
          {/* Order summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Order Information Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm" 
              style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
              <div className="p-4 border-b border-gray-200 bg-gray-50/10" 
                style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
                <h3 className="font-medium">Order Information</h3>
              </div>
              <div className="p-6 space-y-3">
                <p><span className="text-gray-600">Order ID:</span> {orderDetails.id}</p>
                <p><span className="text-gray-600">Status:</span> <span className="capitalize">{orderDetails.status}</span></p>
                <p><span className="text-gray-600">Date:</span> {format(new Date(orderDetails.created_at), 'MMMM do, yyyy')}</p>
              </div>
            </div>

            {/* Payment Information Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
              <div className="p-4 border-b border-gray-200 bg-gray-50/10"
                style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
                <h3 className="font-medium">Payment Information</h3>
              </div>
              <div className="p-6 space-y-3">
                <p><span className="text-gray-600">Customer ID:</span> {orderDetails.customer_id}</p>
                <p>
                  <span className="text-gray-600">Store URL:</span>{' '}
                  {orderDetails.store_url.includes(window.location.hostname) ? (
                    <Link 
                      to={orderDetails.store_url.replace(window.location.origin, '')}
                      className="hover:underline" 
                      style={{ color: storeConfig?.theme_color || '#FFA726' }}
                    >
                      {orderDetails.store_url}
                    </Link>
                  ) : (
                    <a 
                      href={orderDetails.store_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline" 
                      style={{ color: storeConfig?.theme_color || '#FFA726' }}
                    >
                      {orderDetails.store_url}
                    </a>
                  )}
                </p>
                <p><span className="text-gray-600">Last Updated:</span> {format(new Date(orderDetails.updated_at), 'MMMM do, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Items Card */}
          {orderDetails.items && orderDetails.items.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8"
              style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
              <div className="p-4 border-b border-gray-200 bg-gray-50/10"
                style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
                <h3 className="font-medium">Items</h3>
              </div>
              <div className="divide-y divide-gray-200" style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
                {orderDetails.items.map(item => (
                  <div key={item.id} className="p-4 flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-4 flex items-center justify-center overflow-hidden">
                      {/* OrderItem doesn't have image property, so always show placeholder */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium" style={{ color: storeConfig?.theme_color || '#FFA726' }}>
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary Card */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8"
            style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
            <div className="p-4 border-b border-gray-200 bg-gray-50/10"
              style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
              <h3 className="font-medium">Order Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{typeof orderDetails.total === 'number' ? (orderDetails.total * 0.9).toFixed(2) : orderDetails.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>0</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200" 
                style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
                <span className="font-semibold">Total</span>
                <span className="font-semibold" style={{ color: storeConfig?.theme_color || '#FFA726' }}>
                  {Number(orderDetails.total).toLocaleString('en-US', {
                    style: 'currency',
                    currency: storeConfig?.currency || 'USD',
                  })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between mb-8">
            <Link 
              to="/" 
              className="px-6 py-2 border border-gray-300 rounded-md font-medium transition-all duration-200 hover:bg-gray-50/20 cursor-pointer"
              style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}
            >
              Back to Home
            </Link>
            <button 
              onClick={handleContinueShopping}
              className="px-6 py-2 rounded-md font-medium transition-all duration-200 text-white cursor-pointer"
              style={{ backgroundColor: storeConfig?.theme_color || '#FFA726' }}
            >
              Continue Shopping
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 border border-gray-200 rounded-lg"
          style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
          <p>No order details available.</p>
        </div>
      )}
    </div>
  );
}
