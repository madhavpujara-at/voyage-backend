import { randomUUID } from "crypto";
import { Team } from "../../../domain/entities/Team";
import { ITeamRepository } from "../../../domain/interfaces/repositories/ITeamRepository";
import { CreateTeamRequestDto } from "./CreateTeamRequestDto";
import { CreateTeamResponseDto } from "./CreateTeamResponseDto";

export class CreateTeamUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(request: CreateTeamRequestDto): Promise<CreateTeamResponseDto> {
    // Check if a team with this name already exists
    const existingTeam = await this.teamRepository.findByName(request.name);
    if (existingTeam) {
      throw new Error(`Team with name '${request.name}' already exists`);
    }

    // Create a new team entity
    const now = new Date();
    const team = new Team(
      randomUUID(), // Generate a UUID for the team
      request.name,
      now,
      now,
    );

    // Save the team to the repository
    await this.teamRepository.save(team);

    // Return the team data
    return {
      team: team.toObject(),
    };
  }
}
