import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "@/modules/auth/presentation/routes/auth.routes";
import usersRoutes from "@/modules/users/presentation/routes/users.routes";
import pinoLoggerFactory from "@/shared/logger/pino-logger";
import { UserPrismaRepository } from "@/modules/auth/infrastructure/repositories/UserPrismaRepository";
import { initializeJwtStrategy } from "@/modules/auth/presentation/middleware/jwtStrategy";
import passport from "passport";

const logger = pinoLoggerFactory.createLogger("MainRouter");
const router = Router();

// Initialize passport
router.use(passport.initialize());

// Initialize JWT strategy
const userRepository = new UserPrismaRepository();
initializeJwtStrategy(userRepository);

// Register all routes here
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

// As we develop more modules, we'll add their routes here
// Example:
// router.use('/teams', teamRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/kudos', kudoRoutes);
// router.use('/analytics', analyticsRoutes);

logger.info("Routes registered");

export default router;
