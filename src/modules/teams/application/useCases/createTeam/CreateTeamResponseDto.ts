export interface TeamDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeamResponseDto {
  team: TeamDto;
} 