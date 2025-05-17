import { ITeamRepository } from "../../../domain/interfaces/repositories/ITeamRepository";
import { DeleteTeamRequestDto } from "./DeleteTeamRequestDto";
import { DeleteTeamResponseDto } from "./DeleteTeamResponseDto";

export class DeleteTeamUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(request: DeleteTeamRequestDto): Promise<DeleteTeamResponseDto> {
    // Find the team by ID to ensure it exists
    const team = await this.teamRepository.findById(request.teamId);
    if (!team) {
      throw new Error(`Team with ID '${request.teamId}' not found`);
    }

    // Delete the team
    await this.teamRepository.delete(request.teamId);

    // Return success
    return {
      success: true,
    };
  }
}
