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
 * Uses the string-form API so all parameters (including debug_mode) are preserved
 * in the underlying gtag("event", name, params) call.
 */
export function gaEvent({ action, category, label, value, ...rest }) {
  if (!gaInitialized) {
    console.log('[GA] Skipping event — gaInitialized is false');
    return;
  }
  
  const params = {
    ...(category && { event_category: category }),
    ...(label && { event_label: label }),
    ...(value !== undefined && { value }),
    ...rest,
    ...(isStaging && { debug_mode: true }),
  };
  
  console.log('[GA] Firing event:', { action, params });
  
  try {
    ReactGA.event(action, params);
  } catch (err) {
    console.error('[GA] ReactGA.event() failed:', err);
  }
}
