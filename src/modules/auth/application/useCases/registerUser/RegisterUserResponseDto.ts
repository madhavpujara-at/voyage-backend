export type UserRole = "ADMIN" | "TEAM_MEMBER";

export interface RegisterUserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  token: string;
}
