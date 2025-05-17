"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPrismaRepository = void 0;
const prisma_client_1 = __importDefault(require("@/infrastructure/database/prisma-client"));
const pino_logger_1 = __importDefault(require("@/shared/logger/pino-logger"));
class UserPrismaRepository {
    constructor() {
        this.logger = pino_logger_1.default.createLogger("UserPrismaRepository");
    }
    async findByEmail(email) {
        try {
            return await prisma_client_1.default.user.findUnique({
                where: { email },
            });
        }
        catch (error) {
            this.logger.error(`Error finding user by email: ${email}`, error);
            throw error;
        }
    }
    async create(userData) {
        try {
            return await prisma_client_1.default.user.create({
                data: userData,
            });
        }
        catch (error) {
            this.logger.error(`Error creating user with email: ${userData.email}`, error);
            throw error;
        }
    }
    async findById(id) {
        try {
            return await prisma_client_1.default.user.findUnique({
                where: { id },
            });
        }
        catch (error) {
            this.logger.error(`Error finding user by ID: ${id}`, error);
            throw error;
        }
    }
    async updateRole(userId, newRole) {
        try {
            return await prisma_client_1.default.user.update({
                where: { id: userId },
                data: { role: newRole },
            });
        }
        catch (error) {
            this.logger.error(`Error updating role for user ID: ${userId}`, error);
            throw error;
        }
    }
    async countUsers() {
        try {
            return await prisma_client_1.default.user.count();
        }
        catch (error) {
            this.logger.error("Error counting users", error);
            throw error;
        }
    }
}
exports.UserPrismaRepository = UserPrismaRepository;
//# sourceMappingURL=UserPrismaRepository.js.map