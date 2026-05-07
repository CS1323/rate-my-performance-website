import cors from 'cors';

/**
 * CORS Middleware Configuration
 * 
 * Allows frontend(s) on different domain(s) to make requests to this backend.
 * 
 * Environment Variable:
 *   CORS_ORIGIN - Comma-separated list of allowed origins
 *     Examples:
 *     - Development:  "http://localhost:5173"
 *     - Staging:      "https://staging.yourdomain.com,https://staging-abc123.vercel.app"
 *     - Production:   "https://yourdomain.com"
 *     - Multiple:     "http://localhost:5173,https://staging.yourdomain.com,https://yourdomain.com"
 */
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)
  .filter(o => o !== '*');

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
