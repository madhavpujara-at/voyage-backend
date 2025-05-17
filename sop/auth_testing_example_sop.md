# Auth Module Testing SOP - Practical Example

This SOP provides concrete examples of how to test the Auth module, based on our actual implementation.

## 1. Unit Testing Auth Use Cases

### RegisterUserUseCase Testing

The `RegisterUserUseCase` is a core application layer component that handles user registration. Here's how we test it:

```typescript
import { RegisterUserUseCase } from '../../../../../../../src/modules/auth/application/useCases/registerUser/RegisterUserUseCase';
import { IUserRepository } from '../../../../../../../src/modules/auth/domain/interfaces/IUserRepository';
import { User, UserRole } from '../../../../../../../src/modules/auth/domain/entities/User';
import * as authUtils from '../../../../../../../src/modules/auth/application/utils/authUtils';

// Mock the authUtils module
jest.mock('../../../../../../../src/modules/auth/application/utils/authUtils', () => ({
  hashPassword: jest.fn(),
  generateToken: jest.fn(),
}));

// Mock environment variable
const originalNodeEnv = process.env.NODE_ENV;

describe('RegisterUserUseCase', () => {
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
    jest.mocked(authUtils.hashPassword).mockResolvedValue('hashed_password');
    jest.mocked(authUtils.generateToken).mockReturnValue('fake_jwt_token');
  });
  
  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
  });
  
  it('should register a new user successfully', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };
    
    const createdUser = {
      id: '123',
      email: userData.email,
      name: userData.name,
      password: 'hashed_password',
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
      password: 'hashed_password',
      role: UserRole.TEAM_MEMBER,
    });
    expect(authUtils.generateToken).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual({
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
      token: 'fake_jwt_token',
    });
  });
  
  it('should assign ADMIN role to first user in development environment', async () => {
    // Arrange
    process.env.NODE_ENV = 'development';
    
    const userData = {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
    };
    
    const createdUser = {
      id: '123',
      email: userData.email,
      name: userData.name,
      password: 'hashed_password',
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
      password: 'hashed_password',
      role: UserRole.ADMIN,
    });
    expect(result.role).toBe(UserRole.ADMIN);
  });
  
  it('should throw an error if user with email already exists', async () => {
    // Arrange
    const userData = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Existing User',
    };
    
    const existingUser = {
      id: '456',
      email: userData.email,
      name: 'Already Exists',
      password: 'some_hashed_password',
      role: UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);
    
    // Act & Assert
    await expect(registerUserUseCase.execute(userData))
      .rejects.toThrow('User with this email already exists');
    
    // Verify that we never try to create the user
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
```

### LoginUserUseCase Testing

Similarly, we test the `LoginUserUseCase`:

```typescript
import { LoginUserUseCase } from '../../../../../../../src/modules/auth/application/useCases/loginUser/LoginUserUseCase';
import { IUserRepository } from '../../../../../../../src/modules/auth/domain/interfaces/IUserRepository';
import { User, UserRole } from '../../../../../../../src/modules/auth/domain/entities/User';
import * as authUtils from '../../../../../../../src/modules/auth/application/utils/authUtils';

// Mock the authUtils module
jest.mock('../../../../../../../src/modules/auth/application/utils/authUtils', () => ({
  comparePasswords: jest.fn(),
  generateToken: jest.fn(),
}));

describe('LoginUserUseCase', () => {
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
    jest.mocked(authUtils.generateToken).mockReturnValue('fake_jwt_token');
  });
  
  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should login a user successfully', async () => {
    // Arrange
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };
    
    const existingUser = {
      id: '123',
      email: credentials.email,
      name: 'Test User',
      password: 'hashed_password',
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
      token: 'fake_jwt_token',
    });
  });
  
  it('should throw an error if user with email does not exist', async () => {
    // Arrange
    const credentials = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };
    
    mockUserRepository.findByEmail.mockResolvedValue(null);
    
    // Act & Assert
    await expect(loginUserUseCase.execute(credentials))
      .rejects.toThrow('Invalid email or password');
    
    // The password comparison should never be called
    expect(authUtils.comparePasswords).not.toHaveBeenCalled();
  });
  
  it('should throw an error if password is incorrect', async () => {
    // Arrange
    const credentials = {
      email: 'test@example.com',
      password: 'wrong_password',
    };
    
    const existingUser = {
      id: '123',
      email: credentials.email,
      name: 'Test User',
      password: 'hashed_password',
      role: UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);
    jest.mocked(authUtils.comparePasswords).mockResolvedValue(false); // Password doesn't match
    
    // Act & Assert
    await expect(loginUserUseCase.execute(credentials))
      .rejects.toThrow('Invalid email or password');
    
    // The password comparison should be called
    expect(authUtils.comparePasswords).toHaveBeenCalledWith(credentials.password, existingUser.password);
    // But the token generation should not be called
    expect(authUtils.generateToken).not.toHaveBeenCalled();
  });
});
```

## 2. Integration Testing Auth API Endpoints

For integration testing, we create a mock Express app and test the API endpoints:

```typescript
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Router } from 'express';
import { UserRole } from '../../../src/modules/auth/domain/entities/User';
import jwt from 'jsonwebtoken';

// Mock JWT and dependencies
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({
    id: '123',
    sub: '123',
    email: 'test@example.com',
    role: 'TEAM_MEMBER',
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  }),
  sign: jest.fn().mockReturnValue('fake_jwt_token'),
}));

// Setup mocked repositories and services
const mockedUserRepository = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateRole: jest.fn(),
  countUsers: jest.fn(),
};

const mockedTokenBlacklistService = {
  isTokenBlacklisted: jest.fn().mockReturnValue(false),
  addToBlacklist: jest.fn().mockResolvedValue(undefined),
};

// Mock the dependencies
jest.mock('../../../src/modules/auth/infrastructure/repositories/UserPrismaRepository', () => ({
  UserPrismaRepository: jest.fn().mockImplementation(() => mockedUserRepository),
}));

// Import routes after mocking
import authRoutes from '../../../src/modules/auth/presentation/routes/auth.routes';
import { errorHandler } from '../../../src/presentation/middleware/error-handler';

// Setup test app
const setupTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  const router = Router();
  router.use('/auth', authRoutes);
  app.use('/api', router);
  
  app.use(errorHandler);
  
  return app;
};

describe('Auth API Integration Tests', () => {
  let app: express.Application;
  
  beforeEach(() => {
    jest.clearAllMocks();
    app = setupTestApp();
    
    // Reset mocks
    mockedUserRepository.findByEmail.mockReset();
    mockedUserRepository.create.mockReset();
    
    // Setup default mock implementations
    mockedUserRepository.findById.mockResolvedValue({
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed_password',
      role: UserRole.TEAM_MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Setup mock implementations
      mockedUserRepository.findByEmail.mockResolvedValue(null);
      mockedUserRepository.countUsers.mockResolvedValue(1);
      mockedUserRepository.create.mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
        role: UserRole.TEAM_MEMBER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Make request
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        });
      
      // Verify
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('email', 'test@example.com');
    });
    
    it('should return 409 if user already exists', async () => {
      // Setup mock for existing user
      mockedUserRepository.findByEmail.mockResolvedValue({
        id: '123',
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'hashed_password',
        role: UserRole.TEAM_MEMBER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Make request
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'Password123!',
          name: 'Existing User',
        });
      
      // Verify
      expect(response.status).toBe(409);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('User with this email already exists');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      // Setup mocks
      mockedUserRepository.findByEmail.mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
        role: UserRole.TEAM_MEMBER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Make request
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });
      
      // Verify
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
    });
  });
});
```

## 3. Handling Authentication in Tests

When testing endpoints that require authentication, we need to mock the JWT verification and authentication middleware:

```typescript
// Mock passport-jwt
jest.mock('passport-jwt', () => {
  return {
    Strategy: jest.fn().mockImplementation((options: any, verify: any) => {
      return {
        name: 'jwt',
        authenticate: jest.fn().mockImplementation(function(this: JwtAuthContext, req: Request) {
          if (req.headers && req.headers.authorization) {
            const user = {
              id: '123',
              email: 'test@example.com',
              role: UserRole.TEAM_MEMBER,
            };
            
            verify({ id: user.id, email: user.email, role: user.role }, (_err: Error | null, user: any) => {
              this.success(user);
            });
          } else {
            this.fail({ message: 'No auth token' });
          }
        }),
      };
    }),
    ExtractJwt: {
      fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(function(req: Request) {
        if (req.headers && req.headers.authorization) {
          return req.headers.authorization.replace('Bearer ', '');
        }
        return null;
      }),
    },
  };
});

// Mock passport
jest.mock('passport', () => {
  return {
    use: jest.fn(),
    authenticate: jest.fn().mockImplementation(() => {
      return (req: Request, res: Response, next: NextFunction) => {
        if (req.headers && req.headers.authorization) {
          req.user = {
            id: '123',
            email: 'test@example.com',
            role: UserRole.TEAM_MEMBER,
          };
          next();
        } else {
          res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
      };
    }),
  };
});
```

Then, in our test case:

```typescript
it('should logout a user successfully', async () => {
  // Make request with auth header
  const response = await request(app)
    .post('/api/auth/logout')
    .set('Authorization', 'Bearer fake_jwt_token')
    .send({});
  
  // Verify
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('success');
  expect(response.body.message).toBe('Successfully logged out');
  
  // Verify that token was added to blacklist
  expect(mockedTokenBlacklistService.addToBlacklist).toHaveBeenCalled();
});
```

## 4. Test Organization Tips

### Directory Structure

```
tests/
├── unit/
│   └── modules/
│       └── auth/
│           └── application/
│               └── useCases/
│                   ├── registerUser/
│                   │   └── RegisterUserUseCase.test.ts
│                   └── loginUser/
│                       └── LoginUserUseCase.test.ts
└── integration/
    ├── auth/
    │   └── auth.integration.test.ts
    └── testUtils.ts
```

### Test Utils

Create shared test utilities:

```typescript
// tests/integration/testUtils.ts
import { Express } from 'express';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../src/modules/auth/domain/entities/User';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const createTestToken = (user: TestUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};

export const getAuthHeader = (token: string): { Authorization: string } => {
  return { Authorization: `Bearer ${token}` };
};
```

## 5. Best Practices Applied

1. **Consistent Structure**: Follow the same directory structure for all tests
2. **Isolation**: Reset mocks between tests
3. **Realistic Data**: Use representative test data
4. **Edge Cases**: Test both happy path and error scenarios
5. **Mocking Dependencies**: Mock repositories and external services
6. **Clean Setup/Teardown**: Use beforeEach and afterEach hooks

## 6. Common Pitfalls to Avoid

1. **Missing Auth Token Mocking**: When testing protected routes
2. **Not Cleaning Up Mocks**: Reset mocks between tests
3. **Incomplete Error Cases**: Test all error paths
4. **Ignoring Edge Cases**: Test first user creation, duplicate emails, etc.
5. **Over-mocking**: Only mock what's necessary
6. **Brittle Tests**: Don't test implementation details, focus on behavior 