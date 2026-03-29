import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine if we're in development or production
const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'rate-my-performance-api' },
  transports: [
    // Console transport with colored output for development
    new winston.transports.Console({
      format: isDevelopment
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, stack }) => {
              const stackTrace = stack ? `\n${stack}` : '';
              return `${timestamp} [${level}]: ${message}${stackTrace}`;
            })
          )
        : winston.format.json() // Production console logs as JSON
    }),
    // Error log file (errors only)
    new winston.transports.File({
      filename: join(__dirname, '../../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Combined log file (all levels)
    new winston.transports.File({
      filename: join(__dirname, '../../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

export default logger;
