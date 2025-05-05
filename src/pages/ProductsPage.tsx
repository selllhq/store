import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductFilters, getFilteredProducts, getStoreProducts } from '../services/api';
import { StoreConfigContext } from '../App';
import { CartFunctionsContext } from '../components/StoreLayout';
import { Store } from '../types/store';
import ShimmerCard from '../components/ShimmerCard';
import ProductCard from '../components/ProductCard';

interface ProductsPageProps {
  store?: Store;
  isProductDetail?: boolean;
}

export default function ProductsPage({ store, isProductDetail = false }: ProductsPageProps) {
  let storeConfig = useContext(StoreConfigContext) || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Set default colors if storeConfig is empty
  if (Object.keys(storeConfig).length === 0) {
    storeConfig = {
      background_color: '#FFFFFF',  // White background
      text_color: '#000000',       // Black text
      theme_color: '#3B82F6',      // Blue theme color
      border_color: '#E5E7EB'      // Light gray border
    };
  }
  
  const { addToBag, openBag } = useContext(CartFunctionsContext);
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: (searchParams.get('sort') as ProductFilters['sortBy']) || 'newest'
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [visibleProducts, setVisibleProducts] = useState(12);

  // Get product ID from URL if in product detail mode
  const { productId } = useParams<{ productId: string }>();
  
  // Fetch all store products for product detail view
  const { data: allProducts = [], isLoading: allProductsLoading } = useQuery({
    queryKey: ['allProducts', store?.id],
    queryFn: () => store?.id ? getStoreProducts(store.id) : Promise.resolve([]),
    enabled: !!store?.id && isProductDetail,
  });
  
  // Find the current product if in product detail mode
  const currentProduct = isProductDetail && productId ? 
    allProducts.find(p => p.id === productId) : 
    undefined;
  
  // Sync URL parameters with filters on initial load and when URL changes
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    const searchParam = searchParams.get('search');
    
    if (sortParam && sortParam !== filters.sortBy) {
      // Validate that sortParam is a valid sort option
      const validSortOptions: ProductFilters['sortBy'][] = ['newest', 'oldest', 'price_asc', 'price_desc', 'popular'];
      if (validSortOptions.includes(sortParam as ProductFilters['sortBy'])) {
        setFilters(prev => ({ ...prev, sortBy: sortParam as ProductFilters['sortBy'] }));
      }
    }
    
    if (searchParam !== searchTerm) {
      setSearchTerm(searchParam || '');
      if (searchParam) {
        setFilters(prev => ({ ...prev, search: searchParam }));
      }
    }
  }, [searchParams, location.search, filters.sortBy, searchTerm]);
  
  // Fetch filtered products for product listing
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['filteredProducts', store?.id, filters],
    queryFn: () => store?.id ? getFilteredProducts(store.id, filters) : Promise.resolve([]),
    enabled: !!store?.id && !isProductDetail,
  });
  
  // Redirect to products page if product not found
  useEffect(() => {
    if (isProductDetail && !allProductsLoading && allProducts.length > 0 && !currentProduct) {
      navigate('/products');
    }
  }, [isProductDetail, allProductsLoading, allProducts, currentProduct, navigate]);

  // Handle search input
  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    
    // Update URL query parameter
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      newSearchParams.set('search', searchTerm);
    } else {
      newSearchParams.delete('search');
    }
    setSearchParams(newSearchParams);
  };

  // Handle sort change
  const handleSortChange = (sortBy: ProductFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
    
    // Update URL query parameter
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (sortBy) {
      newSearchParams.set('sort', sortBy);
    }
    setSearchParams(newSearchParams);
  };

  // Load more products
  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 8);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ sortBy: 'newest' });
    setSearchTerm('');
    
    // Clear URL query parameters
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="py-12">
        {/* Search and Sort Controls Shimmer */}
        <div className="flex justify-between items-center mb-8">
          <div className="animate-pulse h-10 w-32 bg-gray-300 rounded-md"></div>
          <div className="animate-pulse h-10 w-64 bg-gray-300 rounded-md"></div>
        </div>
        
        {/* Products Grid Shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {[...Array(12)].map((_, index) => (
            <ShimmerCard key={index} type="product" />
          ))}
        </div>
        
        {/* Load More Button Shimmer */}
        <div className="flex justify-center mt-12 mb-8">
          <div className="animate-pulse h-12 w-48 bg-gray-300 rounded-md"></div>
        </div>
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

  // No need for client-side filtering or sorting as it's now handled by the API
  const sortedProducts = products;

  // If we're in product detail mode and have a current product, show the product detail view
  if (isProductDetail && currentProduct) {
    return (
      <>
        <div className="mb-6">
          <button 
            onClick={() => navigate('/products')} 
            className="flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: storeConfig?.theme_color || '#3B82F6' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Products
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}>
            {currentProduct.image ? (
              <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-auto object-cover" />
            ) : (
              <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {/* Stock indicator */}
            <div className="mb-4">
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${currentProduct.stock > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
              >
                {currentProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4" style={{ color: storeConfig?.text_color || '#000000' }}>
              {currentProduct.name}
            </h1>

            <div className="mb-6">
              <span
                className="text-3xl font-bold"
                style={{ color: storeConfig?.theme_color || '#3B82F6' }}
              >
                {new Intl.NumberFormat(
                  "en-US",
                  {
                    style: "currency",
                    currency: store?.currency || 'USD',
                  },
                ).format(currentProduct.price)}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2" style={{ color: storeConfig?.text_color || '#000000' }}>
                Description
              </h2>
              <p className="text-gray-600">
                {currentProduct.description || 'No description available for this product.'}
              </p>
            </div>

            <button
              onClick={() => {
                addToBag(currentProduct);
                openBag();
              }}
              className="w-full py-3 rounded-md font-medium transition-all duration-300 hover:bg-opacity-90 flex items-center justify-center gap-2"
              style={{
                backgroundColor: storeConfig?.theme_color || '#3B82F6',
                color: '#FFFFFF',
              }}
              disabled={currentProduct.stock <= 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {currentProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mt-6 md:mt-12 mb-8">All Products</h1>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <select
          value={filters.sortBy}
          onChange={(e) =>
            handleSortChange(e.target.value as ProductFilters['sortBy'])
          }
          className="border rounded-md py-3 px-3 text-sm focus:outline-none focus:ring-1 transition-all duration-300"
          style={{
            backgroundColor: storeConfig?.background_color
              ? `${storeConfig.background_color}`
              : '#FFFFFF',
            color: storeConfig?.text_color || '#000000',
            borderColor: storeConfig?.border_color || '#E5E7EB',
            outlineColor: storeConfig?.theme_color || '#3B82F6',
          }}
        >
          <option
            value="newest"
            style={{
              backgroundColor: storeConfig?.background_color
                ? `${storeConfig.background_color}`
                : '#FFFFFF',
            }}
          >
            Newest
          </option>
          <option
            value="oldest"
            style={{
              backgroundColor: storeConfig?.background_color
                ? `${storeConfig.background_color}`
                : '#FFFFFF',
            }}
          >
            Oldest
          </option>
          <option
            value="price_asc"
            style={{
              backgroundColor: storeConfig?.background_color
                ? `${storeConfig.background_color}`
                : '#FFFFFF',
            }}
          >
            Price: Low to High
          </option>
          <option
            value="price_desc"
            style={{
              backgroundColor: storeConfig?.background_color
                ? `${storeConfig.background_color}`
                : '#FFFFFF',
            }}
          >
            Price: High to Low
          </option>
          <option
            value="popular"
            style={{
              backgroundColor: storeConfig?.background_color
                ? `${storeConfig.background_color}`
                : '#FFFFFF',
            }}
          >
            Popularity
          </option>
        </select>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-md py-3 px-4 pr-10 text-sm focus:outline-none focus:ring-1 transition-all duration-300"
            style={{
              backgroundColor: storeConfig?.background_color
                ? `${storeConfig.background_color}`
                : '#FFFFFF',
              color: storeConfig?.text_color || '#000000',
              borderColor: storeConfig?.border_color || '#E5E7EB',
              outlineColor: storeConfig?.theme_color || '#3B82F6',
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {sortedProducts && sortedProducts.length > 0 ? (
        <>
          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
            {sortedProducts.slice(0, visibleProducts).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                store={store}
                storeConfig={storeConfig}
              />
            ))}
          </div>

          {/* Load More Button */}
          {visibleProducts < sortedProducts.length && (
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 rounded-md font-medium transition-all duration-300 hover:bg-opacity-90"
                style={{
                  backgroundColor: storeConfig?.theme_color || '#3B82F6',
                  color: '#FFFFFF',
                }}
              >
                Load More Products
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 px-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="max-w-md mx-auto">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>

            <h3 className="text-xl font-bold mb-2">
              {filters.search
                ? 'No matching products'
                : 'No products available yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.search
                ? "We couldn't find any products that match your search. Try adjusting your search criteria."
                : 'This store is still setting up their inventory. Check back soon for exciting new products!'}
            </p>

            {filters.search && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-md font-medium border transition-all duration-300 hover:bg-gray-100"
                style={{
                  borderColor: storeConfig?.theme_color || '#3B82F6',
                  color: storeConfig?.theme_color || '#3B82F6',
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
