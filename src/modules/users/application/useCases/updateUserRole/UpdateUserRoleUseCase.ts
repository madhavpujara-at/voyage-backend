import { IUserRepository } from "../../../../auth/domain/interfaces/IUserRepository";
import pinoLoggerFactory from "../../../../../shared/logger/pino-logger";
import { UpdateUserRoleRequestDto } from "./UpdateUserRoleRequestDto";
import { UpdateUserRoleResponseDto } from "./UpdateUserRoleResponseDto";
import { UserRole } from "../../../../auth/domain/entities/User";

export class UpdateUserRoleUseCase {
  private logger = pinoLoggerFactory.createLogger("UpdateUserRoleUseCase");

  constructor(private userRepository: IUserRepository) {}

  async execute(data: UpdateUserRoleRequestDto): Promise<UpdateUserRoleResponseDto> {
    const isDowngrade = data.newRole === UserRole.TEAM_MEMBER;
    const operationType = isDowngrade ? "downgrade" : "upgrade";

    this.logger.info(`Attempting to ${operationType} role for user ${data.userId} to ${data.newRole}`);

    // Find user by ID to ensure they exist
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      this.logger.warn(`User with ID ${data.userId} not found`);
      throw new Error("User not found");
    }

    // Check if the role is actually changing
    if (user.role === data.newRole) {
      this.logger.info(`User ${data.userId} already has role ${data.newRole}, no action needed`);
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt,
      };
    }

    // Update user role
    const updatedUser = await this.userRepository.updateRole(data.userId, data.newRole);

    this.logger.info(`Role ${operationType}d successfully for user ${data.userId} to ${data.newRole}`);

    // Return updated user without sensitive information
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
