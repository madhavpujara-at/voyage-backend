import { UserRole } from "../../../../../modules/auth/domain/entities/User";

export interface UpdateUserRoleResponseDto {
  id: string;
  email: string;
  role: UserRole;
  updatedAt: Date;
} 