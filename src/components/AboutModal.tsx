import { StoreConfigContextType } from "../contexts/StoreConfigContext";

import { useContext } from "react";
import { StoreConfigContext } from "../contexts";
import { StoreConfig } from "../types/store";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: {
    name?: string;
    description?: string;
    email?: string;
    phone?: string;
    instagram?: string;
    twitter?: string;
  } | null;
  storeConfig?: {
    background_color?: string;
    text_color?: string;
    theme_color?: string;
    border_color?: string;
  };
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { store } = useContext(StoreConfigContext) as StoreConfigContextType;
  const storeConfig = store.config as StoreConfig;
  if (!isOpen) return null;

  return (
    <>
      {/* Enhanced backdrop overlay with blur effect */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md transition-all duration-500"
        onClick={onClose}
      />
      
      {/* Modal content with theme-consistent design */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div 
          className="relative bg-opacity-95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-500 border border-opacity-10"
          style={{ 
            backgroundColor: storeConfig?.background_color ? `${storeConfig.background_color}F8` : '#121212F8', 
            color: storeConfig?.text_color || '#FFFFFF',
            borderColor: storeConfig?.border_color || '#2A2A2A',
            boxShadow: `0 25px 50px -12px ${storeConfig?.theme_color || '#FFA726'}20`
          }}>
        {/* Enhanced close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 z-10 p-2 rounded-full transition-all duration-300 hover:bg-black/10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-opacity-10"
          style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}
        >
          <h2 className="text-2xl font-bold">About Us</h2>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Store Description */}
          <p className="text-lg mb-8 leading-relaxed opacity-90">
            {store?.description || 
              "I wanted to name the shop PantryBowl, but ill stick to osemu for now. I create things I feel should exist, and I sell items I feel the world should have and enjoy."}
          </p>
          
          {/* Contact Info */}
          <div className="space-y-4">
            {storeConfig?.email && (
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: storeConfig?.theme_color || '#FFA726' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href={`mailto:${storeConfig.email}`} 
                  className="hover:opacity-80 transition-opacity duration-300"
                  style={{ color: storeConfig?.theme_color || '#FFA726' }}
                >
                  {storeConfig.email}
                </a>
              </div>
            )}
            
            {storeConfig?.phone && (
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: storeConfig?.theme_color || '#FFA726' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a 
                  href={`tel:${storeConfig.phone}`} 
                  className="hover:opacity-80 transition-opacity duration-300"
                  style={{ color: storeConfig?.theme_color || '#FFA726' }}
                >
                  {storeConfig.phone}
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Social Links */}
        <div className="p-6 flex justify-end gap-4 border-t border-opacity-10"
          style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}
        >
          {storeConfig?.instagram && (
            <a 
              href={`https://instagram.com/${storeConfig.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: storeConfig?.theme_color ? `${storeConfig.theme_color}20` : '#FFA72620',
                color: storeConfig?.theme_color || '#FFA726'
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          
          {storeConfig?.twitter && (
            <a 
              href={`https://twitter.com/${storeConfig.twitter}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{ 
                backgroundColor: storeConfig?.theme_color ? `${storeConfig.theme_color}20` : '#FFA72620',
                color: storeConfig?.theme_color || '#FFA726'
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          )}
          
          {/* Default contact info if store doesn't provide any */}
          {!storeConfig?.email && !storeConfig?.phone && (
            <>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: storeConfig?.theme_color || '#FFA726' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href="mailto:info@selll.online" 
                  className="hover:opacity-80 transition-opacity duration-300"
                  style={{ color: storeConfig?.theme_color || '#FFA726' }}
                >
                  info@selll.online
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: storeConfig?.theme_color || '#FFA726' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a 
                  href="tel:+233530405191" 
                  className="hover:opacity-80 transition-opacity duration-300"
                  style={{ color: storeConfig?.theme_color || '#FFA726' }}
                >
                  +233504766732
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
