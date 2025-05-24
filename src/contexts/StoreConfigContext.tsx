import { createContext, useContext, useEffect, useReducer} from 'react';
import { Store } from '../types/store';
import { useQuery } from '@tanstack/react-query';
import { getStore } from '../services/api';
import { extractStoreConfig } from '../utils/helpers';

type StoreConfigAction = 
| { type: 'SET_CONFIG'; payload: Partial<Store> }
| { type: 'RESET_CONFIG' }

export interface StoreConfigContextType {
    store: Store;
    setConfig: (config: Partial<Store>) => void;
    resetConfig: () => void;
    isLoading: boolean;
    error: Error | null;
}

const defaultStoreConfig: Store = {
    id: "",
    name: "",
    description: "",
}

const storeConfigReducer = (state: Store, action: StoreConfigAction): Store => {
    switch (action.type) {
        case 'SET_CONFIG':
            return { ...state, ...action.payload };
        case 'RESET_CONFIG':
            return defaultStoreConfig;
        default:
            return state;
    }
}

export const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

export function StoreConfigProvider({ children, storeName }: { children: React.ReactNode, storeName: string  }) {
    const [state, dispatch] = useReducer(storeConfigReducer, defaultStoreConfig);

    const setConfig = (config: Partial<Store>) => {
        dispatch({ type: 'SET_CONFIG', payload: config });
    }
    const resetConfig = () => {
        dispatch({ type: 'RESET_CONFIG' });
    }

    const {
        data: store,
        isLoading,
        error,
      } = useQuery<Store>({
        queryKey: ["store", storeName],
        queryFn: () => getStore(storeName),
        enabled: !!storeName,
      });

    useEffect(() => {
        if (!store) return;
        const config = extractStoreConfig(store.config as string);
        console.log('config', config);
        setConfig({
            ...store,
            config: config,
        });
        
    }, [store]);

    const value = {
        store: state,
        setConfig,
        resetConfig,
        isLoading,
        error,
    }

    return (
        <StoreConfigContext.Provider value={value}>
            {children}
        </StoreConfigContext.Provider>
    )
}

export const useStoreConfig = () => {
    const context = useContext(StoreConfigContext);
    if (!context) {
        throw new Error('useStoreConfig must be used within a StoreConfigProvider');
    }
    return context;
}