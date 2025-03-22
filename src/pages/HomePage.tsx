import { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProductFilters } from '../services/api';
import { StoreConfigContext } from '../App';
import { ProductsContext, CartFunctionsContext } from '../components/StoreLayout';
import { Store } from '../types/store';

// Helper function to adjust color brightness
const adjustColorBrightness = (hex: string, percent: number): string => {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  const adjustedR = Math.min(255, Math.max(0, r + (r * percent / 100)));
  const adjustedG = Math.min(255, Math.max(0, g + (g * percent / 100)));
  const adjustedB = Math.min(255, Math.max(0, b + (b * percent / 100)));
  
  // Convert back to hex
  return `#${Math.round(adjustedR).toString(16).padStart(2, '0')}${Math.round(adjustedG).toString(16).padStart(2, '0')}${Math.round(adjustedB).toString(16).padStart(2, '0')}`;
};

interface HomePageProps {
  storeConfig?: any;
  store?: Store;
}

export default function HomePage({ store }: HomePageProps) {
  const storeConfig = useContext(StoreConfigContext) || {};
  const { addToBag, openBag } = useContext(CartFunctionsContext);
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: 'newest'
  });
  // Categories no longer needed since we removed filter tabs
  const [searchTerm, setSearchTerm] = useState('');
  // Featured items functionality removed
  const [visibleProducts, setVisibleProducts] = useState(8);
  // Active filter no longer needed since we removed filter tabs

  // Get products data from context instead of making a separate API call
  const products = useContext(ProductsContext);
  const isLoading = !products || products.length === 0;
  const error = null;

  // This effect moves the hero section outside the container to make it full-width
  useEffect(() => {
    if (storeConfig?.show_hero) {
      // Get the main element (container) and the body element
      const mainElement = document.querySelector('main');
      const bodyElement = document.querySelector('body');

      if (mainElement && bodyElement) {
        // Create or get the hero container
        let heroContainer = document.getElementById('full-width-hero');

        if (!heroContainer) {
          heroContainer = document.createElement('div');
          heroContainer.id = 'full-width-hero';
          heroContainer.style.width = '100%';
          heroContainer.style.position = 'relative';
          heroContainer.style.zIndex = '1';
          heroContainer.style.marginBottom = '2rem';

          // Insert the hero container after the header but before the main content
          mainElement.parentNode?.insertBefore(heroContainer, mainElement);
        }
      }
    }

    // Cleanup function
    return () => {
      const heroContainer = document.getElementById('full-width-hero');
      if (heroContainer) {
        heroContainer.remove();
      }
    };
  }, [storeConfig?.show_hero]);

  // Extract unique categories from products
  // Categories extraction no longer needed since we removed filter tabs

  // Filter products based on current filters
  const filteredProducts = products ? products.filter(product => {
    // Featured filter removed

    // Category filtering removed since we removed filter tabs

    // Filter by price range
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // Filter by search term
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !product.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    return true;
  }) : [];

  // Sort products based on sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'oldest':
        return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
      case 'popular':
        return (b.sales || 0) - (a.sales || 0);
      case 'newest':
      default:
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    }
  });

  // Handle search input
  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  // Category filter handling no longer needed

  // Load more products
  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 8);
  };

  // Filter change handling no longer needed

  // Handle sort change
  const handleSortChange = (sortBy: ProductFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({ sortBy: 'newest' });
    setSearchTerm('');
    // Featured reset removed
    setVisibleProducts(8);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 border-4 border-primary-color border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Error loading products</p>
      </div>
    );
  }



  return (
    <>
      {/* Full-width Hero Section - Only show if store has hero content */}
      {storeConfig?.show_hero && createPortal(
        <div className="w-full overflow-hidden">
          <div className="relative w-full">
            {/* Simple overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            {/* Hero Image with minimal effects */}
            {storeConfig?.hero_image ? (
              <div className="relative h-[60vh] max-h-[600px] min-h-[400px] overflow-hidden">
                <img
                  src={storeConfig?.hero_image}
                  alt={store?.name}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center center'
                  }}
                />
              </div>
            ) : (
              <div className="relative h-[60vh] max-h-[600px] min-h-[400px]" style={{
                background: `linear-gradient(to right, ${storeConfig?.background_color || '#121212'}, ${storeConfig?.background_color ? adjustColorBrightness(storeConfig.background_color, 15) : '#1A1A1A'})`
              }}>
                {/* Single subtle accent element */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${storeConfig?.theme_color || '#FFA726'}15 0%, transparent 70%)`,
                    filter: 'blur(80px)',
                    opacity: 0.3
                  }}
                ></div>
              </div>
            )}

            {/* Ultra Minimal Hero Content */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-6">
                <div
                  className={`${storeConfig?.hero_content_alignment === 'center' ? 'mx-auto text-center' : storeConfig?.hero_content_alignment === 'right' ? 'ml-auto text-right' : ''} max-w-xl`}
                >
                  {/* Minimal title */}
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
                    {storeConfig?.hero_title || 'Discover Our Products'}
                  </h2>

                  {/* Minimal paragraph */}
                  <p className="text-base md:text-lg text-white/80 mb-6" style={{ fontWeight: '300' }}>
                    {storeConfig?.hero_description || 'Explore our collection of high-quality products designed to meet your needs.'}
                  </p>

                  {/* Minimal button */}
                  <div className="flex" style={{ justifyContent: storeConfig?.hero_content_alignment === 'center' ? 'center' : storeConfig?.hero_content_alignment === 'right' ? 'flex-end' : 'flex-start' }}>
                    <button
                      className="px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 text-white flex items-center gap-2"
                      style={{
                        backgroundColor: storeConfig?.theme_color || '#FFA726',
                        borderRadius: '6px'
                      }}
                      onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Shop Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle gradient for text readability */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10"></div>
          </div>
        </div>,
        document.getElementById('full-width-hero') || document.body
      )}

      {/* Main content starts here */}
      <div id="products-section" className="py-12 relative" style={{ 
        zIndex: 1,
        marginTop: storeConfig?.show_hero ? '0' : '2rem',
        background: storeConfig?.background_color || '#121212'
      }}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: storeConfig?.theme_color || '#FFA726' }}></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl opacity-5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
          style={{ backgroundColor: storeConfig?.theme_color || '#FFA726' }}></div>

        <div className="container mx-auto px-6">
          {/* Search and Sort Controls */}
          <div className="flex justify-between items-center mb-8">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as ProductFilters['sortBy'])}
              className="bg-zinc-900 border border-zinc-700 rounded-md py-3 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-color"
              style={{
                borderColor: storeConfig?.border_color || '#2A2A2A',
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Popularity</option>
            </select>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-3 px-4 pr-10 text-white text-sm focus:outline-none focus:ring-1"
                style={{
                  borderColor: storeConfig?.border_color || '#2A2A2A',
                  outlineColor: storeConfig?.theme_color || '#FFA726'
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {sortedProducts && sortedProducts.length > 0 ? (
            <>
              {/* Enhanced product grid with staggered animation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                {sortedProducts.slice(0, visibleProducts).map((product, index) => (
                  <div
                    key={product.id}
                    className={`rounded-xl overflow-hidden relative group cursor-pointer transform transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl border border-opacity-10 animate-fade-in`}
                    style={{
                      backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}` : '#1A1A1A',
                      color: storeConfig?.text_color || '#FFFFFF',
                      borderColor: storeConfig?.border_color || '#2A2A2A',
                      boxShadow: `0 10px 30px -15px ${storeConfig?.theme_color || '#FFA726'}30`,
                      animationDelay: `${index * 0.1}s`
                    }}
                    onClick={() => {
                      if (storeConfig?.open_product_in_popup) {
                        // Open product modal
                        window.dispatchEvent(new CustomEvent('openProductModal', { detail: { product } }));
                      } else {
                        window.location.href = `/product/${product.id}`;
                      }
                    }}
                  >
                    {/* Enhanced badge for new or featured products */}
                    {index < 3 && (
                      <div className="absolute top-3 left-3 z-20">
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1"
                          style={{
                            backgroundColor: `${storeConfig?.theme_color || '#FFA726'}15`,
                            color: storeConfig?.theme_color || '#FFA726',
                            border: `1px solid ${storeConfig?.theme_color || '#FFA726'}30`,
                            boxShadow: `0 4px 12px ${storeConfig?.theme_color || '#FFA726'}10`
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          {index === 0 ? 'Featured' : 'New'}
                        </span>
                      </div>
                    )}

                    {/* Product Image Area with enhanced effects */}
                    <div className="relative aspect-square overflow-hidden">
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-60"></div>

                      {/* Stock indicator with improved design */}
                      <div className="absolute top-3 right-3 z-20">
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full backdrop-blur-md shadow-lg"
                          style={{
                            backgroundColor: product.stock === 0 ? 'rgba(255, 0, 0, 0.15)' : `${storeConfig?.theme_color || '#4CAF50'}15`,
                            color: product.stock === 0 ? '#FF5252' : storeConfig?.theme_color || '#4CAF50',
                            border: `1px solid ${product.stock === 0 ? 'rgba(255, 82, 82, 0.3)' : `${storeConfig?.theme_color || '#4CAF50'}30`}`,
                            boxShadow: `0 4px 12px ${product.stock === 0 ? 'rgba(255, 0, 0, 0.1)' : `${storeConfig?.theme_color || '#4CAF50'}10`}`
                          }}
                        >
                          {product.stock === 0 ? 'Out of stock' :
                            product.stock === -1 ? '∞ Unlimited' :
                              `${product.stock || 20} in stock`}
                        </span>
                      </div>

                      {/* Product image with enhanced hover effects */}
                      {product.image ? (
                        <div className="relative w-full h-full overflow-hidden">
                          {/* Subtle texture overlay */}
                          <div className="absolute inset-0 opacity-10 z-10 hero-gradient pointer-events-none"></div>

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <svg className="w-16 h-16 text-gray-600 animate-pulse-slower" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      )}

                      {/* Quick add overlay removed as requested */}
                    </div>

                    {/* Enhanced Product Info Area with modern design */}
                    <div className="p-6 relative">
                      {/* Subtle accent line */}
                      <div
                        className="absolute top-0 left-6 right-6 h-[1px] opacity-20"
                        style={{ backgroundColor: storeConfig?.theme_color || '#FFA726' }}
                      ></div>

                      <h3 className="font-bold text-xl mb-1.5 line-clamp-1 group-hover:text-opacity-90 transition-colors duration-300">{product.name}</h3>
                      <p className="text-sm mb-4 opacity-70 line-clamp-2 group-hover:opacity-90 transition-opacity duration-300">{product.description}</p>

                      <div className="flex justify-between items-center">
                        <span
                          className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1"
                          style={{ color: storeConfig?.theme_color || '#FFA726' }}
                        >
                          {store?.currency || 'GHS'} {Number(product.price).toFixed(2)}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            addToBag(product);
                            // Open bag slideout
                            openBag();
                          }}
                          className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md"
                          style={{
                            backgroundColor: storeConfig?.theme_color ? `${storeConfig.theme_color}20` : '#FFA72620',
                            color: storeConfig?.theme_color || '#FFA726',
                            boxShadow: `0 2px 8px ${storeConfig?.theme_color || '#FFA726'}20`
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleProducts < sortedProducts.length && (
                <div className="flex justify-center mt-12 mb-8">
                  <button
                    onClick={handleLoadMore}
                    className="relative overflow-hidden group py-3 px-8 rounded-md font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
                    style={{
                      backgroundColor: storeConfig?.theme_color || '#FFA726',
                      color: '#FFFFFF',
                      boxShadow: `0 8px 20px -8px ${storeConfig?.theme_color || '#FFA726'}80`
                    }}
                  >
                    {/* Animated background effect */}
                    <div
                      className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, #FFFFFF 0%, transparent 70%)`
                      }}
                    ></div>

                    <span className="relative z-10 uppercase tracking-wide text-sm">Load More Products</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 px-6 rounded-xl bg-gradient-to-b from-transparent to-black/10 border border-opacity-10 backdrop-blur-sm"
              style={{
                borderColor: storeConfig?.border_color || '#2A2A2A',
                boxShadow: `0 20px 40px -20px ${storeConfig?.theme_color || '#FFA726'}15`
              }}
            >
              <div className="max-w-md mx-auto">
                {/* Animated icon */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full animate-pulse-slow"
                    style={{
                      backgroundColor: `${storeConfig?.theme_color || '#FFA726'}10`,
                      boxShadow: `0 0 30px ${storeConfig?.theme_color || '#FFA726'}20`
                    }}
                  ></div>
                  <svg
                    className="w-28 h-28 mx-auto relative z-10 animate-float"
                    style={{ color: storeConfig?.theme_color || '#FFA726' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>

                <h3 className="text-3xl font-bold mb-4">
                  {filters.search || filters.category ? "No matching products" : "No products available yet"}
                </h3>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                  {filters.search || filters.category
                    ? "We couldn't find any products that match your current filters. Try adjusting your search criteria."
                    : "This store is still setting up their inventory. Check back soon for exciting new products!"}
                </p>

                {(filters.search || filters.category) && (
                  <button
                    onClick={resetFilters}
                    className="px-8 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-lg flex items-center gap-2 mx-auto"
                    style={{
                      backgroundColor: storeConfig?.theme_color ? `${storeConfig.theme_color}15` : '#FFA72615',
                      color: storeConfig?.theme_color || '#FFA726',
                      border: `1px solid ${storeConfig?.theme_color || '#FFA726'}30`,
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear All Filters
                  </button>
                )}

                <div className="h-1 w-20 mx-auto mt-10 rounded-full" style={{ backgroundColor: storeConfig?.theme_color || '#FFA726' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
