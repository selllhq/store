import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import type { Store, StoreConfig } from '@/@types/store';

export default function AboutStoreModal({
  store,
  storeConfig,
}: {
  store: Store;
  storeConfig: StoreConfig;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="px-0"
          style={{ color: storeConfig?.theme_color || '#0070F3' }}
        >
          About this store
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <h3 className="font-semibold text-lg">About {store.name}</h3>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            {store?.logo && (
              <img
                src={store.logo}
                alt={`${store.name} logo`}
                className="h-12 w-auto object-contain rounded-md"
              />
            )}
            <div>
              {store.status === 'live' ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Live
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  Sandbox
                </span>
              )}
            </div>
          </div>

          {store.description && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">About</h4>
              <p className="text-sm">{store.description}</p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">
              Contact Information
            </h4>

            <div className="grid grid-cols-[24px_1fr] gap-x-2 gap-y-3 items-center">
              {(storeConfig?.contact_email || store.email) && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                  <a
                    href={`mailto:${storeConfig?.contact_email || store.email}`}
                    className="text-sm hover:underline"
                    style={{ color: storeConfig?.theme_color || '#0070F3' }}
                  >
                    {storeConfig?.contact_email || store.email}
                  </a>
                </>
              )}

              {(storeConfig?.contact_phone || store.phone) && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <a
                    href={`tel:${storeConfig?.contact_phone || store.phone}`}
                    className="text-sm hover:underline"
                    style={{ color: storeConfig?.theme_color || '#0070F3' }}
                  >
                    {storeConfig?.contact_phone || store.phone}
                  </a>
                </>
              )}

              {(storeConfig?.contact_address || store.address) && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <p className="text-sm">
                    {storeConfig?.contact_address || store.address}
                  </p>
                </>
              )}

              {store.country && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                  <p className="text-sm capitalize">{store.country}</p>
                </>
              )}
            </div>
          </div>

          {(storeConfig?.facebook_url ||
            storeConfig?.instagram_url ||
            storeConfig?.twitter_url) && (
            <div className="pt-2">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {storeConfig?.facebook_url && (
                  <a
                    href={storeConfig.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: `${
                        storeConfig?.theme_color || '#0070F3'
                      }15`,
                      color: storeConfig?.theme_color || '#0070F3',
                    }}
                    aria-label="Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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

                {storeConfig?.instagram_url && (
                  <a
                    href={storeConfig.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: `${
                        storeConfig?.theme_color || '#0070F3'
                      }15`,
                      color: storeConfig?.theme_color || '#0070F3',
                    }}
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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

                {storeConfig?.twitter_url && (
                  <a
                    href={storeConfig.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: `${
                        storeConfig?.theme_color || '#0070F3'
                      }15`,
                      color: storeConfig?.theme_color || '#0070F3',
                    }}
                    aria-label="Twitter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Store created: {new Date(store.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button>Continue Shopping</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
