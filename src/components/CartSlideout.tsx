interface CartSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  currency?: string;
}

export default function CartSlideout({ isOpen, onClose, cartItems = [], currency = 'GHS' }: CartSlideoutProps) {
  if (!isOpen) return null;
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Can be calculated based on store settings
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Slideout Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-lg font-medium text-white">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100%-180px)] overflow-y-auto bg-zinc-900">
          {cartItems.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-400">{currency} {Number(item.price).toFixed(2)}</p>
                      </div>
                      <button className="text-gray-500 hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-3 border border-zinc-700 rounded-md">
                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">−</button>
                        <span className="text-white w-6 text-center">{item.quantity}</span>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">+</button>
                      </div>
                      <span className="text-white font-medium">{currency} {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">Your bag is empty</h3>
              <p className="text-gray-400 mb-6">Looks like you haven't added any items to your bag yet.</p>
              <button 
                onClick={onClose}
                className="px-6 py-3 w-full border border-zinc-700 text-white rounded-md hover:bg-zinc-800 transition-colors"
              >
                Keep Shopping
              </button>
            </div>
          )}
        </div>
        
        {/* Footer with Totals and Checkout */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-white">
                <span className="font-medium">{currency} {total.toFixed(2)}</span>
                <span className="text-right text-gray-400">Shipping: {currency} {shipping.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full py-3 bg-primary-color hover:bg-opacity-90 text-white font-medium rounded transition-colors">
                Checkout
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 border border-zinc-700 text-white font-medium rounded hover:bg-zinc-800 transition-colors"
              >
                Keep Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
