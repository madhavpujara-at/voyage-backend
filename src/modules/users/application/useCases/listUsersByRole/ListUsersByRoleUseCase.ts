import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
// UserRole for DTO is already from auth module via ListUsersByRoleRequestDto
import { ListUsersByRoleResponseDto, UserDto } from "./ListUsersByRoleResponseDto";
import { ListUsersByRoleRequestDto } from "./ListUsersByRoleRequestDto";

export class ListUsersByRoleUseCase {
  // Renamed class
  constructor(private userRepository: IUserRepository) {}

  async execute(request: ListUsersByRoleRequestDto): Promise<ListUsersByRoleResponseDto> {
    const { role } = request;
    let usersEntities: User[];

    if (role) {
      usersEntities = await this.userRepository.findUsersByRole(role);
    } else {
      usersEntities = await this.userRepository.findAll();
    }

    const userDtos: UserDto[] = usersEntities.map((user: User) => ({
      id: user.id,
      name: user.getName(),
      email: user.getEmail(),
      role: user.getRole(), // This is auth.UserRole due to User entity using it
    }));

    return {
      users: userDtos,
    };
  }
}
