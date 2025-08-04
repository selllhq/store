export interface Store {
  id: number;
  user_id: number;
  name: string;
  description: string;
  slug: string;
  logo?: string;
  currency: string;
  status: 'live' | 'sandbox';
  email: string;
  phone: string;
  address: string;
  product_types: string;
  config: string;
  created_at: string;
  updated_at: string;
  country: string;
  owner?: StoreOwner;
}

export interface StoreConfig {
  theme_color: string;
  background_color: string;
  text_color: string;
  border_color: string;
  open_product_in_popup: boolean;
  show_hero: boolean;
  hero_image: string;
  hero_title: string;
  hero_description: string;
  hero_content_alignment: 'left' | 'center' | 'right';
  show_hero_button: boolean;
  show_store_name: boolean;
  show_store_logo: boolean;
  show_store_description: boolean;
  show_store_information_in_popup: boolean;
  show_hero_search: boolean;
  show_product_price: boolean;
  show_product_description: boolean;
  show_contact_info: boolean;
  two_cards_on_mobile: boolean;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  [key: string]: any;
}

export interface StoreOwner {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  current_store_id: number;
  created_at: string;
  updated_at: string;
}

export interface StoreCustomer {
  id: number;
  store_id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserLocation {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  currency: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  ip: string;
  continent: string;
  continentCode: string;
  status: string;
  query: string;
}
