'use client';

import { Product } from '@/@types/product';
import { StoreConfig } from '@/@types/store';
import { useRouter } from 'next/navigation';

export default function ProductCard({
  product,
  storeConfig,
}: {
  product: Product;
  storeConfig?: StoreConfig;
}) {
  const router = useRouter();

  return (
    <div
      key={product.id}
      className="rounded-lg overflow-hidden shadow-md border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
              detail: { product, storeConfig },
            })
          );
          return;
        } else {
          router.push(`/product/${product.id}`);
        }
      }}
    >
        Hello
    </div>
  );
}
