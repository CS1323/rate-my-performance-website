// Sentry initialization
// IMPORTANT: This file must be imported at the very top of server.js before any other imports
// Load environment variables FIRST before initializing Sentry
import { config } from "dotenv";
config(); // Load .env file immediately

import * as Sentry from "@sentry/node";

const isDev = process.env.NODE_ENV !== 'production';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  
  // Transaction and tracing configuration
  tracesSampleRate: isDev ? 1.0 : 0.1, // 100% in dev, 10% in production
  
  // Error filtering to reduce noise
  ignoreErrors: [
    'ResizeObserver loop limit exceeded', // Browser resize observer errors (benign)
    '404', // 404 errors are often noise
  ],
  
  // Attach additional debug info
  attachStacktrace: true,
  maxBreadcrumbs: 50, // Keep more breadcrumbs for context
  
  // beforeSend hook: Final filter before sending to Sentry
  beforeSend(event, hint) {
    // Log to console in development so you see what's being sent
    if (isDev && event.level === 'error') {
      console.log('[Sentry] Captured error:', {
        message: event.message,
        level: event.level,
        tags: event.tags,
        contexts: event.contexts,
      });
      console.log('[Sentry] Sending to:', process.env.SENTRY_DSN ? 'Sentry DSN configured' : 'NO DSN SET');
    }
    return event; // Send the event to Sentry
  },
});

// Verify Sentry initialized
if (process.env.SENTRY_DSN) {
  console.log('[Sentry] ✅ Initialized with DSN');
} else {
  console.log('[Sentry] ⚠️ NO DSN provided - error tracking disabled');
}
