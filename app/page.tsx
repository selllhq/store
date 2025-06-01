'use client';

import Hero from '@/components/store/hero';
import ProductCard from '@/components/store/product-card';
import { useStore } from '@/context/StoreContext';
import { useProducts } from '@/data/product';

export default function Home() {
  const { store, config } = useStore();
  const { isLoading, products } = useProducts(store.id);

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
      <Hero store={store} storeConfig={config} />

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <div id="products-section">
          <h2
            className="text-2xl font-bold"
            style={{ color: config?.text_color || '#000000' }}
          >
            Our Products
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoading && (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-500">Loading products...</p>
              </div>
            )}

            {products?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeConfig={config}
              />
            ))}
          </div>
        </div>
      </main>

      <footer
        className="mt-24 border-t py-12"
        style={{
          borderColor: config?.border_color
            ? `${config.border_color}15`
            : '#E5E5E515',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                {store?.logo && (
                  <img
                    src={store.logo}
                    alt={`${store.name} logo`}
                    className="h-8 w-auto object-contain rounded-md"
                  />
                )}
                <h2 className="font-semibold text-lg">{store?.name}</h2>
              </div>
              <p className="text-sm opacity-70">
                &copy; {new Date().getFullYear()} {store?.name}. All rights
                reserved.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <button
                className="text-sm font-medium hover:opacity-80 transition-all duration-200 mb-1"
                style={{ color: config?.theme_color || '#0070F3' }}
              >
                About this store
              </button>
              <p className="text-sm opacity-70">
                Powered by{' '}
                <a
                  href="https://selll.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                  style={{ color: config?.theme_color || '#0070F3' }}
                >
                  Selll
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
