import useSWR from 'swr';

import type { Store } from '@/@types/store';
import type { BagItem, CheckoutCustomer, CheckoutResponse, Order } from '@/@types/order';

export function useOrder(id: Store['id'], orderId: string) {
  const { data, error, isLoading } = useSWR(`/stores/${id}/orders/${orderId}`);

  return {
    order: data as Order | undefined,
    isLoading,
    isError: error,
  };
}

export const checkoutBag = async (data: {
  store: Store;
  items: BagItem[];
  customer: CheckoutCustomer;
}): Promise<CheckoutResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASEURL}/stores/${data.store.id}/checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        store_url: window.location.origin,
        store_name: data.store.name,
        redirect_url: window.location.origin,
        cart: data.items.map((item) => ({
          id: item.product.id,
          quantity: Number(item.quantity),
        })),
        customer: data.customer,
      }),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to checkout');
  }

  return await res.json();
};
