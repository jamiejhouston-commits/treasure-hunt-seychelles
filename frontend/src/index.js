import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { WalletProvider } from './contexts/WalletContext';
import { NFTProvider } from './contexts/NFTContext';
import './styles/globals.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <WalletProvider>
          <NFTProvider>
            <App />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a1a',
                  color: '#ffffff',
                  border: '1px solid #d4af37',
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif'
                },
                success: {
                  iconTheme: {
                    primary: '#d4af37',
                    secondary: '#1a1a1a',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#dc2626',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </NFTProvider>
        </WalletProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);