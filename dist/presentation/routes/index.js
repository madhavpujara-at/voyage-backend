"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_routes_1 = __importDefault(require("./health.routes"));
const auth_routes_1 = __importDefault(require("@/modules/auth/presentation/routes/auth.routes"));
const users_routes_1 = __importDefault(require("@/modules/users/presentation/routes/users.routes"));
const pino_logger_1 = __importDefault(require("@/shared/logger/pino-logger"));
const UserPrismaRepository_1 = require("@/modules/auth/infrastructure/repositories/UserPrismaRepository");
const jwtStrategy_1 = require("@/modules/auth/presentation/middleware/jwtStrategy");
const passport_1 = __importDefault(require("passport"));
const logger = pino_logger_1.default.createLogger("MainRouter");
const router = (0, express_1.Router)();
// Initialize passport
router.use(passport_1.default.initialize());
// Initialize JWT strategy
const userRepository = new UserPrismaRepository_1.UserPrismaRepository();
(0, jwtStrategy_1.initializeJwtStrategy)(userRepository);
// Register all routes here
router.use("/health", health_routes_1.default);
router.use("/auth", auth_routes_1.default);
router.use("/users", users_routes_1.default);
// As we develop more modules, we'll add their routes here
// Example:
// router.use('/teams', teamRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/kudos', kudoRoutes);
// router.use('/analytics', analyticsRoutes);
logger.info("Routes registered");
exports.default = router;
//# sourceMappingURL=index.js.map