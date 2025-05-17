export interface RegisterUserResponseDto {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export type UserRole = "TEAM_MEMBER" | "TECH_LEAD" | "ADMIN";
