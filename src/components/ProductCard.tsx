/** @format */

import { useContext } from "react";
import { CartContext } from "../contexts";
import { CartContextType } from "../types/cart";

const ProductCard: React.FC<any> = ({ product, store, storeConfig }) => {
  const { addToCart } = useContext(CartContext) as CartContextType;

  const productImage =
    (product.images ? JSON.parse(product.images) : [])[0] ?? null;

  return (
    <div
      key={product.id}
      className="rounded-lg overflow-hidden shadow-md border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{
        backgroundColor: storeConfig?.background_color
          ? `${storeConfig.background_color}`
          : "#FFFFFF",
        color: storeConfig?.text_color || "#000000",
        borderColor: storeConfig?.border_color || "#E5E7EB",
      }}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("openProductModal", {
            detail: { product },
          })
        );
      }}
    >
      {/* Product Image Area with enhanced effects */}
      <div className="relative aspect-square overflow-hidden">
        {/* Stock indicator */}
        <div className="absolute top-3 right-3 z-20">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              product.quantity === "unlimited" || product.quantity_items > "0"
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {product.quantity === "unlimited"
              ? "Unlimited"
              : parseInt(product.quantity_items || "0") === 0
              ? "Out of stock"
              : parseInt(product.quantity_items || "0") <= 5
              ? `Only ${product.quantity_items} left`
              : `${product.quantity_items} in stock`}
          </span>
        </div>

        {/* Product image with enhanced hover effects */}
        {productImage ? (
          <div className="relative w-full h-full overflow-hidden">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-10 z-10 hero-gradient pointer-events-none"></div>

            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <svg
              className="w-16 h-16 text-gray-600 animate-pulse-slower"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        )}

        {/* Quick add overlay removed as requested */}
      </div>

      {/* Enhanced Product Info Area with modern design */}
      <div className="p-6 relative">
        {/* Subtle accent line */}
        <div
          className="absolute top-0 left-6 right-6 h-[1px] opacity-20"
          style={{
            backgroundColor: storeConfig?.theme_color || "#FFA726",
          }}
        ></div>

        <h3 className="font-bold text-xl mb-1.5 line-clamp-1 group-hover:text-opacity-90 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-sm mb-4 opacity-70 line-clamp-2 group-hover:opacity-90 transition-opacity duration-300">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span
            className="text-2xl font-bold transition-all duration-300 group-hover:translate-x-1"
            style={{
              color: storeConfig?.theme_color || "#FFA726",
            }}
          >
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: store?.currency,
            }).format(product.price)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent onClick
              addToCart(product, 1);
            }}
            className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md"
            style={{
              backgroundColor: storeConfig?.theme_color
                ? `${storeConfig.theme_color}20`
                : "#FFA72620",
              color: storeConfig?.theme_color || "#FFA726",
              boxShadow: `0 2px 8px ${storeConfig?.theme_color || "#FFA726"}20`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
