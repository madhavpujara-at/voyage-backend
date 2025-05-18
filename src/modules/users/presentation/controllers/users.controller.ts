import { Request, Response, NextFunction } from "express";
import { UpdateUserRoleUseCase } from "../../application/useCases/updateUserRole/UpdateUserRoleUseCase";
import pinoLoggerFactory from "../../../../shared/logger/pino-logger";
import { ListUsersByRoleUseCase } from "../../application/useCases/listUsersByRole/ListUsersByRoleUseCase";
import { UserRole } from "../../../auth/domain/entities/User";

const logger = pinoLoggerFactory.createLogger("UsersController");

export class UsersController {
  constructor(
    private updateUserRoleUseCase: UpdateUserRoleUseCase,
    private listUsersByRoleUseCase: ListUsersByRoleUseCase,
  ) {}

  /**
   * Update a user's role (Admin only)
   * Supports upgrading to TECH_LEAD/ADMIN or downgrading to TEAM_MEMBER
   */
  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Combine route params with request body
      const data = {
        userId: req.params.userId,
        newRole: req.body.newRole,
      };

      // Log the role change attempt with explicit message about operation type
      const operation = req.body.newRole === UserRole.TEAM_MEMBER ? "downgrade" : "upgrade";
      logger.info(`Attempting to ${operation} user ${data.userId} to role ${data.newRole}`);

      const result = await this.updateUserRoleUseCase.execute(data);

      return res.status(200).json({
        status: "success",
        data: result,
        message: `User role ${operation}d successfully to ${data.newRole}`,
      });
    } catch (error: unknown) {
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

  async listUsersByRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = req.query.role as UserRole | undefined;

      if (role && !Object.values(UserRole).includes(role)) {
        res.status(400).json({ message: "Invalid role value provided." });
        return;
      }

      const result = await this.listUsersByRoleUseCase.execute({ role });
      res.status(200).json(result);
    } catch (error) {
      next(error); // Pass errors to the global error handler
    }
  }
}
