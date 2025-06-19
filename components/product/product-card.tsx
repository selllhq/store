'use client';

import { Product } from '@/@types/product';
import { StoreConfig } from '@/@types/store';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function ProductCard({
  product,
  storeConfig,
  currency = 'GHS',
}: {
  product: Product;
  storeConfig?: StoreConfig;
  currency?: string;
}) {
  const router = useRouter();
  const productImage =
    (product.images ? JSON.parse(product.images) : [])[0] ?? null;

  return (
    <div
      key={product.id}
      className={`overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        storeConfig?.two_cards_on_mobile
          ? 'border-0 md:border md:rounded-lg'
          : 'rounded-lg shadow-md'
      }`}
      style={{
        backgroundColor: storeConfig?.background_color
          ? `${storeConfig.background_color}`
          : '#FFFFFF',
        color: storeConfig?.text_color || '#000000',
        borderColor: storeConfig?.border_color || '#E5E7EB',
      }}
      onClick={() => {
        if (storeConfig?.open_product_in_popup) {
          window.dispatchEvent(
            new CustomEvent('openProductModal', {
              detail: { product, quantity: 1 },
            })
          );
        } else {
          router.push(`/products/${product.id}`);
        }
      }}
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute top-3 right-3 z-20">
          {product.quantity !== 'unlimited' && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                product.quantity_items > '0'
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {parseInt(product.quantity_items || '0') === 0
                ? 'Out of stock'
                : parseInt(product.quantity_items || '0') <= 5
                ? `Only ${product.quantity_items} left`
                : `${product.quantity_items} in stock`}
            </span>
          )}
        </div>

        {productImage ? (
          <div
            className={`relative w-full h-full overflow-hidden bg-neutral-200/55 ${
              storeConfig?.two_cards_on_mobile
                ? 'rounded-lg md:rounded-none'
                : ''
            }`}
          >
            <div className="absolute inset-0 opacity-10 z-10 hero-gradient pointer-events-none"></div>

            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
          </div>
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${
              storeConfig?.two_cards_on_mobile
                ? 'rounded-lg md:rounded-none'
                : ''
            }`}
          >
            <svg
              className="w-16 h-16 text-gray-600 animate-pulse-slower"
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

      <div
        className={`relative ${
          storeConfig?.two_cards_on_mobile ? 'py-3 px-0 sm:p-6' : 'p-6'
        }`}
      >
        <div
          className="absolute top-0 left-6 right-6 h-[1px] opacity-20"
          style={{
            backgroundColor: storeConfig?.theme_color || '#FFA726',
          }}
        ></div>

        <div className="flex items-center justify-between mb-1.5">
          <h3
            className={`font-bold line-clamp-1 group-hover:text-opacity-90 transition-colors duration-300 ${
              storeConfig?.two_cards_on_mobile
                ? 'text-base sm:text-lg md:text-xl'
                : 'text-xl'
            }`}
          >
            {product.name}
          </h3>

          {storeConfig?.two_cards_on_mobile &&
            (product.quantity === 'unlimited' ||
              parseInt(product.quantity_items || '0') > 0) && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  window.dispatchEvent(
                    new CustomEvent('addToBag', {
                      detail: { product, image: productImage, quantity: 1 },
                    })
                  );
                }}
                className="w-6 h-6 md:size-10 rounded-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md"
                style={{
                  backgroundColor: storeConfig?.theme_color
                    ? `${storeConfig.theme_color}20`
                    : '#FFA72620',
                  color: storeConfig?.theme_color || '#FFA726',
                  boxShadow: `0 2px 8px ${
                    storeConfig?.theme_color || '#FFA726'
                  }20`,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </Button>
            )}
        </div>

        {storeConfig?.show_product_description && (
          <p
            className={`text-xs sm:text-sm mb-4 opacity-70 group-hover:opacity-90 transition-opacity duration-300 ${
              storeConfig?.two_cards_on_mobile
                ? 'line-clamp-1 md:line-clamp-2'
                : 'line-clamp-2'
            }`}
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></p>
        )}

        {storeConfig?.show_product_price && (
          <div className="flex justify-between items-center">
            <span
              className={` font-bold transition-all duration-300 group-hover:translate-x-1 ${
                storeConfig.two_cards_on_mobile
                  ? 'text-md md:text-xl'
                  : 'text-2xl'
              }`}
              style={{
                color: storeConfig?.theme_color || '#FFA726',
              }}
            >
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
              }).format(Number(product.price))}
            </span>

            {!storeConfig?.two_cards_on_mobile &&
              (product.quantity === 'unlimited' ||
                parseInt(product.quantity_items || '0') > 0) && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(
                      new CustomEvent('addToBag', {
                        detail: { product, image: productImage, quantity: 1 },
                      })
                    );
                  }}
                  className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md"
                  style={{
                    backgroundColor: storeConfig?.theme_color
                      ? `${storeConfig.theme_color}20`
                      : '#FFA72620',
                    color: storeConfig?.theme_color || '#FFA726',
                    boxShadow: `0 2px 8px ${
                      storeConfig?.theme_color || '#FFA726'
                    }20`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </Button>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
