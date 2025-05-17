import { ITeamRepository } from "../../../domain/interfaces/repositories/ITeamRepository";
import { ListTeamsRequestDto } from "./ListTeamsRequestDto";
import { ListTeamsResponseDto, TeamDto } from "./ListTeamsResponseDto";

export class ListTeamsUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(_request: ListTeamsRequestDto): Promise<ListTeamsResponseDto> {
    // Fetch all teams from the repository
    const teams = await this.teamRepository.findAll();

    // Map domain entities to DTOs
    const teamDtos: TeamDto[] = teams.map((team) => ({
      id: team.id,
      name: team.getName(),
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }));

    // Return the teams
    return {
      teams: teamDtos,
    };
  }
}
