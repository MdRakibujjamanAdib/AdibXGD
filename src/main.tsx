import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { NavbarProvider } from './context/NavbarContext.tsx';

const rootElement = document.getElementById('root')!;

const appWithProviders = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <NavbarProvider>
          <App />
        </NavbarProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appWithProviders);
} else {
  createRoot(rootElement).render(appWithProviders);
}
