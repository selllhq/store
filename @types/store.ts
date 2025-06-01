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
    show_hero: boolean;
    hero_image: string;
    hero_title: string;
    hero_description: string;
    hero_content_alignment: 'left' | 'center' | 'right';
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
