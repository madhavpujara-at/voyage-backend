import { LoginUserUseCase } from "../../../../../../../src/modules/auth/application/useCases/loginUser/LoginUserUseCase";
import { IUserRepository } from "../../../../../../../src/modules/auth/domain/interfaces/IUserRepository";
import { User, UserRole } from "../../../../../../../src/modules/auth/domain/entities/User";
import * as authUtils from "../../../../../../../src/modules/auth/application/utils/authUtils";

// Mock the authUtils module
jest.mock("../../../../../../../src/modules/auth/application/utils/authUtils", () => ({
  comparePasswords: jest.fn(),
  generateToken: jest.fn(),
}));

describe("LoginUserUseCase", () => {
  let loginUserUseCase: LoginUserUseCase;
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
    loginUserUseCase = new LoginUserUseCase(mockUserRepository);

    // Mock utility functions
    jest.mocked(authUtils.comparePasswords).mockResolvedValue(true);
    jest.mocked(authUtils.generateToken).mockReturnValue("fake_jwt_token");
  });

  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login a user successfully", async () => {
    // Arrange
    const credentials = {
      email: "test@example.com",
      password: "password123",
    };

    const existingUser = {
      id: "123",
      email: credentials.email,
      name: "Test User",
      password: "hashed_password",
      role: UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    // Act
    const result = await loginUserUseCase.execute(credentials);

    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
    expect(authUtils.comparePasswords).toHaveBeenCalledWith(credentials.password, existingUser.password);
    expect(authUtils.generateToken).toHaveBeenCalledWith(existingUser);
    expect(result).toEqual({
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      },
      token: "fake_jwt_token",
    });
  });

  it("should throw an error if user with email does not exist", async () => {
    // Arrange
    const credentials = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(loginUserUseCase.execute(credentials)).rejects.toThrow("Invalid email or password");

    // The password comparison should never be called
    expect(authUtils.comparePasswords).not.toHaveBeenCalled();
  });

  it("should throw an error if password is incorrect", async () => {
    // Arrange
    const credentials = {
      email: "test@example.com",
      password: "wrong_password",
    };

    const existingUser = {
      id: "123",
      email: credentials.email,
      name: "Test User",
      password: "hashed_password",
      role: UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);
    jest.mocked(authUtils.comparePasswords).mockResolvedValue(false); // Password doesn't match

    // Act & Assert
    await expect(loginUserUseCase.execute(credentials)).rejects.toThrow("Invalid email or password");

    // The password comparison should be called
    expect(authUtils.comparePasswords).toHaveBeenCalledWith(credentials.password, existingUser.password);
    // But the token generation should not be called
    expect(authUtils.generateToken).not.toHaveBeenCalled();
  });
});
