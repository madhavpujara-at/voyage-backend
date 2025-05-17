"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load environment variables from .env file
dotenv_1.default.config();
// Define configuration schema using Zod
const configSchema = zod_1.z.object({
    // Server
    port: zod_1.z.string().default("3000"),
    nodeEnv: zod_1.z.enum(["development", "test", "production"]).default("development"),
    // Database
    databaseUrl: zod_1.z.string(),
    // Authentication
    jwtSecret: zod_1.z.string(),
    // Logging
    logLevel: zod_1.z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error("Configuration validation failed:", error.format());
            throw new Error("Invalid configuration. See logs for details.");
        }
        throw error;
    }
};
const config = getConfig();
exports.default = config;
//# sourceMappingURL=index.js.map