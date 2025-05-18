import { User } from "../../entities/User";
import { UserRole } from "../../../../auth/domain/entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findUsersByRole(role: UserRole): Promise<User[]>;
  // Add other necessary methods like save, create, update, delete as needed
  save(user: User): Promise<void>; // Example, adjust as per actual User entity methods
}
