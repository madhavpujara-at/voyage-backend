import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { UserRole } from "../../../../auth/domain/entities/User";
import { ListTeamMembersResponseDto, TeamMemberDto } from "./ListTeamMembersResponseDto";

export class ListTeamMembersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<ListTeamMembersResponseDto> {
    // Fetch users with the TEAM_MEMBER role from the repository
    const teamMembersEntities = await this.userRepository.findUsersByRole(UserRole.TEAM_MEMBER);

    // Map domain entities to DTOs
    const teamMemberDtos: TeamMemberDto[] = teamMembersEntities.map((user: User) => ({
      id: user.id,
      name: user.getName(), // Assuming User entity has getName()
      email: user.getEmail(), // Assuming User entity has getEmail()
      role: user.getRole(), // This will now be the auth.UserRole type
    }));

    return {
      teamMembers: teamMemberDtos,
    };
  }
}
