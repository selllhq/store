import { headers } from "next/headers";

import type { Store } from "@/@types/store";

export async function getStore(): Promise<Store | null> {
  const storeData = (await headers()).get('SELLL_STORE');

  if (!storeData) {
    return null;
  }

  const store: Store = JSON.parse(storeData);
  store.config = (await headers()).get('SELLL_STORE_CONFIG') || '{}';

  return store;
}
