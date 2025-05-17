"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const pino_logger_1 = __importDefault(require("../../../../shared/logger/pino-logger"));
const logger = pino_logger_1.default.createLogger("AuthController");
class AuthController {
    constructor(registerUserUseCase, loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        /**
         * Register a new user
         */
        this.register = async (req, res, next) => {
            try {
                const result = await this.registerUserUseCase.execute(req.body);
                return res.status(201).json({
                    status: "success",
                    data: result,
                });
            }
            catch (error) {
                // Handle known error types
                if (error instanceof Error && error.message === "User with this email already exists") {
                    return res.status(409).json({
                        status: "error",
                        message: error.message,
                    });
                }
                logger.error("Error registering user", error);
                next(error);
            }
        };
        /**
         * Login a user and return JWT token
         */
        this.login = async (req, res, next) => {
            try {
                const result = await this.loginUserUseCase.execute(req.body);
                return res.status(200).json({
                    status: "success",
                    data: result,
                });
            }
            catch (error) {
                // Handle known error types
                if (error instanceof Error && error.message === "Invalid email or password") {
                    return res.status(401).json({
                        status: "error",
                        message: error.message,
                    });
                }
                logger.error("Error logging in user", error);
                next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map