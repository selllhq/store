import { cookies } from 'next/headers';
import { decode } from 'js-base64';

import type { Store, StoreConfig } from '@/@types/store';

const defaultStoreConfig: StoreConfig = {
  theme_color: '#3f87d6',
  background_color: '#ffffff',
  text_color: '#000000',
  border_color: '#e0e0e0',
  open_product_in_popup: true,
  show_hero: false,
  hero_image: '',
  hero_title: '',
  hero_description: '',
  hero_content_alignment: 'center',
  show_hero_button: false,
  show_store_name: true,
  show_store_logo: true,
  show_store_description: true,
  show_store_information_in_popup: true,
  show_product_price: true,
  show_product_description: true,
  show_contact_info: true,
};

export async function getStore(): Promise<Store | null> {
  const storeData = (await cookies()).get('SELLL_STORE')?.value;

  if (!storeData) {
    return null;
  }

  const store: Store = JSON.parse(decode(storeData));
  const storeConfigCookie = (await cookies()).get('SELLL_STORE_CONFIG')?.value;
  let storeConfig = storeConfigCookie
    ? JSON.parse(decode(storeConfigCookie) ?? '{}')
    : {};

  console.log('Store Config:', storeConfig);

  if (!storeConfig?.theme_color) {
    storeConfig = {
      ...defaultStoreConfig,
      ...storeConfig,
    };
  }

  store.config = JSON.stringify(storeConfig);

  return store;
}
