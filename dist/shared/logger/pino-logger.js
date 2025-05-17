"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinoLoggerFactory = void 0;
const pino_1 = __importDefault(require("pino"));
/**
 * Pino implementation of the Logger interface
 */
class PinoLogger {
    constructor(context) {
        this.logger = (0, pino_1.default)({
            name: context,
            transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
            level: process.env.LOG_LEVEL || 'info',
        });
    }
    debug(message, ...args) {
        this.logger.debug(message, ...args);
    }
    info(message, ...args) {
        this.logger.info(message, ...args);
    }
    warn(message, ...args) {
        this.logger.warn(message, ...args);
    }
    error(message, ...args) {
        this.logger.error(message, ...args);
    }
}
/**
 * Factory to create Pino loggers
 */
class PinoLoggerFactory {
    createLogger(context) {
        return new PinoLogger(context);
    }
}
exports.PinoLoggerFactory = PinoLoggerFactory;
// Default instance for easy import
const pinoLoggerFactory = new PinoLoggerFactory();
exports.default = pinoLoggerFactory;
//# sourceMappingURL=pino-logger.js.map