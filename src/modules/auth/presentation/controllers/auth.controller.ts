import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../../application/useCases/registerUser/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/useCases/loginUser/LoginUserUseCase";
import pinoLoggerFactory from "../../../../shared/logger/pino-logger";

const logger = pinoLoggerFactory.createLogger("AuthController");

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
  ) {}

  /**
   * Register a new user
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.registerUserUseCase.execute(req.body);
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error: unknown) {
      // Handle known error types
      if (error instanceof Error && error.message === "User with this email already exists") {
        return res.status(409).json({
          status: "error",
          message: error.message,
        });
      }

      logger.error("Error registering user", error);
      next(error);
    }
  };

  /**
   * Login a user and return JWT token
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.loginUserUseCase.execute(req.body);
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error: unknown) {
      // Handle known error types
      if (error instanceof Error && error.message === "Invalid email or password") {
        return res.status(401).json({
          status: "error",
          message: error.message,
        });
      }

      logger.error("Error logging in user", error);
      next(error);
    }
  };
}
