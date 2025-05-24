// import { createContext, useContext } from "react";
// import { StoreConfigContextType } from "../contexts";

// export const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

// export const useStoreConfig = (): StoreConfigContextType => {
//     const context = useContext(StoreConfigContext);
//     if (context === undefined) {
//         throw new Error('useStoreConfig must be used within a StoreConfigProvider');
//     }
//     return context;
// }