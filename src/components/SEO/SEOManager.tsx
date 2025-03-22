import React, { useEffect } from 'react';
import { Store } from '../../types/store';

interface SEOManagerProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product';
  store?: Store;
  storeConfig?: any;
}

/**
 * Component for managing SEO meta tags across the store
 * Uses direct DOM manipulation to update meta tags
 */
const SEOManager: React.FC<SEOManagerProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  store,
  storeConfig
}) => {
  // Default values if not provided
  const storeName = store?.name || 'Selll Store';
  const siteTitle = title ? `${title} | ${storeName}` : storeName;
  const siteDescription = description || `Shop the best products at ${storeName}. Quality items at great prices.`;
  const siteKeywords = keywords || `${storeName}, online store, shop, ecommerce`;
  const siteImage = image || storeConfig?.logo || storeConfig?.hero_image || '';
  const siteUrl = url || window.location.href;

  useEffect(() => {
    // Update document title
    document.title = siteTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attributeName = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attributeName}="${name}"]`);
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Update basic meta tags
    updateMetaTag('description', siteDescription);
    updateMetaTag('keywords', siteKeywords);

    // Update Open Graph tags
    updateMetaTag('og:title', siteTitle, true);
    updateMetaTag('og:description', siteDescription, true);
    updateMetaTag('og:image', siteImage, true);
    updateMetaTag('og:url', siteUrl, true);
    updateMetaTag('og:type', type, true);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', siteTitle);
    updateMetaTag('twitter:description', siteDescription);
    updateMetaTag('twitter:image', siteImage);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', siteUrl);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', siteUrl);
      document.head.appendChild(canonicalLink);
    }

    // Clean up function
    return () => {
      // No cleanup needed as we're just updating existing tags
    };
  }, [siteTitle, siteDescription, siteKeywords, siteImage, siteUrl, type]);

  // This component doesn't render anything visible
  return null;
};

export default SEOManager;
