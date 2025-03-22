import React from 'react';

interface StoreSchemaProps {
  store?: any;
  storeConfig?: any;
}

/**
 * Component that generates JSON-LD structured data for the store
 * This helps search engines understand the business information
 */
const StoreSchema: React.FC<StoreSchemaProps> = ({ store, storeConfig }) => {
  // Create the structured data object for the organization/store
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: store?.name || 'Selll Store',
    url: window.location.origin,
    logo: storeConfig?.logo || '',
    description: store?.description || storeConfig?.store_description || 'Online store powered by Selll',
    address: {
      '@type': 'PostalAddress',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: ''
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: store?.phone || '',
      contactType: 'customer service',
      email: store?.email || storeConfig?.email || ''
    },
    sameAs: [
      '',
      store?.instagram || '',
      store?.twitter || ''
    ].filter(url => url !== '')
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StoreSchema;
