import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getStore } from '@/lib/http';
import ProductInfo from '@/components/product/product-info';
import ProductNotFound from '@/components/product/product-not-found';
import { Button } from '@/components/ui/button';

import type { StoreConfig } from '@/@types/store';
import { Product } from '@/@types/product';

async function getProduct(
  storeId: number,
  id: string
): Promise<Product | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASEURL}/stores/${storeId}/products/${id}`
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const store = await getStore();

  if (!store) {
    return {
      title: 'Store not found',
      description: 'Store not found',
    };
  }

  const product = await getProduct(store.id, (await params).id);

  if (!product) {
    return {
      title: 'Product not found',
      description: 'Product not found',
    };
  }

  const images = product?.images ? JSON.parse(product?.images) : [];

  return {
    icons: {
      icon: images[0]
        ? new URL(images[0])
        : new URL('https://zero.leafphp.dev/assets/img/logo.png'),
      apple: images[0]
        ? new URL(images[0])
        : new URL('https://zero.leafphp.dev/assets/img/logo.png'),
      shortcut: images[0]
        ? new URL(images[0])
        : new URL('https://zero.leafphp.dev/assets/img/logo.png'),
    },
    title: `${product.name} by ${store.name}`,
    description: product.description,
    openGraph: {
      title: `${product.name} by ${store.name}`,
      description: product.description,
      images: [
        {
          url: images[0],
          width: 672,
          height: 346,
        },
      ],
    },
  };
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const store = await getStore();

  if (!store) {
    redirect('/');
  }

  const product = await getProduct(store.id, (await params).id);

  if (!product) {
    return <ProductNotFound />;
  }

  const config: StoreConfig = store.config ? JSON.parse(store.config) : null;

  return (
    <div
      className="font-[family-name:var(--font-bricolage)]"
      style={{
        backgroundColor: config?.background_color || '#FFFFFF',
        color: config?.text_color || '#000000',
        minHeight: '100vh',
        paddingBottom: '4rem',
      }}
    >
      <main className="container mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 relative">
          <ProductInfo store={store} product={product} storeConfig={config} />
        </div>

        <div className="mt-10 max-w-xs mx-auto">
          <Button
            asChild
            variant="link"
            className="w-full py-4 text-base font-medium rounded-md text-center transition-all duration-300"
            style={{
              borderColor: config?.border_color || '#E5E5E5',
              color: config?.text_color || '#000000',
            }}
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
