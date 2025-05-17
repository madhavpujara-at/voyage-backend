"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationError = void 0;
exports.errorHandler = errorHandler;
const pino_logger_1 = __importDefault(require("../../shared/logger/pino-logger"));
const config_1 = __importDefault(require("../../config"));
const logger = pino_logger_1.default.createLogger("ErrorHandler");
/**
 * Base class for application errors
 */
class ApplicationError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApplicationError = ApplicationError;
/**
 * Error handler middleware for Express
 */
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
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
        ...(config_1.default.nodeEnv === "development" && { stack: err.stack }),
    });
}
//# sourceMappingURL=error-handler.js.map