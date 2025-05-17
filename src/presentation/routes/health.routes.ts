import { Router, Request, Response } from "express";
import pinoLoggerFactory from "../../shared/logger/pino-logger";

const router = Router();
const logger = pinoLoggerFactory.createLogger("HealthRoutes");

/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 */
router.get("/", (req: Request, res: Response) => {
  logger.debug("Health check request received");
  res.status(200).json({
    status: "success",
    message: "Digital Kudos Wall API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
