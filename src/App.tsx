import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext } from 'react';
import StoreLayout from './components/StoreLayout';
import HomePage from './pages/HomePage';
import OrderConfirmation from './pages/OrderConfirmation';

// Create a context for store configuration
export const StoreConfigContext = createContext<any>(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  // Extract store name from subdomain
  const hostname = window.location.hostname;
  const storeName = hostname.split('.')[0];
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (!storeName && !isLocalhost) {
    window.location.href = 'https://selll.online';
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={
            <StoreLayout storeName={isLocalhost ? 'demo-store' : storeName}>
              <Routes>
                <Route index element={<HomePage storeId={isLocalhost ? 'demo-store' : storeName} />} />
                <Route path="order" element={<OrderConfirmation />} />
                <Route path="*" element={<Navigate to="." replace />} />
              </Routes>
            </StoreLayout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
