/** @format */

import { useContext } from "react";
import { Link } from "react-router-dom";
import { getFilteredProducts } from "../services/api";
import { StoreConfigContext } from "../App";
import { Store } from "../types/store";
import { useQuery } from "@tanstack/react-query";
import ShimmerCard from "../components/ShimmerCard";
import ProductCard from "../components/ProductCard";

// Helper function to adjust color brightness
const adjustColorBrightness = (hex: string, percent: number): string => {
  // Remove the # if present
  hex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Adjust brightness
  const adjustedR = Math.min(255, Math.max(0, r + (r * percent) / 100));
  const adjustedG = Math.min(255, Math.max(0, g + (g * percent) / 100));
  const adjustedB = Math.min(255, Math.max(0, b + (b * percent) / 100));

  // Convert back to hex
  return `#${Math.round(adjustedR).toString(16).padStart(2, "0")}${Math.round(
    adjustedG
  )
    .toString(16)
    .padStart(2, "0")}${Math.round(adjustedB).toString(16).padStart(2, "0")}`;
};

interface HomePageProps {
  storeConfig?: any;
  store?: Store;
}

export default function HomePage({ store }: HomePageProps) {
  let storeConfig = useContext(StoreConfigContext) || {};

  // Set default colors if storeConfig is empty
  if (Object.keys(storeConfig).length === 0) {
    storeConfig = {
      background_color: "#FFFFFF", // White background
      text_color: "#000000", // Black text
      theme_color: "#3B82F6", // Blue theme color
      border_color: "#E5E7EB", // Light gray border
    };
  }

  // Fetch popular products
  const {
    data: popularProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["popularProducts", store?.id],
    queryFn: () =>
      store?.id
        ? getFilteredProducts(store.id, { sortBy: "popular", limit: 8 })
        : Promise.resolve([]),
    enabled: !!store?.id,
  });

  // Extract unique categories from products
  // Categories extraction no longer needed since we removed filter tabs

  if (isLoading) {
    return (
      <div className="py-12">
        {/* Section Title Shimmer */}
        <div className="animate-pulse h-8 w-48 bg-gray-300 rounded mb-8"></div>

        {/* Products Grid Shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[...Array(8)].map((_, index) => (
            <ShimmerCard key={index} type="product" />
          ))}
        </div>

        {/* View All Button Shimmer */}
        <div className="flex justify-center mt-12 mb-8">
          <div className="animate-pulse h-12 w-48 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Error loading products</p>
      </div>
    );
  }

  const padHero =
    storeConfig?.padded_hero && !storeConfig?.show_hero
      ? "pt-[540px] md:pt-[600px]"
      : "";


  return (
    <>
      {/* Full-width Hero Section - Only show if store has hero content */}
      {storeConfig?.show_hero && (
        <div
          className={
            "full-bleed" +
            (storeConfig?.padded_hero
              ? "absolute top-[50px] left-0 w-full z-20"
              : " ")
          }
        >
          <div className="relative w-full">
            {/* Simple overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            {/* Hero Image with minimal effects */}
            {storeConfig?.hero_image ? (
              <div className="relative h-[60vh] max-h-[600px] min-h-[400px] overflow-hidden">
                <img
                  src={storeConfig?.hero_image}
                  alt={store?.name}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: "center center",
                  }}
                />
              </div>
            ) : (
              <div
                className="relative h-[60vh] max-h-[600px] min-h-[400px]"
                style={{
                  background: `linear-gradient(to right, ${
                    storeConfig?.background_color || "#121212"
                  }, ${
                    storeConfig?.background_color
                      ? adjustColorBrightness(storeConfig.background_color, 15)
                      : "#1A1A1A"
                  })`,
                }}
              >
                {/* Single subtle accent element */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${
                      storeConfig?.theme_color || "#FFA726"
                    }15 0%, transparent 70%)`,
                    filter: "blur(80px)",
                    opacity: 0.3,
                  }}
                ></div>
              </div>
            )}

            {/* Ultra Minimal Hero Content */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-6">
                <div
                  className={`${
                    storeConfig?.hero_content_alignment === "center"
                      ? "mx-auto text-center"
                      : storeConfig?.hero_content_alignment === "right"
                      ? "ml-auto text-right"
                      : ""
                  } max-w-xl`}
                >
                  {/* Minimal title */}
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
                    {storeConfig?.hero_title || "Discover Our Products"}
                  </h2>

                  {/* Minimal paragraph */}
                  <p
                    className="text-base md:text-lg text-white/80 mb-6"
                    style={{ fontWeight: "300" }}
                  >
                    {storeConfig?.hero_description ||
                      "Explore our collection of high-quality products designed to meet your needs."}
                  </p>

                  {/* Minimal button */}
                  <div
                    className="flex"
                    style={{
                      justifyContent:
                        storeConfig?.hero_content_alignment === "center"
                          ? "center"
                          : storeConfig?.hero_content_alignment === "right"
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    <button
                      className="px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 text-white flex items-center gap-2"
                      style={{
                        backgroundColor: storeConfig?.theme_color || "#FFA726",
                        borderRadius: "6px",
                      }}
                      onClick={() =>
                        document
                          .getElementById("products-section")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Shop Now
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
                </div>
              </div>
            </div>

            {/* Subtle gradient for text readability */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10"></div>
          </div>
        </div>
      )}

      {/* Main content starts here */}
      <div
        className={"pt-0 pb-12 md:py-12 relative" + padHero}
        style={{
          zIndex: 1,
          marginTop: storeConfig?.show_hero ? "0" : "1rem",
          background: storeConfig?.background_color || "#121212",
        }}
      >
        {/* Decorative elements */}
        <div
          className="hidden md:absolute top-0 left-0 w-48 h-48 bg-gradient-to-br opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: storeConfig?.theme_color || "#FFA726" }}
        ></div>
        <div
          className="hidden md:absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl opacity-5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
          style={{ backgroundColor: storeConfig?.theme_color || "#FFA726" }}
        ></div>

        <div className="container mx-auto" id="products-section">
          {/* Popular Products Section */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: storeConfig?.text_color || "#000000" }}
              >
                Our Products
              </h2>
              <Link
                to="/products?sort=popular"
                className="text-sm font-medium hover:underline flex items-center gap-1"
                style={{ color: storeConfig?.theme_color || "#3B82F6" }}
              >
                View all
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {popularProducts?.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {popularProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    store={store}
                    storeConfig={storeConfig}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-gray-500">No products available yet.</p>
              </div>
            )}
          </div>

          {/* View All Products Button */}
          {popularProducts?.length > 4 && (
            <div className="flex justify-center mb-16">
              <Link
                to="/products?sort=popular"
                className="px-8 py-3 rounded-md font-medium transition-all duration-300 hover:bg-opacity-90 text-center inline-block"
                style={{
                  backgroundColor: storeConfig?.theme_color || "#3B82F6",
                  color: "#FFFFFF",
                }}
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
