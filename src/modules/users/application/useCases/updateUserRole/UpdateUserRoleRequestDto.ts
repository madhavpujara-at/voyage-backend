import { UserRole } from "../../../../../modules/auth/domain/entities/User";

/**
 * Data Transfer Object for updating user role
 */
export interface UpdateUserRoleRequestDto {
  userId: string;
  newRole: UserRole;
}
 