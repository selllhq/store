import { useEffect, useState } from 'react';
import { useBag } from '@/context/bag-context';
import { Button } from '../ui/button';
import BagIcon from '../icons/bag';

import type { Store, StoreConfig } from '@/@types/store';
import { Minus, X } from 'lucide-react';
import { getProductCartFunctions } from '@/data/product';

declare global {
  interface WindowEventMap {
    addToBag: CustomEvent;
  }
}

export default function Bag({
  store,
  storeConfig,
}: {
  store: Store;
  storeConfig: StoreConfig;
}) {
  const { items, addToBag, removeFromBag, updateBagItem } = useBag();
  const [show, setShow] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    const handleCartEvent = (event: CustomEvent) => {
      addToBag({
        image: event.detail.image || '',
        product: event.detail.product,
        quantity: event.detail.quantity || 1,
      });

      setShow(true);
    };

    window.addEventListener('addToBag', handleCartEvent);

    return () => {
      window.removeEventListener('addToBag', handleCartEvent);
    };
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        className="relative p-2 hover:bg-gray-400/10 transition-colors"
        aria-label="Shopping Bag"
        onClick={() => setShow(true)}
      >
        <BagIcon color={storeConfig?.text_color} className="size-5 md:size-6" />
      </Button>

      <>
        <div
          onClick={() => setShow(false)}
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-xs ${
            show ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        ></div>

        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md z-50 transform transition-transform duration-300 ease-in-out ${
            show ? 'translate-x-0' : 'translate-x-full'
          } shadow-2xl`}
          style={{
            backgroundColor: storeConfig?.background_color || '#FFFFFF',
            color: storeConfig?.text_color || '#000000',
            borderColor: storeConfig?.border_color || '#E5E7EB',
          }}
        >
          <div
            className="p-6 border-b flex justify-between items-center"
            style={{
              borderColor: storeConfig?.border_color
                ? `${storeConfig.border_color}40`
                : 'rgba(42, 42, 42, 0.25)',
              backdropFilter: 'blur(8px)',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <div className="flex items-center gap-3">
              <BagIcon className="size-6" color={storeConfig?.text_color} />
              <h2 className="text-xl font-semibold tracking-tight">
                {items.length > 0 ? (
                  <>
                    {items.length} {items.length === 1 ? 'item' : 'items'} in
                    bag
                  </>
                ) : (
                  <>Your bag</>
                )}
              </h2>
            </div>
            <Button
              variant="ghost"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              onClick={() => {
                setShow(false);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col h-[calc(100%-80px)] overflow-y-auto">
            {items.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-full p-8 text-center"
                style={{ color: storeConfig?.text_color || '#FFFFFF' }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: storeConfig?.theme_color
                      ? `${storeConfig.theme_color}15`
                      : 'rgba(42, 42, 42, 0.2)',
                  }}
                >
                  <BagIcon
                    className="size-12"
                    color={storeConfig?.theme_color || '#FFA726'}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Your bag is empty
                </h3>
                <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                  Looks like you haven't added any items to your bag yet. Browse
                  the store and find something you'll love!
                </p>
                <button
                  onClick={() => {
                    setShow(false);
                  }}
                  className="px-6 py-3.5 w-full rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-lg text-white"
                  style={{
                    backgroundColor: storeConfig?.theme_color || '#FFA726',
                    transform: 'translateY(0)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = storeConfig?.theme_color
                      ? `0 8px 20px -4px ${storeConfig.theme_color}40`
                      : '0 8px 20px -4px rgba(255, 167, 38, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="py-2 space-y-4 relative h-full">
                {items.map((item) => {
                  const functions = getProductCartFunctions(
                    item.product,
                    item.quantity,
                    (quantity) => {
                      updateBagItem(item.product.id, quantity);
                    }
                  );

                  return (
                    <div
                      key={item.product.id}
                      className="p-4 mx-4 flex gap-4 relative rounded-xl transition-all duration-300 hover:shadow-lg"
                      style={{
                        backgroundColor: storeConfig?.border_color
                          ? `${storeConfig.border_color}10`
                          : 'rgba(42, 42, 42, 0.1)',
                        borderBottom: `1px solid ${
                          storeConfig?.border_color
                            ? `${storeConfig.border_color}20`
                            : 'rgba(42, 42, 42, 0.1)'
                        }`,
                      }}
                    >
                      <div
                        className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md transition-transform duration-300 hover:scale-105"
                        style={{
                          backgroundColor: storeConfig?.border_color
                            ? `${storeConfig.border_color}40`
                            : 'rgba(42, 42, 42, 0.25)',
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col min-h-[6rem]">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-base tracking-tight">
                              {item.product.name}
                            </h3>
                            <p
                              className="text-sm font-medium"
                              style={{
                                color: storeConfig?.theme_color || '#FFA726',
                              }}
                            >
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: store.currency || 'USD',
                              }).format(Number(item.product.price))}
                            </p>
                            {item.product.description && (
                              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                {item.product.description}
                              </p>
                            )}
                          </div>
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 ml-2 flex-shrink-0"
                            onClick={() => removeFromBag(item.product.id)}
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
                                strokeWidth={1.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-col gap-3 mt-auto">
                          <div className="flex justify-between items-center mt-3">
                            <span
                              className="text-xs font-medium px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: functions.isOutOfStock()
                                  ? 'rgba(255, 0, 0, 0.1)'
                                  : item.product.quantity === 'unlimited'
                                  ? `${storeConfig?.theme_color || '#4CAF50'}15`
                                  : parseInt(
                                      item.product.quantity_items || '0'
                                    ) <= 5
                                  ? 'rgba(255, 152, 0, 0.1)'
                                  : `${
                                      storeConfig?.theme_color || '#4CAF50'
                                    }15`,
                                color: functions.isOutOfStock()
                                  ? '#FF0000'
                                  : item.product.quantity === 'unlimited'
                                  ? storeConfig?.theme_color || '#4CAF50'
                                  : parseInt(
                                      item.product.quantity_items || '0'
                                    ) <= 5
                                  ? '#FF9800'
                                  : storeConfig?.theme_color || '#4CAF50',
                              }}
                            >
                              {item.product.quantity === 'unlimited'
                                ? 'Unlimited'
                                : parseInt(
                                    item.product.quantity_items || '0'
                                  ) === 0
                                ? 'Out of stock'
                                : parseInt(
                                    item.product.quantity_items || '0'
                                  ) <= 5
                                ? `Only ${item.product.quantity_items} left`
                                : `${item.product.quantity_items} in stock`}
                            </span>
                            <span className="font-semibold">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: store?.currency || 'USD',
                              }).format(
                                Number(item.product.price) *
                                  Number(item.quantity)
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3 mt-1">
                            <div
                              className="flex items-center rounded-lg overflow-hidden"
                              style={{
                                border: `1px solid ${
                                  storeConfig?.border_color
                                    ? `${storeConfig.border_color}40`
                                    : 'rgba(42, 42, 42, 0.25)'
                                }`,
                                backgroundColor: storeConfig?.border_color
                                  ? `${storeConfig.border_color}10`
                                  : 'rgba(42, 42, 42, 0.1)',
                              }}
                            >
                              <Button
                                onClick={() => functions.decrement()}
                                className={`w-9 h-9 flex items-center justify-center transition-colors hover:bg-gray-800 ${
                                  functions.isOutOfStock()
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                }`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <input
                                type="number"
                                value={item.quantity}
                                min={1}
                                max={functions.maxQuantity}
                                disabled={
                                  functions.isOutOfStock() ||
                                  functions.isQuantityLimitReached()
                                }
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);

                                  if (functions.validate(value)) {
                                    updateBagItem(item.product.id, value);
                                  }
                                }}
                                onBlur={(e) => {
                                  const value = parseInt(e.target.value);

                                  if (isNaN(value) || value <= 0) {
                                    updateBagItem(item.product.id, 1);
                                  }
                                }}
                                className={`w-10 h-9 text-center bg-transparent border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium ${
                                  functions.isOutOfStock() ||
                                  functions.isQuantityLimitReached()
                                    ? 'opacity-50 bg-transparent'
                                    : ''
                                }`}
                              />
                              <Button
                                className={`w-9 h-9 flex items-center justify-center transition-colors hover:bg-gray-800 ${
                                  functions.isOutOfStock() ||
                                  functions.isQuantityLimitReached()
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                }`}
                                onClick={() => functions.increment()}
                                disabled={
                                  functions.isOutOfStock() ||
                                  functions.isQuantityLimitReached()
                                }
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
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div
                  className="absolute bottom-0 left-0 right-0 border-t p-4 space-y-4"
                  style={{
                    backgroundColor: storeConfig?.background_color || '#1E1E1E',
                    borderColor: storeConfig?.border_color || '#2A2A2A',
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: store?.currency || 'USD',
                        }).format(
                          Number(
                            items.reduce(
                              (sum, item) =>
                                sum +
                                Number(item.product.price) *
                                  Number(item.quantity),
                              0
                            )
                          )
                        )}
                      </span>
                      <span className="text-right text-gray-400">
                        Shipping:{' '}
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: store?.currency || 'USD',
                        }).format(0)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      className="w-full py-3 font-medium rounded transition-colors text-white"
                      style={{
                        backgroundColor: storeConfig?.theme_color || '#FFA726',
                        filter: 'brightness(1)',
                      }}
                      onClick={() => setShowCheckoutModal(true)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.filter = 'brightness(0.9)')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.filter = 'brightness(1)')
                      }
                    >
                      Checkout
                    </button>
                    <button
                      onClick={() => setShow(false)}
                      className="w-full py-3 border font-medium rounded transition-colors"
                      style={{
                        borderColor: storeConfig?.theme_color || '#2A2A2A',
                        backgroundColor: 'transparent',
                        filter: 'brightness(1)',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          storeConfig?.theme_color
                            ? `${storeConfig.theme_color}22`
                            : '#2A2A2A')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      Keep Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    </>
  );
}
