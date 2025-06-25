import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

import type { Product } from '@/@types/product';
import type { Store, StoreConfig } from '@/@types/store';
import ProductInfo from '../product/product-info';
declare global {
  interface WindowEventMap {
    openProductModal: CustomEvent;
  }
}

export default function ProductModal({
  store,
  storeConfig,
}: {
  store: Store;
  storeConfig?: StoreConfig;
}) {
  const [product, setProduct] = useState<Product | undefined>();

  useEffect(() => {
    const handleOpenProductModal = (event: CustomEvent) => {
      // forced analytics...will refine later
      fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/analytics/product-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store_id: store?.id,
          action_id: event.detail.product.id,
          user_device:
            typeof window !== 'undefined'
              ? window.navigator.userAgent
              : 'unknown',
          metadata: {
            product_name: event.detail.product.name,
          },
        }),
      })
        .then(() => {})
        .catch((error) => {});

      setProduct(event.detail.product);
    };

    window.addEventListener('openProductModal', handleOpenProductModal);

    return () => {
      window.removeEventListener('openProductModal', handleOpenProductModal);
    };
  }, []);

  if (!product) {
    return null;
  }

  return (
    <div
      className="fixed w-screen h-screen left-0 top-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-500"
      onClick={() => {
        setProduct(undefined);
      }}
    >
      <div
        className="grid md:grid-cols-2 relative bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto md:overflow-hidden transform transition-all duration-500 border border-opacity-10"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: storeConfig?.background_color || '#FFFFFF',
          color: storeConfig?.text_color || '#000000',
          borderColor: storeConfig?.border_color || '#E5E7EB',
        }}
      >
        <Button
          variant="ghost"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-90 p-2 rounded-full transition-all duration-300 hover:bg-black/5"
          aria-label="Close modal"
          onClick={() => {
            setProduct(undefined);
          }}
        >
          <X className="h-6 w-6" />
        </Button>

        <ProductInfo
          store={store}
          product={product}
          storeConfig={storeConfig}
          onAddToBag={() => {
            setProduct(undefined);
          }}
        />
      </div>
    </div>
  );
}
