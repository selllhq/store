import React from 'react';
import { Product } from '../../types/product';
import { Store } from '../../types/store';

interface ProductSchemaProps {
  product: Product;
  store?: Store;
  storeConfig?: any;
}

/**
 * Component that generates JSON-LD structured data for products
 * This helps search engines understand product information and display rich snippets
 */
const ProductSchema: React.FC<ProductSchemaProps> = ({ product, store, storeConfig }) => {
  // Format the price to include decimal places
  const formattedPrice = parseFloat(product.price.toString()).toFixed(2);
  
  // Determine availability based on stock
  const availability = product.stock > 0 
    ? 'https://schema.org/InStock' 
    : 'https://schema.org/OutOfStock';
  
  // Create the structured data object
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [product.image],
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: store?.name || 'Selll Store'
    },
    offers: {
      '@type': 'Offer',
      url: `${window.location.origin}/product/${product.id}`,
      priceCurrency: storeConfig?.currency || 'USD',
      price: formattedPrice,
      availability: availability,
      seller: {
        '@type': 'Organization',
        name: store?.name || 'Selll Store'
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default ProductSchema;
