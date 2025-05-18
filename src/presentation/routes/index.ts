import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "../../modules/auth/presentation/routes/auth.routes";
import pinoLoggerFactory from "../../shared/logger/pino-logger";
import { UserPrismaRepository } from "../../modules/auth/infrastructure/repositories/UserPrismaRepository";
import { InMemoryTokenBlacklistService } from "../../modules/auth/infrastructure/services/InMemoryTokenBlacklistService";
import { initializeJwtStrategy } from "../../modules/auth/presentation/middleware/jwtStrategy";
import passport from "passport";
import { createTeamsModule } from "../../modules/teams";
import { createCategoriesModule } from "../../modules/categories";
import { createKudoCardsModule } from "../../modules/kudoCards";
import prisma from "../../infrastructure/database/prisma-client";
import { createUsersModule } from "../../modules/users";
import { createAnalyticsModule } from "../../modules/analytics";

const logger = pinoLoggerFactory.createLogger("MainRouter");
const router = Router();

// Initialize passport
router.use(passport.initialize());

// Initialize repositories and strategies
const userRepository = new UserPrismaRepository();
const tokenBlacklistService = new InMemoryTokenBlacklistService();
initializeJwtStrategy(userRepository, tokenBlacklistService);

// Register all routes here
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

// Initialize and register Users module with the new factory
const usersModule = createUsersModule(prisma);
router.use("/users", usersModule.router);

// Initialize and register Teams module
const teamsModule = createTeamsModule(prisma);
router.use("/teams", teamsModule.router);

// Initialize and register Categories module
const categoriesModule = createCategoriesModule(prisma);
router.use("/categories", categoriesModule.router);

// Initialize and register KudoCards module
const kudoCardsModule = createKudoCardsModule(prisma);
router.use("/kudoCards", kudoCardsModule.router);

// Initialize and register Analytics module
const analyticsModule = createAnalyticsModule();
router.use("/analytics", analyticsModule.router);

logger.info("Routes registered");

export default router;
