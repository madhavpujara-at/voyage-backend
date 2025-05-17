import { UpdateUserRoleSchema, ValidatedUpdateUserRoleRequest } from '../../../../../../src/modules/users/presentation/validation/updateUserRoleSchema';
import { UserRole } from '../../../../../../src/modules/auth/domain/entities/User';
import { ZodError } from 'zod';

describe('UpdateUserRoleSchema', () => {
  it('should validate correct input data', () => {
    // Arrange
    const validData = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      newRole: UserRole.ADMIN,
    };

    // Act
    const result = UpdateUserRoleSchema.parse(validData);

    // Assert
    expect(result).toEqual(validData);
    // Check type compatibility
    const typedResult: ValidatedUpdateUserRoleRequest = result;
    expect(typedResult).toEqual(result);
  });

  it('should validate all supported role types', () => {
    // Test each valid role value
    const baseData = { userId: '123e4567-e89b-12d3-a456-426614174000' };
    
    // TEAM_MEMBER role
    expect(UpdateUserRoleSchema.parse({
      ...baseData,
      newRole: UserRole.TEAM_MEMBER,
    })).toEqual({
      ...baseData,
      newRole: UserRole.TEAM_MEMBER,
    });

    // TECH_LEAD role
    expect(UpdateUserRoleSchema.parse({
      ...baseData,
      newRole: UserRole.TECH_LEAD,
    })).toEqual({
      ...baseData,
      newRole: UserRole.TECH_LEAD,
    });

    // ADMIN role
    expect(UpdateUserRoleSchema.parse({
      ...baseData,
      newRole: UserRole.ADMIN,
    })).toEqual({
      ...baseData,
      newRole: UserRole.ADMIN,
    });
  });

  it('should reject invalid user ID format', () => {
    // Arrange
    const invalidData = {
      userId: 'not-a-uuid',
      newRole: UserRole.ADMIN,
    };

    // Act & Assert
    expect(() => {
      UpdateUserRoleSchema.parse(invalidData);
    }).toThrow(ZodError);

    try {
      UpdateUserRoleSchema.parse(invalidData);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.errors[0].message).toBe('Invalid user ID format');
      }
    }
  });

  it('should reject invalid role values', () => {
    // Arrange
    const invalidData = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      newRole: 'INVALID_ROLE' as UserRole,
    };

    // Act & Assert
    expect(() => {
      UpdateUserRoleSchema.parse(invalidData);
    }).toThrow(ZodError);

    try {
      UpdateUserRoleSchema.parse(invalidData);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.errors[0].message).toBe('Role must be one of: TEAM_MEMBER, TECH_LEAD, ADMIN');
      }
    }
  });

  it('should reject missing required fields', () => {
    // Arrange - missing userId
    const missingUserId = {
      newRole: UserRole.ADMIN,
    };

    // Act & Assert
    expect(() => {
      UpdateUserRoleSchema.parse(missingUserId);
    }).toThrow(ZodError);

    // Arrange - missing newRole
    const missingNewRole = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
    };

    // Act & Assert
    expect(() => {
      UpdateUserRoleSchema.parse(missingNewRole);
    }).toThrow(ZodError);
  });
}); 