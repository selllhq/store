'use client';

import { Store, StoreConfig } from '@/@types/store';
import { createContext, useContext } from 'react';

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
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const { store } = useContext<{ store?: Store }>(StoreContext);

  return {
    store,
    config: (store?.config ? JSON.parse(store.config) : {}) as StoreConfig,
  };
};
