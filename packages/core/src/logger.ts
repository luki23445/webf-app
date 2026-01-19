import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'info';

/**
 * Create logger instance
 */
export function createLogger(name: string) {
  return pino({
    name,
    level: logLevel,
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  });
}

// Default logger
export const logger = createLogger('webf-app');
