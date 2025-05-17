import pino from 'pino';
import { Logger, LoggerFactory } from './index';

/**
 * Pino implementation of the Logger interface
 */
class PinoLogger implements Logger {
  private logger: pino.Logger;

  constructor(context: string) {
    this.logger = pino({
      name: context,
      transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
      level: process.env.LOG_LEVEL || 'info',
    });
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }
}

/**
 * Factory to create Pino loggers
 */
export class PinoLoggerFactory implements LoggerFactory {
  createLogger(context: string): Logger {
    return new PinoLogger(context);
  }
}

// Default instance for easy import
const pinoLoggerFactory = new PinoLoggerFactory();
export default pinoLoggerFactory; 