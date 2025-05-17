import { IUserRepository } from "../../../../../../../src/modules/auth/domain/interfaces/IUserRepository";
import { User, UserRole } from "../../../../../../../src/modules/auth/domain/entities/User";
import { UpdateUserRoleUseCase } from "../../../../../../../src/modules/users/application/useCases/updateUserRole/UpdateUserRoleUseCase";

describe('UpdateUserRoleUseCase', () => {
  let updateUserRoleUseCase: UpdateUserRoleUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  
  beforeEach(() => {
    // Setup mocks
    mockUserRepository = {
      findById: jest.fn(),
      updateRole: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      countUsers: jest.fn(),
    };
    
    updateUserRoleUseCase = new UpdateUserRoleUseCase(mockUserRepository);
  });
  
  it('should update a user role successfully', async () => {
    // Arrange
    const userId = 'user-123';
    const newRole = UserRole.TECH_LEAD;
    
    const existingUser: User = {
      id: userId,
      email: 'test@example.com',
      password: 'hashed_password',
      name: 'Test User',
      role: UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedUser: User = {
      ...existingUser,
      role: newRole,
      updatedAt: new Date(),
    };
    
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.updateRole.mockResolvedValue(updatedUser);
    
    // Act
    const result = await updateUserRoleUseCase.execute({
      userId,
      newRole,
    });
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.updateRole).toHaveBeenCalledWith(userId, newRole);
    expect(result).toEqual({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt,
    });
  });
  
  it('should throw an error if user does not exist', async () => {
    // Arrange
    const userId = 'non-existent-user';
    const newRole = UserRole.ADMIN;
    
    mockUserRepository.findById.mockResolvedValue(null);
    
    // Act & Assert
    await expect(updateUserRoleUseCase.execute({
      userId,
      newRole,
    })).rejects.toThrow('User not found');
    
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.updateRole).not.toHaveBeenCalled();
  });
  
  it('should propagate repository errors', async () => {
    // Arrange
    const userId = 'user-123';
    const newRole = UserRole.ADMIN;
    const mockError = new Error('Database connection error');
    
    const existingUser: User = {
      id: userId,
      email: 'test@example.com',
      password: 'hashed_password',
      name: 'Test User',
      role: UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.updateRole.mockRejectedValue(mockError);
    
    // Act & Assert
    await expect(updateUserRoleUseCase.execute({
      userId,
      newRole,
    })).rejects.toThrow(mockError);
    
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.updateRole).toHaveBeenCalledWith(userId, newRole);
  });
}); 