import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { User, UserRole } from "../../../domain/entities/User";
import { RegisterUserRequestDto } from "./RegisterUserRequestDto";
import { RegisterUserResponseDto } from "./RegisterUserResponseDto";
import { hashPassword, generateToken } from "../../utils/authUtils";
import pinoLoggerFactory from "../../../../../shared/logger/pino-logger";

export class RegisterUserUseCase {
  private logger = pinoLoggerFactory.createLogger("RegisterUserUseCase");

  constructor(private userRepository: IUserRepository) {}

  async execute(userData: RegisterUserRequestDto): Promise<RegisterUserResponseDto> {
    this.logger.info(`Attempting to register user with email: ${userData.email}`);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      this.logger.warn(`User with email ${userData.email} already exists`);
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Check if this is the first user (to assign ADMIN role) only in development
    let role: UserRole = UserRole.TEAM_MEMBER;
    if (process.env.NODE_ENV === "development") {
      const usersCount = await this.userRepository.countUsers();
      if (usersCount === 0) {
        role = UserRole.ADMIN;
        this.logger.info("First user detected - assigning ADMIN role (development only)");
      }
    }

    // Create user with appropriate role
    const newUser = await this.userRepository.create({
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      role: role,
    });

    this.logger.info(`User registered successfully: ${newUser.id} with role: ${newUser.role}`);

    // Generate JWT token for the new user
    const token = generateToken(newUser);

    // Return user data without sensitive information
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt,
      token,
    };
  }
}
