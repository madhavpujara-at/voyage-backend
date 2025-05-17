# Standard Operating Procedure: Testing Strategy

## 1. Introduction

This document outlines the standard testing practices for the Digital Kudos Wall backend application. Following these guidelines ensures consistent, reliable, and maintainable tests across the codebase.

## 2. Testing Tools & Libraries

- **Jest**: Main testing framework
- **ts-jest**: TypeScript support for Jest
- **Supertest**: HTTP assertions for integration testing
- **jest-mock-extended**: For advanced mocking of interfaces

## 3. Test Directory Structure

```
tests/
├── unit/
│   └── modules/
│       └── [ModuleName]/
│           └── [Component]/
│               └── [ComponentName].test.ts
├── integration/
│   ├── [ModuleName]/
│   │   └── [Feature].integration.test.ts
│   └── testUtils.ts
└── e2e/  # (If applicable)
```

## 4. Test File Naming Conventions

- Unit tests: `[ComponentName].test.ts`
- Integration tests: `[Feature].integration.test.ts`
- End-to-end tests: `[Feature].e2e.test.ts`

## 5. Unit Testing Guidelines

### 5.1 Application Layer Testing

- Focus on testing use cases and their logic
- Mock all repositories and external dependencies
- Test both successful and error scenarios
- Verify all validations and business rules

**Example**: Testing a use case

```typescript
describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  
  beforeEach(() => {
    // Setup mocks
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      // Other methods...
    };
    
    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
  });
  
  it('should register a user successfully', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue({
      id: '123',
      email: 'test@example.com',
      // Other properties...
    });
    
    // Act
    const result = await registerUserUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id', '123');
  });
  
  it('should throw an error if user already exists', async () => {
    // Arrange, Act, Assert...
  });
});
```

### 5.2 Domain Layer Testing

- Test domain entities and their business rules
- Verify value objects work as expected
- Test domain services

### 5.3 Infrastructure Layer Testing

- Test concrete implementations of repositories
- Test external service integrations
- Use database mocks for repository tests

### 5.4 Presentation Layer Testing

- Test controllers independently
- Mock use cases
- Focus on error handling and response formatting

## 6. Integration Testing Guidelines

Integration tests should focus on testing how components work together:

- **API Routes**: Test the complete request-response cycle
- **Authentication**: Test authentication and authorization flows
- **Database Interactions**: Test actual repository implementations with the database (using test database or in-memory option)

**Example**: Testing an API route

```typescript
import request from 'supertest';
import express from 'express';
import authRoutes from '../../../src/modules/auth/presentation/routes/auth.routes';

// Setup test app and mocks...

describe('Auth API Integration Tests', () => {
  let app: express.Application;
  
  beforeEach(() => {
    // Setup app and mocks...
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Setup mock implementations...
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      // Additional assertions...
    });
    
    // More tests...
  });
});
```

## 7. Mocking Best Practices

- Mock only what's necessary
- Use `jest.mock()` for module mocking
- Use `jest.fn()` for function mocking
- Use `jest-mock-extended` for interface mocking

**Example**: Mocking a repository interface

```typescript
import { mock } from 'jest-mock-extended';
import { IUserRepository } from '../domain/interfaces/IUserRepository';

const mockUserRepository = mock<IUserRepository>();
```

## 8. Test Data Management

- Create factory functions for generating test data
- Use descriptive variable names that indicate the purpose of the data
- Prefer creating the minimal data needed for the test

**Example**: Test data factory

```typescript
function createTestUser(overrides = {}) {
  return {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password',
    role: UserRole.TEAM_MEMBER,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}
```

## 9. Testing Utilities

Create shared utilities to simplify common testing tasks:

- Authentication helpers
- Request helpers
- Database setup/teardown

Store these in `tests/testUtils.ts` or a dedicated utility directory.

## 10. Test Coverage Requirements

- Minimum unit test coverage: 80% for application layer
- Critical paths and business logic should have 100% coverage
- Integration tests should cover all API endpoints

Run coverage reports regularly:

```bash
npm test -- --coverage
```

## 11. Testing Environment

- Configure a separate test environment in `.env.test`
- Use in-memory database where possible for faster tests
- Set the test environment explicitly:

```bash
NODE_ENV=test npm test
```

## 12. Continuous Integration

- All tests must pass before merging code
- Coverage thresholds are enforced in CI
- Test results should be published as artifacts

## 13. Troubleshooting Common Issues

- **Time-sensitive tests**: Use Jest's timer mocks
- **Database connection issues**: Ensure proper cleanup between tests
- **Async test failures**: Always use `await` with async calls in tests

## 14. Example Test Cases

### Unit Test Example

See section 5.1 for a complete unit test example.

### Integration Test Example

See section 6 for a complete integration test example.

## 15. Review Checklist

Before submitting a PR, ensure your tests:

- [ ] Follow the directory structure and naming conventions
- [ ] Cover both success and error cases
- [ ] Mock external dependencies appropriately
- [ ] Are fast and reliable (no flaky tests)
- [ ] Have descriptive test names that explain what's being tested
- [ ] Include appropriate assertions
- [ ] Meet coverage requirements 