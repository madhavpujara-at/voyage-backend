export interface TeamDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListTeamsResponseDto {
  teams: TeamDto[];
}
