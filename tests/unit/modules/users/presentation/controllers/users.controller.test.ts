import { Request, Response } from 'express';
import { UsersController } from '../../../../../../src/modules/users/presentation/controllers/users.controller';
import { UpdateUserRoleUseCase } from '../../../../../../src/modules/users/application/useCases/updateUserRole/UpdateUserRoleUseCase';
import { UserRole } from '../../../../../../src/modules/auth/domain/entities/User';

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUpdateUserRoleUseCase: jest.Mocked<UpdateUserRoleUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Setup use case mock
    mockUpdateUserRoleUseCase = {
      execute: jest.fn(),
    } as any;

    // Create controller instance with mocked dependencies
    usersController = new UsersController(mockUpdateUserRoleUseCase);

    // Setup mock request, response, and next function
    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe('updateRole', () => {
    it('should update a user role and return 200 status with success response', async () => {
      // Arrange
      const userId = 'user-123';
      const newRole = UserRole.ADMIN;
      const updatedAt = new Date();

      mockRequest.params = { userId };
      mockRequest.body = { newRole };

      const mockResponseData = {
        id: userId,
        email: 'test@example.com',
        role: newRole,
        updatedAt,
      };

      mockUpdateUserRoleUseCase.execute.mockResolvedValue(mockResponseData);

      // Act
      await usersController.updateRole(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockUpdateUserRoleUseCase.execute).toHaveBeenCalledWith({
        userId,
        newRole,
      });
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockResponseData,
      });
      
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 404 status when user is not found', async () => {
      // Arrange
      const userId = 'non-existent-user';
      const newRole = UserRole.TECH_LEAD;

      mockRequest.params = { userId };
      mockRequest.body = { newRole };

      mockUpdateUserRoleUseCase.execute.mockRejectedValue(new Error('User not found'));

      // Act
      await usersController.updateRole(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockUpdateUserRoleUseCase.execute).toHaveBeenCalledWith({
        userId,
        newRole,
      });
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User not found',
      });
      
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error for unexpected errors', async () => {
      // Arrange
      const userId = 'user-123';
      const newRole = UserRole.ADMIN;
      const unexpectedError = new Error('Unexpected error');

      mockRequest.params = { userId };
      mockRequest.body = { newRole };

      mockUpdateUserRoleUseCase.execute.mockRejectedValue(unexpectedError);

      // Act
      await usersController.updateRole(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockUpdateUserRoleUseCase.execute).toHaveBeenCalledWith({
        userId,
        newRole,
      });
      
      expect(mockNext).toHaveBeenCalledWith(unexpectedError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
}); 