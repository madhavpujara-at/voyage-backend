import { User } from "../../entities/User";
import { UserRole } from "../../../../auth/domain/entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findUsersByRole(role: UserRole): Promise<User[]>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>; // Example, adjust as per actual User entity methods
  // Add other necessary methods like create, update, delete as needed
  // Add other methods from auth.IUserRepository if needed for full compatibility like create, updateRole, countUsers
}
