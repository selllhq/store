import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StoreConfigContext } from '../App';
import AboutModal from './AboutModal';
import BagSlideout from './BagSlideout';
import ProductModal from './ProductModal';
import { getStore, getStoreProducts } from '../services/api';
import SEOHead from './SEO/SEOHead';
import StoreSchema from './SEO/StoreSchema';
import ProductSchema from './SEO/ProductSchema';

// Import the Store type from types
import { Store as StoreType } from '../types/store';

// Import icons
// Using inline SVG instead of react-icons to avoid dependency issues
const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);



interface StoreLayoutProps {
  children: (store: any) => React.ReactNode;
  storeName: string;
}

// Create contexts for products data and cart functions
export const ProductsContext = React.createContext<any[]>([]);
export const CartFunctionsContext = React.createContext<{
  addToBag: (product: any, quantity?: number) => void;
  openBag: () => void;
}>({ 
  addToBag: () => {},
  openBag: () => {} 
});

export default function StoreLayout({ children, storeName }: StoreLayoutProps) {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [bagItems, setBagItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Event listeners for custom events
  useEffect(() => {
    // Event listener for opening the product modal
    const handleOpenProductModal = (event: any) => {
      const { product } = event.detail;
      setSelectedProduct(product);
      setIsProductModalOpen(true);
    };

    // Event listener for opening the bag slideout
    const handleOpenBag = () => {
      setIsBagOpen(true);
    };
    
    // Track current path for SEO purposes
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Add event listeners
    window.addEventListener('openProductModal', handleOpenProductModal);
    window.addEventListener('openBag', handleOpenBag);
    window.addEventListener('popstate', handleRouteChange);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('openProductModal', handleOpenProductModal);
      window.removeEventListener('openBag', handleOpenBag);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Bag management functions
  const addToBag = (product: any, quantity: number = 1) => {
    setBagItems(prevItems => {
      // Check if product already exists in bag
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Product exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          cartQuantity: (updatedItems[existingItemIndex].cartQuantity || 1) + quantity
        };
        return updatedItems;
      } else {
        // Product doesn't exist, add new item
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          cartQuantity: quantity,
          quantity: product.quantity,
          quantity_items: product.quantity_items
        }];
      }
    });
    setIsBagOpen(true);
  };

  const updateBagItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromBag(productId);
      return;
    }
    
    setBagItems(prevItems => {
      return prevItems.map(item => 
        item.id === productId ? { ...item, cartQuantity: newQuantity } : item
      );
    });
  };

  const removeFromBag = (productId: string) => {
    setBagItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const { data: store, isLoading, error } = useQuery<StoreType>({
    queryKey: ['store', storeName],
    queryFn: () => getStore(storeName),
    enabled: !!storeName,
  });

  // Fetch products data to pass to HomePage
  const { data: products = [] } = useQuery({
    queryKey: ['products', store?.id],
    queryFn: () => store?.id ? getStoreProducts(store.id) : Promise.resolve([]),
    enabled: !!store?.id,
  });

  const storeConfig = JSON.parse(store?.config || '{}');

  useEffect(() => {
    if (store?.theme) {
      document.documentElement.style.setProperty('--primary-color', storeConfig?.theme_color);
      document.documentElement.style.setProperty('--secondary-color', store.theme.secondaryColor);
      document.documentElement.style.setProperty('--background-color', storeConfig?.background_color);
      document.documentElement.style.setProperty('--text-color', storeConfig?.text_color);
    }
  }, [store?.theme]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p>The store you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <StoreConfigContext.Provider value={storeConfig}>
      <div className="min-h-screen font-sans" style={{ backgroundColor: storeConfig?.background_color || '#FFFFFF', color: storeConfig?.text_color || '#1A1A1A' }}>
        {/* Navigation - Modern, minimal design */}
        <header 
          className="sticky top-0 z-50 backdrop-blur-xl bg-opacity-70 shadow-sm" 
          style={{ 
            backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}CC` : '#FFFFFFCC', 
            borderBottom: `1px solid ${storeConfig?.border_color ? `${storeConfig.border_color}15` : '#E5E5E515'}`,
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Store Logo & Name - Refined typography */}
            <div className="flex-1">
              <div className="flex items-center gap-3 transition-all duration-300">
                {store?.logo && (
                  <img 
                    src={store.logo} 
                    alt={`${store.name} logo`} 
                    className="h-10 w-auto object-contain rounded-md"
                  />
                )}
                <div>
                  <h1 className="font-bold text-xl tracking-tight">
                    <a href="/" className="hover:opacity-80 transition-opacity duration-200">
                      {store?.name || 'Store Name'}
                    </a>
                  </h1>
                  <a 
                    href="https://selll.online" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs opacity-60 hover:opacity-100 transition-all duration-200"
                    style={{ color: storeConfig?.theme_color || '#0070F3' }}
                  >
                    powered by Selll
                  </a>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full flex items-center gap-2 hover:bg-black/5"
                style={{ color: storeConfig?.text_color || '#1A1A1A' }}
              >
                <InfoIcon />
                <span>About</span>
              </button>
              <button
                onClick={() => setIsBagOpen(true)}
                className="relative px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded-full flex items-center gap-2 hover:shadow-lg"
                style={{ 
                  backgroundColor: storeConfig?.theme_color || '#0070F3',
                  color: '#FFFFFF'
                }}
              >
                <BagIcon />
                <span>Bag</span>
                {bagItems.length > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-medium shadow-sm"
                    style={{ backgroundColor: '#000000' }}
                  >
                    {bagItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div 
              className="md:hidden py-3 px-4 space-y-2 border-t animate-fadeIn"
              style={{ 
                borderColor: storeConfig?.border_color ? `${storeConfig.border_color}15` : '#E5E5E515',
                backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}F5` : '#FFFFFFF5'
              }}
            >
              <button
                onClick={() => {
                  setIsAboutModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg flex items-center gap-2 hover:bg-black/5"
                style={{ color: storeConfig?.text_color || '#1A1A1A' }}
              >
                <InfoIcon />
                <span>About</span>
              </button>
              <button
                onClick={() => {
                  setIsBagOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg flex items-center gap-2"
                style={{ 
                  backgroundColor: `${storeConfig?.theme_color || '#0070F3'}15`,
                  color: storeConfig?.theme_color || '#0070F3'
                }}
              >
                <BagIcon />
                <span>Bag ({bagItems.length})</span>
              </button>
            </div>
          )}
        </header>
        
        {/* SEO Components */}
        <SEOHead 
          title={currentPath === '/' ? 'Home' : selectedProduct ? selectedProduct.name : ''}
          description={store?.description || storeConfig?.store_description}
          image={selectedProduct ? selectedProduct.image : storeConfig?.logo || storeConfig?.hero_image}
          store={store}
          storeConfig={storeConfig}
          url={`${window.location.origin}${currentPath}`}
          type={selectedProduct ? 'product' : 'website'}
        />
        
        {/* Store Schema for organization data */}
        <StoreSchema store={store} storeConfig={storeConfig} />
        
        {/* Product Schema when a product is selected */}
        {selectedProduct && (
          <ProductSchema product={selectedProduct} store={store} storeConfig={storeConfig} />
        )}
        
        <main className="container mx-auto px-4 sm:px-6 py-8">
          {/* Share products data and cart functions with child components via context */}
          <ProductsContext.Provider value={products}>
            <CartFunctionsContext.Provider value={{ 
              addToBag: addToBag,
              openBag: () => setIsBagOpen(true)
            }}>
              {children(store)}
            </CartFunctionsContext.Provider>
          </ProductsContext.Provider>
        </main>

        {/* About Modal */}
        <AboutModal
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
          store={{
            name: store?.name,
            description: store?.description,
            email: storeConfig?.email,
            phone: storeConfig?.phone,
            instagram: storeConfig?.instagram,
            twitter: storeConfig?.twitter
          }}
          storeConfig={storeConfig}
        />

        {/* Bag Slideout */}
        <BagSlideout
          isOpen={isBagOpen}
          onClose={() => setIsBagOpen(false)}
          cartItems={bagItems}
          updateQuantity={updateBagItemQuantity}
          removeItem={removeFromBag}
          storeId={store?.id}
          storeName={store?.name}
        />
        
        {/* Product Modal */}
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          product={selectedProduct}
          storeConfig={storeConfig}
          store={store}
          onAddToCart={(product, quantity) => {
            addToBag(product, quantity);
            setIsProductModalOpen(false);
          }}
        />

        {/* Modern, Minimal Footer */}
        <footer 
          className="mt-24 border-t py-12"
          style={{ borderColor: storeConfig?.border_color ? `${storeConfig.border_color}15` : '#E5E5E515' }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex items-center gap-2">
                  {store?.logo && (
                    <img 
                      src={store.logo} 
                      alt={`${store.name} logo`} 
                      className="h-8 w-auto object-contain rounded-md"
                    />
                  )}
                  <h2 className="font-semibold text-lg">{store?.name}</h2>
                </div>
                <p className="text-sm opacity-70">
                  &copy; {new Date().getFullYear()} {store?.name}. All rights reserved.
                </p>
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-2">
                <button
                  onClick={() => setIsAboutModalOpen(true)}
                  className="text-sm font-medium hover:opacity-80 transition-all duration-200 mb-1"
                  style={{ color: storeConfig?.theme_color || '#0070F3' }}
                >
                  About this store
                </button>
                <p className="text-sm opacity-70">
                  Powered by{' '}
                  <a
                    href="https://selll.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                    style={{ color: storeConfig?.theme_color || '#0070F3' }}
                  >
                    Selll
                  </a>
                </p>
              </div>
            </div>
          </div>

        </footer>
        
        {/* Add to cart success notification */}
        <div id="notification-container" className="fixed bottom-4 right-4 z-50"></div>
      </div>
      
      {/* Add global styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </StoreConfigContext.Provider>
  );
}
