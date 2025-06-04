'use client';

import { ShimmerCard } from './loading';
import { useProducts } from '@/data/product';
import { useCategories } from '@/data/category';
import { useStore } from '@/context/store-context';
import Hero from '@/components/store/hero';
import ProductCard from '@/components/product/product-card';
import ProductFilters from '@/components/product/product-filters';
import ProductCategory from '@/components/product/product-category';
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

      <main
        className="container mx-auto px-4 sm:px-6 py-10"
        style={{
          marginTop: config?.show_hero ? 64 : 0,
        }}
      >
        {(products?.length || 0) > 0 || filters.search || filters.category ? (
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
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-3xl mx-auto">
              <div className="mb-8">
                <div
                  className="inline-block p-3 rounded-full mb-4"
                  style={{
                    backgroundColor: `${config?.theme_color || '#0070F3'}15`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: config?.theme_color || '#0070F3' }}
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: config?.text_color || '#000000' }}
                >
                  {store?.name} is Coming Soon!
                </h2>
                <p className="text-lg opacity-80 mb-6">
                  {store?.description ||
                    'This store is currently being set up. Check back soon to see our products!'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  {store?.phone && (
                    <a
                      href={`tel:${config?.contact_phone || store.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                      style={{
                        backgroundColor: `${
                          config?.theme_color || '#0070F3'
                        }15`,
                        color: config?.theme_color || '#0070F3',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      Call Us
                    </a>
                  )}
                  {store?.email && (
                    <a
                      href={`mailto:${config?.contact_email || store.email}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                      style={{
                        backgroundColor: `${
                          config?.theme_color || '#0070F3'
                        }15`,
                        color: config?.theme_color || '#0070F3',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                      Email Us
                    </a>
                  )}
                </div>

                {(config?.instagram_url ||
                  config?.twitter_url ||
                  config?.facebook_url) && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-3 opacity-80">
                      Follow us on social media
                    </p>
                    <div className="flex justify-center gap-4">
                      {config?.instagram_url && (
                        <a
                          href={config.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full transition-all duration-200 hover:opacity-80"
                          style={{
                            backgroundColor: `${
                              config?.theme_color || '#0070F3'
                            }15`,
                            color: config?.theme_color || '#0070F3',
                          }}
                          aria-label="Instagram"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              width="20"
                              height="20"
                              x="2"
                              y="2"
                              rx="5"
                              ry="5"
                            ></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                          </svg>
                        </a>
                      )}
                      {config?.twitter_url && (
                        <a
                          href={config.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full transition-all duration-200 hover:opacity-80"
                          style={{
                            backgroundColor: `${
                              config?.theme_color || '#0070F3'
                            }15`,
                            color: config?.theme_color || '#0070F3',
                          }}
                          aria-label="Twitter"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                          </svg>
                        </a>
                      )}
                      {config?.facebook_url && (
                        <a
                          href={config.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full transition-all duration-200 hover:opacity-80"
                          style={{
                            backgroundColor: `${
                              config?.theme_color || '#0070F3'
                            }15`,
                            color: config?.theme_color || '#0070F3',
                          }}
                          aria-label="Facebook"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <footer
        className="mt-24 border-t pt-12"
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
              {config?.show_store_description && store?.description && (
                <p className="text-sm opacity-70">{store?.description}</p>
              )}
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

      <ProductModal store={store} storeConfig={config} />
    </div>
  );
}
