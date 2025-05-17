import { UserRole } from "../../../domain/entities/User";

export interface RegisterUserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  token: string;
}
