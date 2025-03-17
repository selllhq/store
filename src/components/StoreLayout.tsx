import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import AboutModal from './AboutModal';
import CartSlideout from './CartSlideout';
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

export default function StoreLayout({ children, storeName }: StoreLayoutProps) {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems] = useState<any[]>([]);

  const { data: store, isLoading, error } = useQuery<Store>({
    queryKey: ['store', storeName],
    queryFn: () => getStore(storeName),
    enabled: !!storeName,
  });

  const { data: products } = useQuery({
    queryKey: ['products', store?.id],
    queryFn: () => store?.id ? getStoreProducts(store.id) : Promise.resolve([]),
    enabled: !!store?.id,
  });

  useEffect(() => {
    if (store?.theme) {
      document.documentElement.style.setProperty('--primary-color', store.theme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', store.theme.secondaryColor);
      document.documentElement.style.setProperty('--background-color', store.theme.backgroundColor);
      document.documentElement.style.setProperty('--text-color', store.theme.textColor);
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

  console.log(products);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navigation */}
      <header className="sticky top-0 bg-[#1E1E1E] z-10 border-b border-[#2A2A2A]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Store Logo & Name */}
            <div className="flex items-center gap-3 mr-8">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#2A2A2A] flex items-center justify-center text-white text-sm font-bold">
                {store?.logo ? (
                  <img src={store.logo} alt={store?.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{store?.name?.charAt(0) || 'S'}</span>
                )}
              </div>
              <h1 className="font-bold text-white">{store?.name || 'Store Name'} <a href="https://selll.online" target="_blank" rel="noopener noreferrer" className="italic pr-2 text-xs">on Selll</a></h1>
            </div>
          </div>
          <div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white px-5 py-2 font-medium transition-colors rounded flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart ({cartItems.length})</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-12 bg-[#121212] text-white">
        {/* If we're on the home page, show hero section (if enabled) and featured products */}
        {window.location.pathname === '/' || window.location.pathname === '/selll-store/' ? (
          <>
            {/* Optional Hero Section - Only show if store has hero content */}
            {store?.heroEnabled && (
              <div className="mb-16 rounded-xl overflow-hidden">
                <div className="relative">
                  {/* Hero Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1E1E1E] to-[#121212] opacity-80"></div>
                  
                  {/* Hero Image */}
                  {store?.heroImage ? (
                    <img 
                      src={store.heroImage} 
                      alt={store?.name} 
                      className="w-full h-[400px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[400px] bg-gradient-to-r from-[#1E1E1E] via-[#121212] to-[#2A2A2A] hero-gradient"></div>
                  )}
                  
                  {/* Hero Content */}
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                    <div className="max-w-2xl">
                      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        {store?.heroTitle || 'Discover Our Products'}
                      </h2>
                      <p className="text-lg text-gray-300 mb-8 max-w-xl">
                        {store?.heroDescription || 'Explore our collection of high-quality products designed to meet your needs.'}
                      </p>
                      <button className="bg-[#FFA726] hover:bg-[#FF9800] text-white px-8 py-3 rounded font-medium transition-all duration-300">
                        {store?.heroButtonText || 'Shop Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Featured Products */}
          <div className="mb-12">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {products.slice(0, 4).map((product: any) => (
                  <div key={product.id} className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                    {/* Product Image Area */}
                    <div className="relative aspect-square bg-[#1E1E1E]">
                      {/* Stock indicator */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                          {product.stock === -1 ? '∞ Unlimited' : `${product.stock || 20} in stock`}
                        </span>
                      </div>
                      
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Product Info Area - Dark Gray Background */}
                    <div className="p-4 bg-[#2A2A2A]">
                      <h3 className="font-bold text-xl text-white mb-1">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-white">
                          GHS {Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.sales || 0} sales
                        </span>
                      </div>
                      <Link 
                        to={`/product/${product.id}`} 
                        className="block w-full py-3 bg-[#FFA726] hover:bg-[#FF9800] text-white font-medium rounded text-center transition-colors duration-300"
                      >
                        View in Store
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg">
                <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <p className="text-gray-400 text-lg">No products available yet.</p>
                <p className="text-gray-500 text-sm mt-2">Check back soon for new arrivals!</p>
              </div>
            )}
          </div>
          </>
        ) : (
          children
        )}
      </main>
      
      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
        store={store || null}
      />
      
      {/* Cart Slideout */}
      <CartSlideout
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={store?.currency || 'GHS'}
      />
      
      <footer className="bg-[#1E1E1E] text-white py-16 border-t border-[#2A2A2A]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{store?.name}</h2>
              <p className="text-gray-400 max-w-md mb-4">{store?.description}</p>
              <button 
                onClick={() => setIsAboutModalOpen(true)} 
                className="text-gray-400 hover:text-[#FFA726] transition-colors bg-transparent border border-[#2A2A2A] px-4 py-2 rounded text-sm font-medium"
              >
                About Us
              </button>
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
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-gray-800">
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>contact@{window.location.hostname}</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} {store?.name || 'Store Name'}. Powered by <a href="https://selll.online" className="text-blue-400 hover:text-blue-300 font-medium">Selll</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
