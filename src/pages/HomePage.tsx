import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getStoreProducts, ProductFilters } from '../services/api';
import { Product } from '../types/product';

interface HomePageProps {
  storeId: string;
}

export default function HomePage({ storeId }: HomePageProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: 'newest'
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Featured items functionality removed
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [activeFilter, setActiveFilter] = useState<'latest' | 'action'>('latest');

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', storeId],
    queryFn: () => getStoreProducts(storeId),
    enabled: !!storeId,
  });
  
  // Extract unique categories from products
  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueCategories = Array.from(
        new Set(
          products
            .flatMap(product => product.categories || [])
            .filter(Boolean)
        )
      );
      setCategories(uniqueCategories);
    }
  }, [products]);

  // Filter products based on current filters
  const filteredProducts = products ? products.filter(product => {
    // Featured filter removed
    
    // Filter by category
    if (filters.category && (!product.categories || !product.categories.includes(filters.category))) {
      return false;
    }
    
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

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: prev.category === category ? undefined : category }));
  };

  // Load more products
  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 8);
  };

  // Handle filter change
  const handleFilterChange = (filter: 'latest' | 'action') => {
    setActiveFilter(filter);
  };

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
    <div className="py-12">
      <div className="container mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-6">
            <button 
              onClick={() => handleFilterChange('action')} 
              className={`text-lg font-medium ${activeFilter === 'action' ? 'text-white' : 'text-gray-500'} hover:text-white transition-colors`}
            >
              ACTION
              {activeFilter === 'action' && <div className="h-0.5 bg-primary-color mt-1"></div>}
            </button>
            <button 
              onClick={() => handleFilterChange('latest')} 
              className={`text-lg font-medium ${activeFilter === 'latest' ? 'text-white' : 'text-gray-500'} hover:text-white transition-colors`}
            >
              LATEST
              {activeFilter === 'latest' && <div className="h-0.5 bg-primary-color mt-1"></div>}
            </button>
          </div>
          
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="hidden md:flex space-x-4 ml-8">
              {categories.slice(0, 4).map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 text-sm rounded ${filters.category === category ? 'bg-primary-color text-white' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          
          {/* Sort & Search */}
          <div className="flex items-center space-x-4">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as ProductFilters['sortBy'])}
              className="bg-zinc-900 border border-zinc-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-color"
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
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 px-4 pr-10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-color"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {sortedProducts && sortedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {sortedProducts.slice(0, visibleProducts).map((product) => (
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
                        <span className="text-gray-500 text-sm">Add photos to showcase your product</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info Area - Dark Gray Background */}
                  <div className="p-4 bg-[#2A2A2A]">
                    <h3 className="font-bold text-xl text-white mb-1">{product.name || 'Product Name'}</h3>
                    <p className="text-gray-400 text-sm mb-3">{product.description || 'Product description will appear here'}</p>
                    
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
            
            {/* Load More Button */}
            {visibleProducts < sortedProducts.length && (
              <div className="flex justify-center my-8">
                <button 
                  onClick={handleLoadMore}
                  className="bg-black hover:bg-zinc-900 text-white font-medium py-3 px-8 transition-colors duration-300"
                >
                  load more
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              {filters.search || filters.category
                ? "No products match your current filters. Try adjusting your search criteria."
                : "This store doesn't have any products yet."}
            </p>
            {(filters.search || filters.category) && (
              <button
                onClick={resetFilters}
                className="inline-block px-6 py-3 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
