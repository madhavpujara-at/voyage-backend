"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = require("../middleware/validateRequest");
const registerUserSchema_1 = require("../validation/registerUserSchema");
const loginUserSchema_1 = require("../validation/loginUserSchema");
const RegisterUserUseCase_1 = require("../../application/useCases/registerUser/RegisterUserUseCase");
const LoginUserUseCase_1 = require("../../application/useCases/loginUser/LoginUserUseCase");
const UserPrismaRepository_1 = require("../../infrastructure/repositories/UserPrismaRepository");
// Initialize router
const router = (0, express_1.Router)();
// Initialize repositories
const userRepository = new UserPrismaRepository_1.UserPrismaRepository();
// Initialize use cases
const registerUserUseCase = new RegisterUserUseCase_1.RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase_1.LoginUserUseCase(userRepository);
// Initialize controller with use cases
const authController = new auth_controller_1.AuthController(registerUserUseCase, loginUserUseCase);
// Define routes
router.post("/register", (0, validateRequest_1.validateRequest)(registerUserSchema_1.RegisterUserSchema), authController.register);
router.post("/login", (0, validateRequest_1.validateRequest)(loginUserSchema_1.LoginUserSchema), authController.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map