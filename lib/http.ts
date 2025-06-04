import { cookies } from "next/headers";
import { decode } from "js-base64";

import type { Store } from "@/@types/store";

export async function getStore(): Promise<Store | null> {
  const storeData = (await cookies()).get('SELLL_STORE')?.value;

  if (!storeData) {
    return null;
  }

  const store: Store = JSON.parse(decode(storeData));
  store.config = decode((await cookies()).get('SELLL_STORE_CONFIG')?.value ?? '') || '{}';

  return store;
}
