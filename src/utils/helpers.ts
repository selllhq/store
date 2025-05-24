import { StoreConfig } from "../types/store";

interface StoreColors {
  background_color: string;
  text_color: string;
  theme_color: string;
  border_color: string;
  store_description?: string;
  logo?: string;
  hero_image?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  twitter?: string;
}

const DEFAULT_COLORS: StoreColors = {
  background_color: "#FFFFFF", // White background
  text_color: "#000000", // Black text
  theme_color: "#3B82F6", // Blue theme color
  border_color: "#E5E7EB", // Light gray border
};

const DEFAULT_STORE_CONFIG: StoreConfig = {
  show_hero: true,
  hero_image: "",
  hero_title: "",
  hero_description: "",
  hero_content_alignment: "center",
  show_store_name: true,
  show_store_logo: true,
  show_store_description: true,
  show_store_information_in_popup: true,
  show_product_price: true,
  show_product_description: true,
  theme_color: "#3B82F6",
  background_color: "#FFFFFF",
  text_color: "#000000",
  border_color: "#E5E7EB",
  open_product_in_popup: true,
  padded_hero: false,
  store_description: "",
  logo: "",
  email: "",
  phone: "",
  instagram: "",
  twitter: "",
};

/**
 * Extracts color configuration from store config string
 * @param config - The store config string to parse
 * @returns StoreColors object with color values
 */
export const extractStoreColors = (config: string | null | undefined): StoreColors => {
  if (!config) {
    return DEFAULT_COLORS;
  }

  try {
    const parsedConfig = JSON.parse(config);
    
    // If config is empty or doesn't have any colors, return defaults
    if (!parsedConfig || Object.keys(parsedConfig).length === 0) {
      return DEFAULT_COLORS;
    }

    // Return parsed colors with defaults for any missing values
    return {
      background_color: parsedConfig.background_color || DEFAULT_COLORS.background_color,
      text_color: parsedConfig.text_color || DEFAULT_COLORS.text_color,
      theme_color: parsedConfig.theme_color || DEFAULT_COLORS.theme_color,
      border_color: parsedConfig.border_color || DEFAULT_COLORS.border_color,
      store_description: parsedConfig.store_description,
      logo: parsedConfig.logo,
      hero_image: parsedConfig.hero_image,
      email: parsedConfig.email,
      phone: parsedConfig.phone,
      instagram: parsedConfig.instagram,
      twitter: parsedConfig.twitter,
    };
  } catch (error) {
    console.warn('Failed to parse store config:', error);
    return DEFAULT_COLORS;
  }
};

/**
 * Extracts and converts store configuration from store config string
 * @param config - The store config string to parse
 * @returns StoreConfig object with all store settings
 */
export const extractStoreConfig = (config: string | null | undefined): StoreConfig => {
  if (!config) {
    return DEFAULT_STORE_CONFIG;
  }

  try {
    const parsedConfig = JSON.parse(config);
    
    // If config is empty, return defaults
    if (!parsedConfig || Object.keys(parsedConfig).length === 0) {
      return DEFAULT_STORE_CONFIG;
    }

    // Return parsed config with defaults for any missing values
    return {
      show_hero: parsedConfig.show_hero ?? DEFAULT_STORE_CONFIG.show_hero,
      hero_image: parsedConfig.hero_image || DEFAULT_STORE_CONFIG.hero_image,
      hero_title: parsedConfig.hero_title || DEFAULT_STORE_CONFIG.hero_title,
      hero_description: parsedConfig.hero_description || DEFAULT_STORE_CONFIG.hero_description,
      hero_content_alignment: parsedConfig.hero_content_alignment || DEFAULT_STORE_CONFIG.hero_content_alignment,
      show_store_name: parsedConfig.show_store_name ?? DEFAULT_STORE_CONFIG.show_store_name,
      show_store_logo: parsedConfig.show_store_logo ?? DEFAULT_STORE_CONFIG.show_store_logo,
      show_store_description: parsedConfig.show_store_description ?? DEFAULT_STORE_CONFIG.show_store_description,
      show_store_information_in_popup: parsedConfig.show_store_information_in_popup ?? DEFAULT_STORE_CONFIG.show_store_information_in_popup,
      show_product_price: parsedConfig.show_product_price ?? DEFAULT_STORE_CONFIG.show_product_price,
      show_product_description: parsedConfig.show_product_description ?? DEFAULT_STORE_CONFIG.show_product_description,
      theme_color: parsedConfig.theme_color || DEFAULT_STORE_CONFIG.theme_color,
      background_color: parsedConfig.background_color || DEFAULT_STORE_CONFIG.background_color,
      text_color: parsedConfig.text_color || DEFAULT_STORE_CONFIG.text_color,
      border_color: parsedConfig.border_color || DEFAULT_STORE_CONFIG.border_color,
      open_product_in_popup: parsedConfig.open_product_in_popup ?? DEFAULT_STORE_CONFIG.open_product_in_popup,
      padded_hero: parsedConfig.padded_hero ?? DEFAULT_STORE_CONFIG.padded_hero,
      store_description: parsedConfig.store_description ?? DEFAULT_STORE_CONFIG.store_description,
      logo: parsedConfig.logo ?? DEFAULT_STORE_CONFIG.logo,
      email: parsedConfig.email ?? DEFAULT_STORE_CONFIG.email,
      phone: parsedConfig.phone ?? DEFAULT_STORE_CONFIG.phone,
      instagram: parsedConfig.instagram ?? DEFAULT_STORE_CONFIG.instagram,
      twitter: parsedConfig.twitter ?? DEFAULT_STORE_CONFIG.twitter,
    };
  } catch (error) {
    console.warn('Failed to parse store config:', error);
    return DEFAULT_STORE_CONFIG;
  }
};

export const adjustColorBrightness = (hex: string, percent: number): string => {
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
  
