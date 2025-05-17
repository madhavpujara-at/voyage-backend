"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pino_logger_1 = __importDefault(require("../../shared/logger/pino-logger"));
const router = (0, express_1.Router)();
const logger = pino_logger_1.default.createLogger("HealthRoutes");
/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 */
router.get("/", (req, res) => {
    logger.debug("Health check request received");
    res.status(200).json({
        status: "success",
        message: "Digital Kudos Wall API is running",
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=health.routes.js.map