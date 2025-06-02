'use client';

import { ShimmerCard } from './loading';
import { useProducts } from '@/data/product';
import { useCategories } from '@/data/category';
import { useStore } from '@/context/StoreContext';
import Hero from '@/components/store/hero';
import ProductCard from '@/components/store/product-card';
import ProductFilters from '@/components/store/product-filters';
import ProductCategory from '@/components/store/product-category';
import { Button } from '@/components/ui/button';
import ProductModal from '@/components/modals/product-modal';

export default function Home() {
  const { store, config } = useStore();
  const { isLoading, products, filters, setFilters } = useProducts(store.id);
  const { categories } = useCategories(store.id);

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

      <main className="container mx-auto mt-16 px-4 sm:px-6 py-10">
        <div id="products-section" className="scroll-m-28">
          <div className="flex justify-between items-center mb-8 gap-4">
            <h2
              className="text-3xl font-bold"
              style={{ color: config?.text_color || '#000000' }}
            >
              Our Products
            </h2>
            <div>
              {((products?.length || 0) > 0 ||
                filters.search ||
                filters.category) && (
                <ProductFilters
                  filters={filters}
                  setFilters={setFilters}
                  storeConfig={config}
                />
              )}
            </div>
          </div>

          {(categories?.length || 0) > 1 && (
            <div className="flex flex-wrap items-center -mt-6 mb-8 gap-4">
              {categories!.map((category) => (
                <ProductCategory
                  key={category.id}
                  storeConfig={config}
                  filters={filters}
                  category={category}
                  setFilters={setFilters}
                />
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {isLoading && (
              <>
                {[...Array(8)].map((_, index) => (
                  <ShimmerCard key={index} type="product" />
                ))}
              </>
            )}

            {!isLoading && products?.length === 0 && (
              <div className="col-span-4 text-center text-gray-500">
                No products found.{' '}
                {filters.search
                  ? `Try searching for something else.`
                  : filters.category
                  ? `Check for products in other categories.`
                  : ''}
                <br />
                {(filters.search || filters.category) && (
                  <Button
                    variant="link"
                    style={{
                      color: config?.theme_color || '#0070F3',
                    }}
                    onClick={() =>
                      setFilters({
                        search: '',
                        category: undefined,
                      })
                    }
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {(products?.length || 0) > 0 && (
              <>
                {products?.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    storeConfig={config}
                    currency={store.currency}
                  />
                ))}
              </>
            )}
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

      <ProductModal storeConfig={config} />
    </div>
  );
}
