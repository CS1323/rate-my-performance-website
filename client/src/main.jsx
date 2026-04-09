import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import * as Sentry from "@sentry/react";
import ReactGA from 'react-ga4';
import { AdsProvider } from './context/AdsContext'
import App from './App.jsx'
import './i18n'
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

// Only initialize GA on deployed environments — never on localhost.
// This prevents test traffic from polluting analytics even if VITE_GA_ID is set locally.
const isDeployed = window.location.hostname !== 'localhost';

if (isGAEnabled && import.meta.env.VITE_GA_ID && isDeployed) {
  // Route GA script and collect beacons through the same origin as the page
  // via Vercel Edge Middleware (client/middleware.js). This ensures:
  //   - No cross-subdomain cookie domain mismatch.
  //   - Requests appear first-party to the browser, bypassing adblockers.
  ReactGA.initialize(import.meta.env.VITE_GA_ID, {
    gtagUrl: `${window.location.origin}/api/ga/p.js`,
    gaOptions: {
      transport_url: window.location.origin,
      cookie_domain: window.location.hostname,
      cookie_flags: 'SameSite=Lax;Secure',
      send_page_view: false,
    },
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
      <BrowserRouter>
        <AdsProvider>
          <App />
        </AdsProvider>
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
)
