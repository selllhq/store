'use client';

import { Store, StoreConfig } from '@/@types/store';
import { createContext, useContext } from 'react';
import useSWR, { SWRConfig } from 'swr';

export const StoreContext = createContext({});

export const StoreProvider: React.FC<
  React.PropsWithChildren<{
    store?: string;
    children: React.ReactNode;
  }>
> = ({ children, ...props }) => {
  return (
    <StoreContext.Provider
      value={{
        store: props.store || '',
      }}
      {...props}
    >
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(
              `${process.env.NEXT_PUBLIC_API_BASEURL}${resource}`,
              init
            ).then((res) => res.json()),
        }}
      >
        {children}
      </SWRConfig>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const { store } = useContext<{ store?: Store }>(StoreContext);

  return {
    store: store!,
    config: (store?.config ? JSON.parse(store.config) : {}) as StoreConfig,
  };
};
