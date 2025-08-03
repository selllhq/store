'use client';

import { Product } from '@/@types/product';
import { StoreConfig } from '@/@types/store';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import ProductStockCount from './product-stock-count';

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
      className={`overflow-hidden`}
      style={{
        backgroundColor: storeConfig?.background_color
          ? `${storeConfig.background_color}`
          : '#FFFFFF',
        color: storeConfig?.text_color || '#000000',
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
        <ProductStockCount product={product} />

        {productImage ? (
          <div
            className={`relative w-full h-full overflow-hidden bg-neutral-200/55 rounded-lg`}
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
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg`}
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

      <div className={`relative py-6 px-0`}>
        <div
          className="absolute top-0 left-6 right-6 h-[1px] opacity-20"
          style={{
            backgroundColor: storeConfig?.theme_color || '#FFA726',
          }}
        ></div>

        <div className="flex items-center justify-between mb-1.5">
          <h3
            className={`font-bold line-clamp-1 group-hover:text-opacity-90 transition-colors duration-300 text-base sm:text-lg`}
          >
            {product.name}
          </h3>

          {(product.quantity === 'unlimited' ||
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
              className="size-6 md:size-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-120"
              style={{
                backgroundColor: 'transparent',
                color: storeConfig?.theme_color || '#FFA726',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="size-5 md:size-8"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v12m6-6H6"
                />
              </svg>
            </Button>
          )}
        </div>

        {storeConfig?.show_product_description && (
          <p
            className={`text-xs sm:text-sm mb-4 opacity-70 group-hover:opacity-90 transition-opacity duration-300 line-clamp-1`}
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></p>
        )}

        {storeConfig?.show_product_price && (
          <div className="flex justify-between items-center">
            <span
              className={`font-medium transition-all duration-300 group-hover:translate-x-1 text-md md:text-xl`}
              style={{
                color: storeConfig?.theme_color || '#FFA726',
              }}
            >
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
              }).format(Number(product.price))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
