import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { NavbarProvider } from './context/NavbarContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NavbarProvider>
        <App />
      </NavbarProvider>
    </BrowserRouter>
  </StrictMode>,
);
