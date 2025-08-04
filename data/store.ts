import useSWR from 'swr';
import { UserLocation } from '@/@types/store';

export function useLocation() {
  const { data, error, isLoading } = useSWR("/locator");

  return {
    location: data as UserLocation,
    isLoading,
    isError: error,
  };
}
