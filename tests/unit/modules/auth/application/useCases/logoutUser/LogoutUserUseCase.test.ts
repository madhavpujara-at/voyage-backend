import { LogoutUserUseCase } from '../../../../../../../src/modules/auth/application/useCases/logoutUser/LogoutUserUseCase';
import { ITokenBlacklistService } from '../../../../../../../src/modules/auth/domain/interfaces/ITokenBlacklistService';
import { TokenBlacklistEntry } from '../../../../../../../src/modules/auth/domain/types/TokenBlacklistEntry';
import jwt from 'jsonwebtoken';
import config from '../../../../../../../src/config';

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  // We'll use an inline implementation instead of a reference to the class
  JsonWebTokenError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'JsonWebTokenError';
    }
  }
}));

describe('LogoutUserUseCase', () => {
  let logoutUserUseCase: LogoutUserUseCase;
  let mockTokenBlacklistService: jest.Mocked<ITokenBlacklistService>;
  
  // Setup before each test
  beforeEach(() => {
    // Create a mock token blacklist service
    mockTokenBlacklistService = {
      addToBlacklist: jest.fn(),
      isBlacklisted: jest.fn(),
      removeExpiredTokens: jest.fn(),
    };
    
    // Create instance of use case with mock service
    logoutUserUseCase = new LogoutUserUseCase(mockTokenBlacklistService);
    
    // Setup default jwt verify mock
    const mockExpiration = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    (jwt.verify as jest.Mock).mockReturnValue({
      sub: 'user123',
      exp: mockExpiration,
      iat: Math.floor(Date.now() / 1000) - 100, // issued 100 seconds ago
    });
  });
  
  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should successfully logout a user with a valid token', async () => {
    // Arrange
    const request = {
      token: 'valid_jwt_token'
    };
    
    const blacklistEntry: TokenBlacklistEntry = {
      token: request.token,
      userId: 'user123',
      expiresAt: expect.any(Date) as unknown as Date,
      createdAt: expect.any(Date) as unknown as Date,
    };
    
    mockTokenBlacklistService.addToBlacklist.mockResolvedValue(blacklistEntry);
    
    // Act
    const result = await logoutUserUseCase.execute(request);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(request.token, config.jwtSecret);
    expect(mockTokenBlacklistService.addToBlacklist).toHaveBeenCalledWith(
      request.token,
      'user123',
      expect.any(Date)
    );
    expect(result).toEqual({
      success: true,
      message: 'Successfully logged out',
    });
  });
  
  it('should handle token with "Bearer " prefix correctly', async () => {
    // Arrange
    const request = {
      token: 'Bearer valid_jwt_token'
    };
    
    // Act
    const result = await logoutUserUseCase.execute(request);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('valid_jwt_token', config.jwtSecret);
    expect(mockTokenBlacklistService.addToBlacklist).toHaveBeenCalledWith(
      'valid_jwt_token',
      'user123',
      expect.any(Date)
    );
    expect(result).toEqual({
      success: true,
      message: 'Successfully logged out',
    });
  });
  
  it('should still return success when token is invalid', async () => {
    // Arrange
    const request = {
      token: 'invalid_token'
    };
    
    // Get reference to the JsonWebTokenError constructor from the mock
    const JsonWebTokenError = (jwt as any).JsonWebTokenError;
    
    // Setup JWT to throw validation error
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new JsonWebTokenError('invalid token');
    });
    
    // Act
    const result = await logoutUserUseCase.execute(request);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('invalid_token', config.jwtSecret);
    expect(mockTokenBlacklistService.addToBlacklist).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: 'Successfully logged out',
    });
  });
  
  it('should throw error when a non-JWT related error occurs', async () => {
    // Arrange
    const request = {
      token: 'valid_jwt_token'
    };
    
    // Force mockTokenBlacklistService to throw an unexpected error
    const unexpectedError = new Error('Database connection failed');
    mockTokenBlacklistService.addToBlacklist.mockRejectedValue(unexpectedError);
    
    // Act & Assert
    await expect(logoutUserUseCase.execute(request))
      .rejects.toThrow('Database connection failed');
    
    expect(jwt.verify).toHaveBeenCalled();
    expect(mockTokenBlacklistService.addToBlacklist).toHaveBeenCalled();
  });
}); 