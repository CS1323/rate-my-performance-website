// GA initialization flag — shared between main.jsx (init) and App.jsx (pageview tracking).
// Extracted to avoid circular imports that would trigger main.jsx side effects in tests.
const isDeployed = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

export const gaInitialized = !!(import.meta.env.VITE_GA_ID && isDeployed);
