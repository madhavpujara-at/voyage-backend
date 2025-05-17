import config from "@/config";
import pinoLoggerFactory from "@/shared/logger/pino-logger";
import { PrismaClient } from "./generated/prisma";

const logger = pinoLoggerFactory.createLogger("PrismaClient");

// Configure Prisma client with logging options based on environment
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: config.nodeEnv === "development" ? ["query", "info", "warn", "error"] : ["warn", "error"],
  });
};

// Create a global type for Prisma to enable singleton pattern
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Define global to store the Prisma instance (avoids multiple instances in development)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Export singleton instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// In development, attach to global to prevent multiple instances from hot-reloading
if (config.nodeEnv === "development") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// For clean shutdown handling
export async function disconnectPrisma(): Promise<void> {
  try {
    logger.info("Disconnecting from database...");
    await prisma.$disconnect();
    logger.info("Disconnected from database");
  } catch (error) {
    logger.error("Failed to disconnect from database", error);
    throw error;
  }
}
