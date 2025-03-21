import { useState, useEffect } from "react";


interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  images?: string[];
  brand?: string;
  quantity: 'limited' | 'in_stock' | 'out_of_stock';
  quantity_items?: number;
  features?: string[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  storeConfig: {
    background_color?: string;
    text_color?: string;
    theme_color?: string;
    border_color?: string;
  };
  store: any;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductModal({ isOpen, onClose, product, storeConfig, store, onAddToCart }: ProductModalProps) {
  if (!isOpen || !product) return null;

  // State for quantity and selected image
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reset quantity and selected image when modal is opened with a new product
  useEffect(() => {
    if (isOpen && product) {
      const maxQuantity = getMaxQuantity();
      setQuantity(maxQuantity > 0 ? 1 : 0);
      setSelectedImage(0);
    }
  }, [isOpen, product?.id]);

  // Helper function to get maximum allowed quantity
  const getMaxQuantity = () => {
    if (isOutOfStock()) return 0;
    if (product.quantity === 'limited') return product.quantity_items!;
    return Infinity;
  };

  // Ensure quantity never exceeds available stock
  useEffect(() => {
    const maxQuantity = getMaxQuantity();
    if (quantity > maxQuantity) {
      setQuantity(Math.max(0, maxQuantity));
    }
  }, [product.quantity, product.quantity_items, quantity]);

  const incrementQuantity = () => {
    const maxQuantity = getMaxQuantity();
    if (quantity < maxQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    const maxQuantity = getMaxQuantity();
    if (maxQuantity > 0 && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Helper function to check if product is out of stock
  const isOutOfStock = () => {
    return product.quantity === 'out_of_stock' ||
      (product.quantity === 'limited' && product.quantity_items === 0);
  };

  // Helper function to check if quantity exceeds limit
  const isQuantityLimitReached = (checkQuantity: number = quantity) => {
    return product.quantity === 'limited' && checkQuantity >= product.quantity_items!;
  };

  // Convert single image to array format for consistency
  const images = Array.isArray(product.images) ? product.images :
    product.image ? [product.image] : [];

  console.log(product, 'product');

  return (
    <>
      {/* Enhanced backdrop overlay with blur effect */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md transition-all duration-500"
        onClick={onClose}
      />

      {/* Modal content with modern design */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="relative bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-500 border border-opacity-10"
          style={{ 
            backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}F8` : '#FFFFFFF8', 
            color: storeConfig?.text_color || '#000000',
            borderColor: storeConfig?.border_color || '#E5E5E5',
            boxShadow: `0 25px 50px -12px ${storeConfig?.theme_color || '#4CAF50'}20`
          }}
        >
          {/* Enhanced close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 p-2 rounded-full transition-all duration-300 hover:bg-black/5"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Enhanced Product Images section */}
            <div className="w-full md:w-1/2 relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 opacity-40 pointer-events-none"></div>
              
              {/* Main image display with animation */}
              <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative w-full h-full p-6 flex items-center justify-center overflow-hidden">
                    {/* Subtle texture overlay */}
                    <div className="absolute inset-0 opacity-5 z-10 hero-gradient pointer-events-none"></div>
                    
                    <img
                      src={images[selectedImage]}
                      alt={`${product.name} - Image ${selectedImage + 1}`}
                      className="w-full h-auto object-contain relative z-20 transition-all duration-500 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg className="w-20 h-20 text-gray-300 animate-pulse-slower" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Enhanced image gallery with improved visuals */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="flex gap-2 overflow-x-auto pb-2 px-2 -mx-2 snap-x">
                    {images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 snap-start ${selectedImage === index 
                          ? 'ring-2 ring-offset-1 scale-105 shadow-lg' 
                          : 'opacity-60 hover:opacity-90 hover:scale-105'}`}
                        style={{
                          borderColor: storeConfig?.border_color || '#E5E5E5',
                          boxShadow: selectedImage === index ? `0 4px 12px ${storeConfig?.theme_color || '#4CAF50'}30` : 'none'
                        }}
                      >
                        <img
                          src={image}
                          alt={`${product.name} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced stock indicator */}
              <div className="absolute top-4 left-4 z-20">
                <span
                  className="text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg"
                  style={{
                    backgroundColor: isOutOfStock()
                      ? 'rgba(255, 0, 0, 0.15)'
                      : `${storeConfig?.theme_color || '#4CAF50'}15`,
                    color: isOutOfStock()
                      ? '#FF5252'
                      : storeConfig?.theme_color || '#4CAF50',
                    border: `1px solid ${isOutOfStock() ? 'rgba(255, 82, 82, 0.3)' : `${storeConfig?.theme_color || '#4CAF50'}30`}`,
                    boxShadow: `0 4px 12px ${isOutOfStock() ? 'rgba(255, 0, 0, 0.1)' : `${storeConfig?.theme_color || '#4CAF50'}10`}`
                  }}
                >
                  {product.quantity === 'limited'
                    ? product.quantity_items === 0
                      ? 'Out of stock'
                      : `${product.quantity_items} in stock`
                    : product.quantity === 'in_stock'
                      ? 'In stock'
                      : 'Out of stock'
                  }
                </span>
              </div>
            </div>

            {/* Enhanced Product Details with modern design */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col relative">
              {/* Subtle accent line */}
              <div className="absolute top-0 left-10 right-10 h-[1px] opacity-10 hidden md:block"
                style={{ backgroundColor: storeConfig?.theme_color || '#4CAF50' }}
              ></div>
              
              {product.brand && (
                <div className="mb-2 text-sm font-medium tracking-wide" 
                  style={{ color: storeConfig?.theme_color || '#4CAF50' }}
                >
                  {product.brand}
                </div>
              )}

              <h2 className="text-3xl font-bold mb-4 leading-tight">{product.name}</h2>

              <div className="mb-6">
                <p className="text-base leading-relaxed" 
                  style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}
                >
                  {product.description}
                </p>
              </div>

              {/* Enhanced product features with modern styling */}
              <div className="mb-8 space-y-3 bg-black/5 p-4 rounded-xl">
                <h3 className="font-medium mb-2">Features</h3>
                {product.features ? (
                  product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start group">
                      <span 
                        className="mr-3 text-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-110" 
                        style={{ color: storeConfig?.theme_color || '#4CAF50' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>{feature}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start group">
                      <span 
                        className="mr-3 text-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-110" 
                        style={{ color: storeConfig?.theme_color || '#4CAF50' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>100% cotton for breathability and comfort</p>
                    </div>
                    <div className="flex items-start group">
                      <span 
                        className="mr-3 text-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-110" 
                        style={{ color: storeConfig?.theme_color || '#4CAF50' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>Relaxed fit for all-day ease</p>
                    </div>
                    <div className="flex items-start group">
                      <span 
                        className="mr-3 text-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-110" 
                        style={{ color: storeConfig?.theme_color || '#4CAF50' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>Designed with Accra in mind</p>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-auto">
                {/* Enhanced price display */}
                <div className="mb-6">
                  <div className="text-sm font-medium mb-2 uppercase tracking-wider opacity-70">Price</div>
                  <div 
                    className="text-3xl font-bold" 
                    style={{ color: storeConfig?.theme_color || '#4CAF50' }}
                  >
                    {new Intl.NumberFormat(
                      "en-US",
                      {
                        style: "currency",
                        currency: store?.currency || 'USD',
                      },
                    ).format(product.price)}
                  </div>
                </div>

                {/* Enhanced quantity selector */}
                <div className="mb-8">
                  <div className="text-sm font-medium mb-3 uppercase tracking-wider opacity-70">Quantity</div>
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      disabled={isOutOfStock()}
                      className={`w-10 h-10 flex items-center justify-center border rounded-l-lg transition-all duration-300 ${isOutOfStock() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'}`}
                      style={{ borderColor: storeConfig?.border_color || '#E5E5E5' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      max={getMaxQuantity()}
                      disabled={isOutOfStock() || isQuantityLimitReached()}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value)) return;

                        const maxQuantity = getMaxQuantity();
                        if (maxQuantity === 0) return;

                        if (value <= 0) {
                          setQuantity(1);
                        } else if (value > maxQuantity) {
                          setQuantity(maxQuantity);
                        } else {
                          setQuantity(value);
                        }
                      }}
                      className={`w-12 h-10 text-center border-t border-b [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isOutOfStock() || isQuantityLimitReached() ? 'opacity-50 bg-transparent' : ''}`}
                      style={{
                        borderColor: storeConfig?.border_color || '#E5E5E5'
                      }}
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={isOutOfStock() || isQuantityLimitReached()}
                      className={`w-10 h-10 flex items-center justify-center border rounded-r-lg transition-all duration-300 ${isOutOfStock() || isQuantityLimitReached() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'}`}
                      style={{ borderColor: storeConfig?.border_color || '#E5E5E5' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Enhanced add to bag button */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => onAddToCart(product, quantity)}
                    disabled={isOutOfStock() || isQuantityLimitReached()}
                    className={`flex-1 py-4 text-base font-medium rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-2 ${isOutOfStock() || isQuantityLimitReached() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:translate-y-[-2px]'}`}
                    style={{
                      backgroundColor: storeConfig?.theme_color || '#4CAF50',
                      color: '#FFFFFF',
                      boxShadow: `0 4px 15px ${storeConfig?.theme_color || '#4CAF50'}30`
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Bag
                  </button>

                  <button
                    className="w-10 h-10 flex items-center justify-center border rounded"
                    style={{ borderColor: storeConfig?.border_color || '#E5E5E5' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
