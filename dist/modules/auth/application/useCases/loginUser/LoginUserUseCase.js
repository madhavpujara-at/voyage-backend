"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const authUtils_1 = require("@/modules/auth/application/utils/authUtils");
const pino_logger_1 = __importDefault(require("@/shared/logger/pino-logger"));
class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = pino_logger_1.default.createLogger("LoginUserUseCase");
    }
    async execute(credentials) {
        this.logger.info(`Login attempt for user: ${credentials.email}`);
        // Find user by email
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            this.logger.warn(`Login failed: User not found - ${credentials.email}`);
            throw new Error("Invalid email or password");
        }
        // Compare password
        const isPasswordValid = await (0, authUtils_1.comparePasswords)(credentials.password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`Login failed: Invalid password for user ${credentials.email}`);
            throw new Error("Invalid email or password");
        }
        // Generate JWT token
        const token = (0, authUtils_1.generateToken)(user);
        this.logger.info(`User logged in successfully: ${user.id}`);
        // Return user data and token
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
//# sourceMappingURL=LoginUserUseCase.js.map