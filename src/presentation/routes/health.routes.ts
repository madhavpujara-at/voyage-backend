import { Router, Request, Response } from "express";
import pinoLoggerFactory from "../../shared/logger/pino-logger";

const router = Router();
const logger = pinoLoggerFactory.createLogger("HealthRoutes");

/**
 * @openapi
 * tags:
 *   name: Health
 *   description: API health check status.
 */

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Check API Health
 *     description: Returns the current operational status of the API.
 *     responses:
 *       '200':
 *         description: API is healthy and running.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Digital Kudos Wall API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '503':
 *         description: Service Unavailable. The API is not healthy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse' # Was ErrorResponse
 */
router.get("/", (req: Request, res: Response) => {
  logger.debug("Health check request received");
  // In a real scenario, you might check database connections or other critical services here
  res.status(200).json({
    status: "success",
    message: "Digital Kudos Wall API is running", // You might want to make this more generic if it's for Voyage API
    timestamp: new Date().toISOString(),
  });
});

export default router;
