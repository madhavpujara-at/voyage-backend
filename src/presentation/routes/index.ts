import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "@/modules/auth/presentation/routes/auth.routes";
import usersRoutes from "@/modules/users/presentation/routes/users.routes";
import pinoLoggerFactory from "@/shared/logger/pino-logger";
import { UserPrismaRepository } from "@/modules/auth/infrastructure/repositories/UserPrismaRepository";
import { initializeJwtStrategy } from "@/modules/auth/presentation/middleware/jwtStrategy";
import passport from "passport";
import { createTeamsModule } from "@/modules/teams";
import { createCategoriesModule } from "@/modules/categories";
import prisma from "@/infrastructure/database/prisma-client";

const logger = pinoLoggerFactory.createLogger("MainRouter");
const router = Router();

// Initialize passport
router.use(passport.initialize());

// Initialize repositories and strategies
const userRepository = new UserPrismaRepository();
initializeJwtStrategy(userRepository);

// Register all routes here
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

// Initialize and register Teams module
const teamsModule = createTeamsModule(prisma);
router.use("/teams", teamsModule.router);

// Initialize and register Categories module
const categoriesModule = createCategoriesModule(prisma);
router.use('/categories', categoriesModule.router);

// Other modules to be added later
// router.use('/kudos', kudoRoutes);
// router.use('/analytics', analyticsRoutes);

logger.info("Routes registered");

export default router;
