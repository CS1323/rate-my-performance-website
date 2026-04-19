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
 * Wrapper around ReactGA.gtag() that automatically includes debug_mode on staging.
 * Direct gtag call bypasses react-ga4's event() method to ensure all parameters
 * (including debug_mode) are preserved and sent to GA4.
 */
export function gaEvent({ action, category, label, value, ...rest }) {
  if (!gaInitialized) {
    console.log('[GA] Skipping event — gaInitialized is false');
    return;
  }
  
  const params = {
    event_category: category,
    event_label: label,
    ...rest,
    ...(value !== undefined && { value }),
    ...(isStaging && { debug_mode: true }),
  };
  
  // Remove undefined values to avoid sending empty fields
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
  
  console.log('[GA] Firing event via gtag:', { action, params });
  
  try {
    // Call gtag() directly to avoid react-ga4's event() filtering
    ReactGA.gtag('event', action, params);
  } catch (err) {
    console.error('[GA] gtag() failed:', err);
  }
}
