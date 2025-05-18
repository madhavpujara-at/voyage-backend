import { UserRole } from "../../../../auth/domain/entities/User";

export interface ListUsersByRoleRequestDto {
  role?: UserRole; // Role is now optional
}
