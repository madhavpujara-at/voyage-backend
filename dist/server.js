"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pino_logger_1 = __importDefault(require("./shared/logger/pino-logger"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./presentation/routes"));
const error_handler_1 = require("./presentation/middleware/error-handler");
const prisma_client_1 = require("./infrastructure/database/prisma-client");
// Create logger instance
const logger = pino_logger_1.default.createLogger("Server");
// Initialize Express app
const app = (0, express_1.default)();
// Apply middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API routes
app.use("/api", routes_1.default);
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});
// Global error handler
app.use(error_handler_1.errorHandler);
// Start server
const server = app.listen(config_1.default.port, () => {
    logger.info(`Server running in ${config_1.default.nodeEnv} mode on port ${config_1.default.port}`);
});
// Handle server shutdown gracefully
const shutdownGracefully = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        logger.info("HTTP server closed");
        // Disconnect from database
        try {
            await (0, prisma_client_1.disconnectPrisma)();
        }
        catch (error) {
            logger.error("Error during shutdown", error);
            process.exit(1);
        }
        logger.info("Graceful shutdown completed");
        process.exit(0);
    });
    // Force close if graceful shutdown takes too long
    setTimeout(() => {
        logger.error("Shutdown timed out, forcing exit");
        process.exit(1);
    }, 10000);
};
// Increase the maximum number of listeners for the process object
process.setMaxListeners(20);
// Listen for termination signals
process.on("SIGTERM", () => shutdownGracefully("SIGTERM"));
process.on("SIGINT", () => shutdownGracefully("SIGINT"));
exports.default = server;
//# sourceMappingURL=server.js.map