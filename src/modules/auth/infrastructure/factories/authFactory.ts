/**
 * Auth module factory
 * Centralizes the creation of Auth module components with proper dependencies
 */

import { RegisterUserUseCase } from "../../application/useCases/registerUser/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/useCases/loginUser/LoginUserUseCase";
import { LogoutUserUseCase } from "../../application/useCases/logoutUser/LogoutUserUseCase";
import { UserPrismaRepository } from "../repositories/UserPrismaRepository";
import { UserPrismaMapper } from "../mappers/UserMapper";
import { InMemoryTokenBlacklistService } from "../services/InMemoryTokenBlacklistService";
import { AuthController } from "../../presentation/controllers/auth.controller";
import { IUserMapper } from "../../domain/interfaces/IUserMapper";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ITokenBlacklistService } from "../../domain/interfaces/ITokenBlacklistService";

/**
 * Creates Auth module components with dependencies properly wired
 */
export class AuthFactory {
  static createUserMapper(): IUserMapper {
    return new UserPrismaMapper();
  }

  static createUserRepository(mapper?: IUserMapper): IUserRepository {
    const userMapper = mapper || this.createUserMapper();
    return new UserPrismaRepository(userMapper);
  }

  static createTokenBlacklistService(): ITokenBlacklistService {
    return new InMemoryTokenBlacklistService();
  }

  static createRegisterUserUseCase(userRepository?: IUserRepository): RegisterUserUseCase {
    const repository = userRepository || this.createUserRepository();
    return new RegisterUserUseCase(repository);
  }

  static createLoginUserUseCase(userRepository?: IUserRepository): LoginUserUseCase {
    const repository = userRepository || this.createUserRepository();
    return new LoginUserUseCase(repository);
  }

  static createLogoutUserUseCase(
    tokenBlacklistService?: ITokenBlacklistService
  ): LogoutUserUseCase {
    const service = tokenBlacklistService || this.createTokenBlacklistService();
    return new LogoutUserUseCase(service);
  }

  static createAuthController(
    registerUserUseCase?: RegisterUserUseCase,
    loginUserUseCase?: LoginUserUseCase,
    logoutUserUseCase?: LogoutUserUseCase
  ): AuthController {
    const register = registerUserUseCase || this.createRegisterUserUseCase();
    const login = loginUserUseCase || this.createLoginUserUseCase();
    const logout = logoutUserUseCase || this.createLogoutUserUseCase();

    return new AuthController(register, login, logout);
  }
} 