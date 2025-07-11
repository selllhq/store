'use client';

import Link from 'next/link';
import { useStore } from '@/context/store-context';
import Bag from './bag';

export default function TopNav() {
  const { store, config } = useStore();

  return (
    <>
      <header
        className="sticky top-0 z-50 shadow-sm border-b"
        style={{
          backgroundColor: config?.background_color || '#FFFFFF',
          color: config?.text_color || '#000000',
          borderColor: config?.border_color || '#E5E5EB',
        }}
      >
        {store?.status === 'sandbox' && (
          <div className="bg-red-400 text-white text-center font-semibold py-2">
            This store has not yet been activated, you will not be able to make
            purchases until it is activated.
          </div>
        )}
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {store.logo && config.show_store_logo && (
              <img
                alt={`${store.name} logo`}
                className="h-8 w-auto object-contain mr-3"
                src={store.logo}
              />
            )}
            {config.show_store_name && (
              <Link
                className="text-xl font-semibold hover:text-gray-700 transition-colors overflow-hidden text-ellipsis max-w-[220px] truncate"
                href="/"
                data-discover="true"
              >
                {store.name}
              </Link>
            )}
          </div>

          {/* <div className="hidden md:flex items-center space-x-8">
          <a
            className="text-sm font-medium transition-colors"
            href="/"
            data-discover="true"
          >
            Home
          </a>
          <a
            className="text-sm font-medium transition-colors"
            href="/products"
            data-discover="true"
          >
            Catalog
          </a>
          <button className="text-sm font-medium hover:text-gray-900 transition-colors">
            About
          </button>
        </div> */}

          <Bag store={store} storeConfig={config} />
        </div>
      </header>
    </>
  );
}
