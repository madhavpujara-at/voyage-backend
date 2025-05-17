import { Router } from "express";
import healthRoutes from "./health.routes";
import pinoLoggerFactory from "../../shared/logger/pino-logger";

const logger = pinoLoggerFactory.createLogger("MainRouter");
const router = Router();

// Register all routes here
router.use("/health", healthRoutes);

// As we develop more modules, we'll add their routes here
// Example:
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/teams', teamRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/kudos', kudoRoutes);
// router.use('/analytics', analyticsRoutes);

logger.info("Routes registered");

export default router;
