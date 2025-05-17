import express, { Application } from "express";
import cors from "cors";
import pinoLoggerFactory from "./shared/logger/pino-logger";
import config from "./config";
import router from "./presentation/routes";
import { errorHandler } from "./presentation/middleware/error-handler";
import { disconnectPrisma } from "./infrastructure/database/prisma-client";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./config/swaggerOptions";

// Create logger instance
const logger = pinoLoggerFactory.createLogger("Server");

// Initialize Express app
const app: Application = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Swagger setup
if (config.nodeEnv !== "production") {
  const specs = swaggerJsdoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
  logger.info(`API docs available at /api-docs`);
}

// API routes
app.use("/api", router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});

// Handle server shutdown gracefully
const shutdownGracefully = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    logger.info("HTTP server closed");

    // Disconnect from database
    try {
      await disconnectPrisma();
    } catch (error) {
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

export default server;
