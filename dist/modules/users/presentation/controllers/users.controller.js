"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const pino_logger_1 = __importDefault(require("../../../../shared/logger/pino-logger"));
const logger = pino_logger_1.default.createLogger("UsersController");
class UsersController {
    constructor(updateUserRoleUseCase) {
        this.updateUserRoleUseCase = updateUserRoleUseCase;
        /**
         * Update a user's role (Admin only)
         */
        this.updateRole = async (req, res, next) => {
            try {
                // Combine route params with request body
                const data = {
                    userId: req.params.userId,
                    newRole: req.body.newRole,
                };
                const result = await this.updateUserRoleUseCase.execute(data);
                return res.status(200).json({
                    status: "success",
                    data: result,
                });
            }
            catch (error) {
                // Handle known error types
                if (error instanceof Error) {
                    if (error.message === "User not found") {
                        return res.status(404).json({
                            status: "error",
                            message: error.message,
                        });
                    }
                }
                logger.error("Error updating user role", error);
                next(error);
            }
        };
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map