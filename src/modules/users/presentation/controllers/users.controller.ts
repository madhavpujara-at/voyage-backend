import { Request, Response, NextFunction } from "express";
import { UpdateUserRoleUseCase } from "../../application/useCases/updateUserRole/UpdateUserRoleUseCase";
import pinoLoggerFactory from "../../../../shared/logger/pino-logger";
import { ListTeamMembersUseCase } from "../../application/useCases/listTeamMembers/ListTeamMembersUseCase";

const logger = pinoLoggerFactory.createLogger("UsersController");

export class UsersController {
  constructor(
    private updateUserRoleUseCase: UpdateUserRoleUseCase,
    private listTeamMembersUseCase: ListTeamMembersUseCase,
  ) {}

  /**
   * Update a user's role (Admin only)
   */
  updateRole = async (req: Request, res: Response, next: NextFunction) => {
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

  async listTeamMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.listTeamMembersUseCase.execute();
      res.status(200).json(result);
    } catch (error) {
      next(error); // Pass errors to the global error handler
    }
  }
}
