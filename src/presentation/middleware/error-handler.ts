import { Request, Response, NextFunction } from "express";
import pinoLoggerFactory from "../../shared/logger/pino-logger";
import config from "../../config";

const logger = pinoLoggerFactory.createLogger("ErrorHandler");

/**
 * Base class for application errors
 */
export class ApplicationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware for Express
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  const statusCode = err instanceof ApplicationError ? err.statusCode : 500;

  // Log error details
  logger.error(`Error: ${err.message}`, {
    statusCode,
    path: req.path,
    method: req.method,
    ...(err.stack && { stack: err.stack }),
  });

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  });
}
