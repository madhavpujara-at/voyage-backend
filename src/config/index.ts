import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

// Define configuration schema using Zod
const configSchema = z.object({
  // Server
  port: z.string().default("3000"),
  nodeEnv: z.enum(["development", "test", "production"]).default("development"),

  // Database
  databaseUrl: z.string(),

  // Authentication
  jwtSecret: z.string(),

  // Logging
  logLevel: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

// Extract environment variables
const envVars = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  logLevel: process.env.LOG_LEVEL,
};

// Parse and validate configuration
const getConfig = () => {
  try {
    return configSchema.parse(envVars);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Configuration validation failed:", error.format());
      throw new Error("Invalid configuration. See logs for details.");
    }
    throw error;
  }
};

const config = getConfig();

export default config;
