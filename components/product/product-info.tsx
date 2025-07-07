'use client';

import { useState } from 'react';
import { useProductCartFunctions } from '@/data/product';

import BagIcon from '../icons/bag';
import { Button } from '../ui/button';

import type { Product } from '@/@types/product';
import type { Store, StoreConfig } from '@/@types/store';

export default function ProductInfo({
  product,
  store,
  storeConfig,
  // layout = 'modal',
  onAddToBag,
}: {
  product: Product;
  store?: Store;
  storeConfig?: StoreConfig;
  layout?: 'modal' | 'page';
  onAddToBag?: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const functions = useProductCartFunctions(product);

  const images = product?.images ? JSON.parse(product?.images) : [];

  return (
    <>
      <div className="w-full h-[50vh] md:h-full md:aspect-square relative flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {images.length > 0 ? (
          <div className="relative w-full h-full p-6 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-5 z-10 hero-gradient pointer-events-none"></div>

            <img
              src={images[selectedImage]}
              alt={`${product.name} - Image ${selectedImage + 1}`}
              className="w-full h-full object-contain relative z-20 transition-all duration-500 hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg
              className="w-20 h-20 text-gray-300 animate-pulse-slower"
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

        {images.length > 1 && (
          <div className="absolute bottom-3 left-4 right-4 z-20 w-1/2">
            <div className="flex gap-2 overflow-x-auto pb-2 px-2 -mx-2 snap-x">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 snap-start ${
                    selectedImage === index
                      ? 'ring-2 ring-offset-1 scale-105 shadow-lg'
                      : 'opacity-60 hover:opacity-90 hover:scale-105'
                  }`}
                  style={{
                    borderColor: storeConfig?.border_color || '#E5E5E5',
                    boxShadow:
                      selectedImage === index
                        ? `0 4px 12px ${
                            storeConfig?.theme_color || '#4CAF50'
                          }30`
                        : 'none',
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
      </div>

      <div className="absolute top-4 left-4 z-20">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            product.quantity === 'unlimited' ||
            (parseInt(product.quantity_items) ?? 0) > 0
              ? 'bg-green-500/20 text-green-500'
              : 'bg-red-500/20 text-red-500'
          }`}
        >
          {product.quantity === 'unlimited'
            ? 'Unlimited'
            : (parseInt(product.quantity_items) ?? 0) === 0
            ? 'Out of stock'
            : (parseInt(product.quantity_items) ?? 0) <= 5
            ? `Only ${product.quantity_items} left`
            : `${product.quantity_items} in stock`}
        </span>
      </div>

      <div className="flex flex-col p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-4 leading-tight">
          {product.name}
        </h2>

        <div className="mb-6">
          <p
            className="text-base leading-relaxed"
            style={{
              color: storeConfig?.text_color
                ? `${storeConfig.text_color}99`
                : '#666666',
            }}
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></p>
        </div>

        <div className="mb-6">
          <div className="text-sm font-medium mb-2 uppercase tracking-wider opacity-70">
            Price
          </div>
          <div
            className="text-3xl font-bold"
            style={{ color: storeConfig?.theme_color || '#4CAF50' }}
          >
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: store?.currency || 'USD',
            }).format(Number(product.price))}
          </div>
        </div>

        <div className="mb-8">
          <div className="text-sm font-medium mb-3 uppercase tracking-wider opacity-70">
            Quantity
          </div>
          <div className="flex items-center">
            <button
              onClick={functions.decrement}
              disabled={functions.isOutOfStock()}
              className={`w-10 h-10 flex items-center justify-center border rounded-l-lg transition-all duration-300 ${
                functions.isOutOfStock()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-black/5'
              }`}
              style={{
                borderColor: storeConfig?.border_color || '#E5E5E5',
              }}
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
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="number"
              value={functions.quantity}
              min={1}
              max={
                product.quantity === 'limited'
                  ? product.quantity_items
                  : undefined
              }
              disabled={
                functions.isOutOfStock() || functions.isQuantityLimitReached()
              }
              onChange={(e) => {
                const value = parseInt(e.target.value);

                if (functions.validate(value)) {
                  functions.setQuantity(value);
                }
              }}
              className={`w-12 h-10 text-center border-t border-b [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                functions.isOutOfStock() || functions.isQuantityLimitReached()
                  ? 'opacity-50 bg-transparent'
                  : ''
              }`}
              style={{
                borderColor: storeConfig?.border_color || '#E5E5E5',
              }}
            />
            <button
              onClick={functions.increment}
              disabled={
                functions.isOutOfStock() || functions.isQuantityLimitReached()
              }
              className={`w-10 h-10 flex items-center justify-center border rounded-r-lg transition-all duration-300 ${
                functions.isOutOfStock() || functions.isQuantityLimitReached()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-black/5'
              }`}
              style={{
                borderColor: storeConfig?.border_color || '#E5E5E5',
              }}
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
            </button>
          </div>
        </div>

        <Button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('addToBag', {
                detail: {
                  product,
                  quantity: functions.quantity,
                  image: images[0],
                },
              })
            );

            onAddToBag?.();
          }}
          disabled={
            functions.isOutOfStock() || functions.isQuantityLimitReached()
          }
          className={`w-full flex-1 py-4 text-base mt-auto max-h-12 h-full font-medium rounded-md text-center transition-all duration-300 flex items-center justify-center gap-2 ${
            functions.isOutOfStock() || functions.isQuantityLimitReached()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-lg hover:translate-y-[-1px]'
          }`}
          style={{
            backgroundColor: storeConfig?.theme_color || '#4CAF50',
            color: '#FFFFFF',
            boxShadow: `0 4px 15px ${storeConfig?.theme_color || '#4CAF50'}30`,
          }}
        >
          <BagIcon className="size-5" color="#fff" />
          Add to Bag
        </Button>

        {/* <button
              className="mt-4 w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              View Product
            </button> */}
      </div>
    </>
  );
}
