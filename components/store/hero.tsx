import { Store, StoreConfig } from "@/@types/store";
import { adjustColorBrightness } from "@/lib/utils";

export default function Hero({
  store,
  storeConfig
}: {
  store: Store,
  storeConfig?: StoreConfig
}) {
  return (
    <>
      {storeConfig?.show_hero && (
        <div
          className={
            'full-bleed' +
            (storeConfig?.padded_hero
              ? 'absolute top-[50px] left-0 w-full z-20'
              : ' ')
          }
        >
          <div className="relative w-full">
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            {storeConfig?.hero_image ? (
              <div className="relative h-[60vh] max-h-[600px] min-h-[400px] overflow-hidden">
                <img
                  src={storeConfig?.hero_image}
                  alt={store?.name}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center center',
                  }}
                />
              </div>
            ) : (
              <div
                className="relative h-[60vh] max-h-[600px] min-h-[400px]"
                style={{
                  background: `linear-gradient(to right, ${
                    storeConfig?.background_color || '#121212'
                  }, ${
                    storeConfig?.background_color
                      ? adjustColorBrightness(storeConfig.background_color, 15)
                      : '#1A1A1A'
                  })`,
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${
                      storeConfig?.theme_color || '#FFA726'
                    }15 0%, transparent 70%)`,
                    filter: 'blur(80px)',
                    opacity: 0.3,
                  }}
                ></div>
              </div>
            )}

            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-6">
                <div
                  className={`${
                    storeConfig?.hero_content_alignment === 'center'
                      ? 'mx-auto text-center'
                      : storeConfig?.hero_content_alignment === 'right'
                      ? 'ml-auto text-right'
                      : ''
                  } max-w-xl`}
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
                    {storeConfig?.hero_title || 'Discover Our Products'}
                  </h2>

                  <p
                    className="text-base md:text-lg text-white/80 mb-6"
                    style={{ fontWeight: '300' }}
                  >
                    {storeConfig?.hero_description ||
                      'Explore our collection of high-quality products designed to meet your needs.'}
                  </p>

                  {storeConfig?.show_hero_button && (
                    <div
                      className="flex"
                      style={{
                        justifyContent:
                          storeConfig?.hero_content_alignment === 'center'
                            ? 'center'
                            : storeConfig?.hero_content_alignment === 'right'
                            ? 'flex-end'
                            : 'flex-start',
                      }}
                    >
                      <button
                        className="px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 text-white flex items-center gap-2"
                        style={{
                          backgroundColor:
                            storeConfig?.theme_color || '#FFA726',
                          borderRadius: '6px',
                        }}
                        onClick={() =>
                          document
                            .getElementById('products-section')
                            ?.scrollIntoView({ behavior: 'smooth' })
                        }
                      >
                        {storeConfig?.hero_button_text || 'Shop Now'}
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
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10"></div>
          </div>
        </div>
      )}
    </>
  );
}
