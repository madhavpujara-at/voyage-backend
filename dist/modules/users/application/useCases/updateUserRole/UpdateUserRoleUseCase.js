"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRoleUseCase = void 0;
const pino_logger_1 = __importDefault(require("@/shared/logger/pino-logger"));
class UpdateUserRoleUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = pino_logger_1.default.createLogger("UpdateUserRoleUseCase");
    }
    async execute(data) {
        this.logger.info(`Attempting to update role for user ${data.userId} to ${data.newRole}`);
        // Find user by ID to ensure they exist
        const user = await this.userRepository.findById(data.userId);
        if (!user) {
            this.logger.warn(`User with ID ${data.userId} not found`);
            throw new Error("User not found");
        }
        // Update user role
        const updatedUser = await this.userRepository.updateRole(data.userId, data.newRole);
        this.logger.info(`Role updated successfully for user ${data.userId} to ${data.newRole}`);
        // Return updated user without sensitive information
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            updatedAt: updatedUser.updatedAt,
        };
    }
}
exports.UpdateUserRoleUseCase = UpdateUserRoleUseCase;
//# sourceMappingURL=UpdateUserRoleUseCase.js.map