import { IUserRepository } from "@/modules/auth/domain/interfaces/IUserRepository";
import { UpdateUserRoleRequestDto } from "./UpdateUserRoleRequestDto";
import { UpdateUserRoleResponseDto } from "./UpdateUserRoleResponseDto";
import pinoLoggerFactory from "@/shared/logger/pino-logger";

export class UpdateUserRoleUseCase {
  private logger = pinoLoggerFactory.createLogger("UpdateUserRoleUseCase");

  constructor(private userRepository: IUserRepository) {}

  async execute(data: UpdateUserRoleRequestDto): Promise<UpdateUserRoleResponseDto> {
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
