"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectPrisma = disconnectPrisma;
const config_1 = __importDefault(require("@/config"));
const pino_logger_1 = __importDefault(require("@/shared/logger/pino-logger"));
const prisma_1 = require("./generated/prisma");
const logger = pino_logger_1.default.createLogger("PrismaClient");
// Configure Prisma client with logging options based on environment
const prismaClientSingleton = () => {
    return new prisma_1.PrismaClient({
        log: config_1.default.nodeEnv === "development" ? ["query", "info", "warn", "error"] : ["warn", "error"],
    });
};
// Define global to store the Prisma instance (avoids multiple instances in development)
const globalForPrisma = globalThis;
// Export singleton instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
// In development, attach to global to prevent multiple instances from hot-reloading
if (config_1.default.nodeEnv === "development") {
    globalForPrisma.prisma = prisma;
}
exports.default = prisma;
// For clean shutdown handling
async function disconnectPrisma() {
    try {
        logger.info("Disconnecting from database...");
        await prisma.$disconnect();
        logger.info("Disconnected from database");
    }
    catch (error) {
        logger.error("Failed to disconnect from database", error);
        throw error;
    }
}
//# sourceMappingURL=prisma-client.js.map