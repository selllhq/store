import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StoreLayout from './components/StoreLayout';
import HomePage from './pages/HomePage';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductsPage from './pages/ProductsPage';
import { StoreConfigProvider } from './contexts/StoreConfigContext';
import { CartProvider } from './contexts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const hostname = window.location.hostname;
  const storeName = hostname.split('.')[0];
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (!storeName && !isLocalhost) {
    window.location.href = 'https://selll.online';
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StoreConfigProvider storeName={storeName}>
        <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={
              <StoreLayout storeName={isLocalhost ? 'demo-store' : storeName}>
                {() => (
                  <Routes>
                    <Route index element={<HomePage  />} />
                    <Route path="/products" element={<ProductsPage/>} />
                    <Route path="/product/:productId" element={<ProductsPage isProductDetail={true} />} />
                    <Route path="/order" element={<OrderConfirmation />} />
                    <Route path="*" element={<Navigate to="." replace />} />
                  </Routes>
                )}
              </StoreLayout>
            } />
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </StoreConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
