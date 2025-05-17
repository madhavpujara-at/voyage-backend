import { ITokenBlacklistService } from "../../../domain/interfaces/ITokenBlacklistService";
import { LogoutUserRequestDto } from "./LogoutUserRequestDto";
import { LogoutUserResponseDto } from "./LogoutUserResponseDto";
import jwt from "jsonwebtoken";
import config from "../../../../../config";
import pinoLoggerFactory from "../../../../../shared/logger/pino-logger";

export class LogoutUserUseCase {
  private logger = pinoLoggerFactory.createLogger("LogoutUserUseCase");

  constructor(private tokenBlacklistService: ITokenBlacklistService) {}

  /**
   * Execute the logout use case
   * @param request The logout request containing the token to invalidate
   * @returns A response indicating success or failure
   */
  async execute(request: LogoutUserRequestDto): Promise<LogoutUserResponseDto> {
    try {
      // Extract the token from the request (removing "Bearer " if present)
      const token = request.token.startsWith("Bearer ")
        ? request.token.substring(7)
        : request.token;

      // Decode the token to get user ID and expiration time
      const decodedToken = jwt.verify(token, config.jwtSecret) as {
        sub: string;
        exp: number;
      };

      // Add token to blacklist
      await this.tokenBlacklistService.addToBlacklist(
        token,
        decodedToken.sub,
        new Date(decodedToken.exp * 1000) // exp is in seconds, convert to milliseconds
      );

      this.logger.info(`User ${decodedToken.sub} successfully logged out`);

      return {
        success: true,
        message: "Successfully logged out",
      };
    } catch (error) {
      this.logger.error("Error during logout", error);
      
      // If the token is invalid, we still want to return success
      // since the end result is the same - the user is effectively logged out
      if (error instanceof jwt.JsonWebTokenError) {
        return {
          success: true,
          message: "Successfully logged out",
        };
      }
      
      throw error;
    }
  }
} 