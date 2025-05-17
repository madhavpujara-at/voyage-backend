import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validateRequest";
import { RegisterUserSchema } from "../validation/registerUserSchema";
import { LoginUserSchema } from "../validation/loginUserSchema";
import { RegisterUserUseCase } from "../../application/useCases/registerUser/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/useCases/loginUser/LoginUserUseCase";
import { UserPrismaRepository } from "../../infrastructure/repositories/UserPrismaRepository";

// Initialize router
const router = Router();

// Initialize repositories
const userRepository = new UserPrismaRepository();

// Initialize use cases
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

// Initialize controller with use cases
const authController = new AuthController(registerUserUseCase, loginUserUseCase);

// Define routes
router.post("/register", validateRequest(RegisterUserSchema), authController.register);
router.post("/login", validateRequest(LoginUserSchema), authController.login);

export default router;
