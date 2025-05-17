"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const authUtils_1 = require("../../utils/authUtils");
const pino_logger_1 = __importDefault(require("../../../../../shared/logger/pino-logger"));
class RegisterUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = pino_logger_1.default.createLogger("RegisterUserUseCase");
    }
    async execute(userData) {
        this.logger.info(`Attempting to register user with email: ${userData.email}`);
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            this.logger.warn(`User with email ${userData.email} already exists`);
            throw new Error("User with this email already exists");
        }
        // Hash password
        const hashedPassword = await (0, authUtils_1.hashPassword)(userData.password);
        // Check if this is the first user (to assign ADMIN role)
        const usersCount = await this.userRepository.countUsers();
        const role = usersCount === 0 ? "ADMIN" : "TEAM_MEMBER";
        if (usersCount === 0) {
            this.logger.info("First user detected - assigning ADMIN role");
        }
        // Create user with appropriate role
        const newUser = await this.userRepository.create({
            email: userData.email,
            password: hashedPassword,
            role: role,
        });
        this.logger.info(`User registered successfully: ${newUser.id} with role: ${newUser.role}`);
        // Return user data without sensitive information
        return {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
        };
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
//# sourceMappingURL=RegisterUserUseCase.js.map