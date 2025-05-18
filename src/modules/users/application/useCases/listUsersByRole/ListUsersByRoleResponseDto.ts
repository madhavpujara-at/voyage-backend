export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ListUsersByRoleResponseDto {
  users: UserDto[];
}
