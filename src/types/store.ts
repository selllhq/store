export interface Store {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  customDomain?: string;
  currency?: string;
  config?: string | StoreConfig;
  theme?: StoreTheme;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  current_store_id?: number;
}
export interface StoreTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface StoreConfig {
  show_hero: boolean;
  hero_image: string;
  hero_title: string;
  hero_description: string;
  hero_content_alignment: 'center' | 'left' | 'right';
  show_store_name: boolean;
  show_store_logo: boolean;
  show_store_description: boolean;
  show_store_information_in_popup: boolean;
  show_product_price: boolean;
  show_product_description: boolean;
  theme_color: string;
  background_color: string;
  text_color: string;
  border_color: string;
  open_product_in_popup: boolean;
  padded_hero: boolean;
  store_description: string;
  logo: string;
  email: string;
  phone: string;
  instagram: string;
  twitter: string;
}
