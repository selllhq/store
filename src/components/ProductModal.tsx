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
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="relative bg-white/95 backdrop-blur-xl rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}F2` : '#FFFFFFEF', color: storeConfig?.text_color || '#000000' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Product Images */}
            <div className="w-full md:w-1/2 relative bg-gray-50">
              <div className="aspect-square flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={`${product.name} - Image ${selectedImage + 1}`}
                    className="w-full h-auto object-contain p-6"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center bg-gray-100">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Image gallery */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 px-2 -mx-2">
                    {images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 ${selectedImage === index ? `ring-2 ring-offset-1 ring-[${storeConfig?.theme_color || '#4CAF50'}]` : 'opacity-50 hover:opacity-75'}`}
                        style={{
                          borderColor: storeConfig?.border_color || '#E5E5E5'
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

              {/* Stock indicator */}
              <div className="absolute top-4 left-4">
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: isOutOfStock()
                      ? '#FF000022'
                      : `${storeConfig?.theme_color || '#4CAF50'}22`,
                    color: isOutOfStock()
                      ? '#FF0000'
                      : storeConfig?.theme_color || '#4CAF50'
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

            {/* Product Details */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              {product.brand && (
                <div className="mb-1 text-sm" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>
                  By {product.brand}
                </div>
              )}

              <h2 className="text-2xl font-semibold mb-4">{product.name}</h2>

              <div className="mb-6">
                <p className="text-sm" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>
                  {product.description}
                </p>
              </div>

              {/* Product features as bullet points */}
              <div className="mb-6 space-y-2">
                {product.features ? (
                  product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <span className="mr-2 text-sm" style={{ color: storeConfig?.theme_color || '#4CAF50' }}>•</span>
                      <p className="text-sm" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>{feature}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start">
                      <span className="mr-2 text-sm" style={{ color: storeConfig?.theme_color || '#4CAF50' }}>•</span>
                      <p className="text-sm" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>100% cotton for breathability and comfort</p>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2 text-sm" style={{ color: storeConfig?.theme_color || '#4CAF50' }}>•</span>
                      <p className="text-sm" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>Relaxed fit for all-day ease</p>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2 text-sm" style={{ color: storeConfig?.theme_color || '#4CAF50' }}>•</span>
                      <p className="text-sm" style={{ color: storeConfig?.text_color ? `${storeConfig.text_color}99` : '#666666' }}>Designed with Accra in mind</p>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-auto">
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Price</div>
                  <div className="text-xl font-semibold" style={{ color: storeConfig?.theme_color || '#000000' }}>
                    {new Intl.NumberFormat(
                      "en-US",
                      {
                        style: "currency",
                        currency:
                          store?.currency || 'USD',
                      },
                    ).format(product.price)}
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="mb-6">
                  <div className="text-sm font-medium mb-2">How Many</div>
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      disabled={isOutOfStock()}
                      className={`w-8 h-8 flex items-center justify-center border rounded-l ${isOutOfStock() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ borderColor: storeConfig?.border_color || '#E5E5E5' }}
                    >−</button>
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
                      className={`w-10 h-8 text-center border-t border-b [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isOutOfStock() || isQuantityLimitReached() ? 'opacity-50 bg-transparent' : ''}`}
                      style={{
                        borderColor: storeConfig?.border_color || '#E5E5E5'
                      }}
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={isOutOfStock() || isQuantityLimitReached()}
                      className={`w-8 h-8 flex items-center justify-center border rounded-r ${isOutOfStock() || isQuantityLimitReached() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ borderColor: storeConfig?.border_color || '#E5E5E5' }}
                    >+</button>
                  </div>
                </div>

                {/* Add to cart button */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => onAddToCart(product, quantity)}
                    disabled={isOutOfStock() || isQuantityLimitReached()}
                    className={`flex-1 py-3 text-sm font-medium rounded text-center transition-all duration-200 ${isOutOfStock() || isQuantityLimitReached() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    style={{
                      backgroundColor: storeConfig?.theme_color || '#4CAF50',
                      color: '#FFFFFF',
                    }}
                  >
                    Add to bag
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
