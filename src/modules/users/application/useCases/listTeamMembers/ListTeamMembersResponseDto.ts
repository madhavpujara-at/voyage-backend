export interface TeamMemberDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ListTeamMembersResponseDto {
  teamMembers: TeamMemberDto[];
}
