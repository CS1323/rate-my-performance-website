import ReactGA from 'react-ga4';

// Determine staging status (shared across app)
const isDeployed = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
export const isStaging = typeof window !== 'undefined' && window.location.hostname.startsWith('staging.');
export const gaInitialized = !!(import.meta.env.VITE_GA_ID && isDeployed);

/**
 * Wrapper around ReactGA.send() that automatically includes debug_mode on staging.
 * On production, behaves like normal ReactGA.send().
 */
export function gaSend(fieldsObject) {
  if (!gaInitialized) return;
  const payload = {
    ...fieldsObject,
    ...(isStaging && { debug_mode: true }),
  };
  ReactGA.send(payload);
}

/**
 * Wrapper around ReactGA.event() that automatically includes debug_mode on staging.
 * On production, behaves like normal ReactGA.event().
 */
export function gaEvent(fieldsObject) {
  if (!gaInitialized) return;
  const payload = {
    ...fieldsObject,
    ...(isStaging && { debug_mode: true }),
  };
  ReactGA.event(payload);
}
