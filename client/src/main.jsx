import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import * as Sentry from "@sentry/react";
import { AdsProvider } from './context/AdsContext'
import App from './App.jsx'
import './index.css'

// Initialize Sentry for frontend error tracking
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdsProvider>
        <App />
      </AdsProvider>
    </BrowserRouter>
  </StrictMode>,
)
