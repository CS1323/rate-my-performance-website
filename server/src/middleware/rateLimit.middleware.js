import rateLimit from 'express-rate-limit';

// General rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  statusCode: 429,
  skip: (req) => process.env.NODE_ENV === 'development' // Skip rate limiting in development
});

// Strict limiter: 10 requests per minute per IP for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests to this endpoint, please try again after 1 minute.',
  statusCode: 429,
  skip: (req) => process.env.NODE_ENV === 'development' // Skip rate limiting in development
});

export { limiter, strictLimiter };
