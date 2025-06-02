'use client';

import { SWRConfig } from 'swr';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import type { BagItem } from '@/@types/order';
import type { Product } from '@/@types/product';

export const BagContext = createContext({});

export const BagProvider: React.FC<
  React.PropsWithChildren<{
    children: React.ReactNode;
  }>
> = ({ children, ...props }) => {
  const hasSetBag = useRef(false);
  const [items, setItems] = useState<BagItem[]>([]);

  const addToBag = (item: BagItem) => {
    hasSetBag.current = false;

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.product.id === item.product.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];

        if (!hasSetBag.current) {
          updatedItems[existingItemIndex].quantity += item.quantity;
          hasSetBag.current = true;
        }

        return updatedItems;
      }

      return [...prevItems, item];
    });
  };

  const updateBagItem = (productId: Product['id'], quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeFromBag = (productId: Product['id']) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  return (
    <BagContext.Provider
      value={{
        items,
        setItems,
        addToBag,
        updateBagItem,
        removeFromBag,
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
    </BagContext.Provider>
  );
};

export const useBag = () => {
  const context = useContext<{
    items: BagItem[];
    setItems: React.Dispatch<React.SetStateAction<BagItem[]>>;
    addToBag: (item: BagItem) => void;
    updateBagItem: (productId: Product['id'], quantity: number) => void;
    removeFromBag: (productId: Product['id']) => void;
  }>(BagContext as any);

  return context;
};
