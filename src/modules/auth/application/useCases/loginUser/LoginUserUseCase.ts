import { IUserRepository } from "@/modules/auth/domain/interfaces/IUserRepository";
import { LoginUserRequestDto } from "./LoginUserRequestDto";
import { LoginUserResponseDto } from "./LoginUserResponseDto";
import { comparePasswords, generateToken } from "@/modules/auth/application/utils/authUtils";
import pinoLoggerFactory from "@/shared/logger/pino-logger";

export class LoginUserUseCase {
  private logger = pinoLoggerFactory.createLogger("LoginUserUseCase");

  constructor(private userRepository: IUserRepository) {}

  async execute(credentials: LoginUserRequestDto): Promise<LoginUserResponseDto> {
    this.logger.info(`Login attempt for user: ${credentials.email}`);

    // Find user by email
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      this.logger.warn(`Login failed: User not found - ${credentials.email}`);
      throw new Error("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await comparePasswords(credentials.password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for user ${credentials.email}`);
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user);

    this.logger.info(`User logged in successfully: ${user.id}`);

    // Return user data and token
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
} 