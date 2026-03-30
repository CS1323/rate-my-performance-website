import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import * as Sentry from "@sentry/react";
import ReactGA from 'react-ga4';
import { AdsProvider } from './context/AdsContext'
import App from './App.jsx'
import './index.css'

// Initialize Sentry for frontend error tracking
const isDev = import.meta.env.MODE === 'development';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  
  // Transaction and tracing configuration
  tracesSampleRate: isDev ? 1.0 : 0.1, // 100% in dev, 10% in production
  
  // beforeSend hook to log captures in development
  beforeSend(event, hint) {
    if (isDev && event.level === 'error') {
      console.log('[Sentry] Frontend error captured:', {
        message: event.message,
        level: event.level,
        tags: event.tags,
      });
    }
    return event;
  },
});

// Initialize Google Analytics with date-based gating
const gaLaunchDate = import.meta.env.VITE_GA_LAUNCH_DATE 
  ? new Date(import.meta.env.VITE_GA_LAUNCH_DATE) 
  : null;

const isGAEnabled = gaLaunchDate && new Date() >= gaLaunchDate;

if (isGAEnabled && import.meta.env.VITE_GA_ID) {
  ReactGA.initialize(import.meta.env.VITE_GA_ID);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdsProvider>
        <App />
      </AdsProvider>
    </BrowserRouter>
  </StrictMode>,
)
