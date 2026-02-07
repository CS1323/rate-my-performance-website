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
 *     - All (dev):    "*" or empty string
 */
export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) 
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
