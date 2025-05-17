import { RegisterUserUseCase } from "../../../../../../../src/modules/auth/application/useCases/registerUser/RegisterUserUseCase";
import { IUserRepository } from "../../../../../../../src/modules/auth/domain/interfaces/IUserRepository";
import { User, UserRole } from "../../../../../../../src/modules/auth/domain/entities/User";
import * as authUtils from "../../../../../../../src/modules/auth/application/utils/authUtils";

// Mock the authUtils module
jest.mock("../../../../../../../src/modules/auth/application/utils/authUtils", () => ({
  hashPassword: jest.fn(),
  generateToken: jest.fn(),
}));

// Mock environment variable
const originalNodeEnv = process.env.NODE_ENV;

describe("RegisterUserUseCase", () => {
  let registerUserUseCase: RegisterUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  // Setup before each test
  beforeEach(() => {
    // Create a mock user repository
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      updateRole: jest.fn(),
      countUsers: jest.fn(),
    };

    // Create instance of use case with mock repository
    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);

    // Mock utility functions
    jest.mocked(authUtils.hashPassword).mockResolvedValue("hashed_password");
    jest.mocked(authUtils.generateToken).mockReturnValue("fake_jwt_token");
  });

  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("should register a new user successfully", async () => {
    // Arrange
    const userData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };

    const createdUser = {
      id: "123",
      email: userData.email,
      name: userData.name,
      password: "hashed_password",
      role: UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.countUsers.mockResolvedValue(5); // Not the first user
    mockUserRepository.create.mockResolvedValue(createdUser);

    // Act
    const result = await registerUserUseCase.execute(userData);

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    expect(authUtils.hashPassword).toHaveBeenCalledWith(userData.password);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      email: userData.email,
      name: userData.name,
      password: "hashed_password",
      role: UserRole.TEAM_MEMBER,
    });
    expect(authUtils.generateToken).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual({
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
      token: "fake_jwt_token",
    });
  });

  it("should assign ADMIN role to first user in development environment", async () => {
    // Arrange
    process.env.NODE_ENV = "development";

    const userData = {
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
    };

    const createdUser = {
      id: "123",
      email: userData.email,
      name: userData.name,
      password: "hashed_password",
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.countUsers.mockResolvedValue(0); // This is the first user
    mockUserRepository.create.mockResolvedValue(createdUser);

    // Act
    const result = await registerUserUseCase.execute(userData);

    // Assert
    expect(mockUserRepository.countUsers).toHaveBeenCalled();
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      email: userData.email,
      name: userData.name,
      password: "hashed_password",
      role: UserRole.ADMIN,
    });
    expect(result.role).toBe(UserRole.ADMIN);
  });

  it("should throw an error if user with email already exists", async () => {
    // Arrange
    const userData = {
      email: "existing@example.com",
      password: "password123",
      name: "Existing User",
    };

    const existingUser = {
      id: "456",
      email: userData.email,
      name: "Already Exists",
      password: "some_hashed_password",
      role: UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    // Act & Assert
    await expect(registerUserUseCase.execute(userData)).rejects.toThrow("User with this email already exists");

    // Verify that we never try to create the user
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
