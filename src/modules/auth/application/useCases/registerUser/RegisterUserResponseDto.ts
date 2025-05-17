export interface RegisterUserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export type UserRole = "TEAM_MEMBER" | "TECH_LEAD" | "ADMIN";
