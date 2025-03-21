import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StoreConfigContext } from '../App';
import AboutModal from './AboutModal';
import BagSlideout from './BagSlideout';
import ProductModal from './ProductModal';
import { getStore, getStoreProducts } from '../services/api';

// Extended Store interface to include hero section properties
interface Store {
  id?: string;
  name?: string;
  description?: string;
  logo?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  twitter?: string;
  currency?: string;
  config?: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  heroEnabled?: boolean;
  heroImage?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroButtonText?: string;
}

interface StoreLayoutProps {
  children: React.ReactNode;
  storeName: string;
}

// Create a context for products data
export const ProductsContext = React.createContext<any[]>([]);

export default function StoreLayout({ children, storeName }: StoreLayoutProps) {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [bagItems, setBagItems] = useState<any[]>([]);
  const [selectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

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

  const { data: store, isLoading, error } = useQuery<Store>({
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
      <div className="min-h-screen" style={{ backgroundColor: storeConfig?.background_color, color: storeConfig?.text_color }}>
        {/* Navigation */}
        <header 
          className="sticky top-0 z-50 backdrop-blur-lg bg-opacity-80 shadow-lg" 
          style={{ 
            backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}AA` : '#1A1A1AAA', 
            borderBottom: `1px solid ${storeConfig?.border_color ? `${storeConfig.border_color}20` : '#2A2A2A20'}`,
          }}
        >
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Store Logo & Name */}
              <a href="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105">
                <div 
                  className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 transition-all duration-300 group-hover:rounded-full" 
                  style={{ 
                    borderColor: storeConfig?.theme_color || '#FFA726',
                    boxShadow: `0 4px 12px ${storeConfig?.theme_color ? `${storeConfig.theme_color}40` : 'rgba(255, 167, 38, 0.25)'}` 
                  }}
                >
                  {store?.logo ? (
                    <img src={store.logo} alt={store?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: storeConfig?.theme_color || '#FFA726' }}>
                      <span className="text-lg font-bold">{store?.name?.charAt(0) || 'S'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="font-bold text-xl tracking-tight">
                    {store?.name || 'Store Name'} 
                  </h1>
                  <a 
                    href="https://selll.online" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="italic text-xs opacity-70 hover:opacity-100 transition-all duration-300 hover:text-[#FFA726]"
                  >
                    powered by Selll
                  </a>
                </div>
              </a>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="px-4 py-2 font-medium transition-all duration-300 rounded-lg flex items-center gap-2 hover:bg-opacity-20"
                style={{ 
                  color: storeConfig?.text_color || '#FFFFFF'
                }}
              >
                <span>About</span>
              </button>
              <button
                onClick={() => setIsBagOpen(true)}
                className="relative px-5 py-2.5 font-medium transition-all duration-300 rounded-lg flex items-center gap-2 hover:scale-105 shadow-md"
                style={{ 
                  backgroundColor: storeConfig?.theme_color || '#FFA726',
                  color: '#FFFFFF'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Bag</span>
                {bagItems.length > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs flex items-center justify-center text-white font-medium shadow-sm"
                    style={{ backgroundColor: '#000000' }}
                  >
                    {bagItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>


        
        <main className="container mx-auto px-6 py-16" style={{ color: storeConfig?.text_color || '#FFFFFF' }}>
          {/* Share products data with child components via context */}
          <ProductsContext.Provider value={products}>
            {children}
          </ProductsContext.Provider>
        </main>

        {/* About Modal */}
        <AboutModal
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
          store={store || null}
        />

        {/* Bag Slideout */}
        <BagSlideout
          isOpen={isBagOpen}
          onClose={() => setIsBagOpen(false)}
          cartItems={bagItems}
          storeId={store?.id || ''}
          storeName={store?.name || ''}
          currency={store?.currency || 'GHS'}
          updateQuantity={updateBagItemQuantity}
          removeItem={removeFromBag}
        />

        <footer className="py-16 border-t" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
          <div className="container mx-auto px-6 space-y-8">
            {!storeConfig?.show_store_information_in_popup && (<div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
              <div className="mb-8 md:mb-0 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">{store?.name}</h2>
                <p className="text-gray-400 max-w-md mb-4">{store?.description}</p>
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-gray-500 hover:text-[#FFA726] transition-colors transform hover:scale-110">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-[#FFA726] transition-colors transform hover:scale-110">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 transition-colors transform hover:scale-110">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>)}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10 pb-10">
              <div className="md:col-span-1">
                <div className="flex flex-col space-y-4">
                  {store?.logo ? (
                    <img src={store.logo} alt={store?.name} className="h-8 w-auto mb-2" />
                  ) : (
                    <h3 className="text-lg font-semibold">{store?.name || 'Store'}</h3>
                  )}
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {store?.description || 'Quality products for our valued customers.'}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider mb-3 text-gray-300">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setIsAboutModalOpen(true) }} 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider mb-3 text-gray-300">Customer Service</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Shipping & Returns
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider mb-3 text-gray-300">Contact</h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  {(store?.email || storeConfig?.email) && (
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <span>{store?.email || storeConfig?.email}</span>
                    </li>
                  )}
                  {(store?.phone || storeConfig?.phone) && (
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <span>{store?.phone || storeConfig?.phone}</span>
                    </li>
                  )}
                </ul>
                
                {/* Social Media Links */}
                <div className="flex space-x-4 mt-4">
                  {(store?.instagram || storeConfig?.instagram) && (
                    <a 
                      href={`https://instagram.com/${store?.instagram || storeConfig?.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  
                  {(store?.twitter || storeConfig?.twitter) && (
                    <a 
                      href={`https://twitter.com/${store?.twitter || storeConfig?.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                      aria-label="Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-opacity-20 text-center text-gray-400 text-xs" style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}>
              <p>© {new Date().getFullYear()} {store?.name || 'Store Name'}. Powered by <a href="https://selll.online" className="font-medium transition-colors duration-200 hover:text-white" style={{ color: storeConfig?.theme_color }}>Selll</a></p>
            </div>
          </div>
        </footer>
      </div>

      {/* Product Modal */}
      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        product={selectedProduct} 
        storeConfig={storeConfig} 
        store={store} 
        onAddToCart={(product) => {
          addToBag(product);
          setIsProductModalOpen(false);
        }}
      />
    </StoreConfigContext.Provider>
  );
}
