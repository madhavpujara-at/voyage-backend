import { UserRole } from "../../../domain/entities/User";

export interface LoginUserResponseDto {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
  token: string;
} 