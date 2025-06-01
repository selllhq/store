import useSWR from "swr";
import { Store } from "@/@types/store";
import { Product } from "@/@types/product";

export function useProducts(id: Store["id"]) {
  const { data, error, isLoading } = useSWR(`/stores/${id}/products`);

  return {
    products: data as Product[] | undefined,
    isLoading,
    isError: error,
  };
}
