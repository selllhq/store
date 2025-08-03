import type { Product } from '@/@types/product';

export default function ProductStockCount({ product }: { product: Product }) {
  return (
    <div className="absolute top-3 left-3 z-20">
      {product.quantity !== 'unlimited' && (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            product.quantity_items > '0'
              ? 'bg-green-700/50 text-white'
              : 'bg-red-500/30 text-red-500'
          }`}
        >
          {parseInt(product.quantity_items || '0') === 0
            ? 'Out of stock'
            : parseInt(product.quantity_items || '0') <= 5
            ? `Only ${product.quantity_items} left`
            : `${product.quantity_items} in stock`}
        </span>
      )}
    </div>
  );
}
