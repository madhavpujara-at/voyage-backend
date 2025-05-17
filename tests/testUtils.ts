import { Team } from "../src/modules/teams/domain/entities/Team";
import { Express } from 'express';
import { Server } from 'http';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { UserRole } from '../src/modules/auth/domain/entities/User';

// Interfaces for test objects
export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface TestServer {
  app: Express;
  server: Server;
}

/**
 * Factory function to create a test Team entity
 */
export function createTestTeam(overrides = {}) {
  const defaults = {
    id: "team-id-123",
    name: "Engineering Team",
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
  };

  // Merge defaults with overrides
  const data = { ...defaults, ...overrides };
  
  return new Team(
    data.id,
    data.name,
    data.createdAt,
    data.updatedAt
  );
}

/**
 * Factory function to create a test Team DTO object
 */
export function createTestTeamDto(overrides = {}) {
  const defaults = {
    id: "team-id-123",
    name: "Engineering Team",
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
  };

  // Merge defaults with overrides
  return { ...defaults, ...overrides };
}

/**
 * Factory function to create a test user object
 */
export function createTestUser(overrides = {}) {
  const defaults = {
    id: "user-id-123",
    email: "test@example.com",
    name: "Test User",
    role: "TEAM_MEMBER",
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    updatedAt: new Date("2023-01-01T00:00:00.000Z"),
  };

  // Merge defaults with overrides
  return { ...defaults, ...overrides };
}

/**
 * Sets up a mock Express request object
 */
export function createMockRequest(overrides = {}) {
  const defaults = {
    body: {},
    params: {},
    query: {},
    user: createTestUser(),
  };

  return { ...defaults, ...overrides };
}

/**
 * Sets up a mock Express response object
 */
export function createMockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

/**
 * Creates a mock function to be used as Express next middleware
 */
export function createMockNext() {
  return jest.fn();
}

/**
 * Creates a JWT token for test authentication
 */
export const createTestToken = (user: TestUser): string => {
  // Make sure to use the same secret and options as in the real app
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

/**
 * Returns authorization header with bearer token
 */
export const getAuthHeader = (token: string): { Authorization: string } => {
  return { Authorization: `Bearer ${token}` };
};

/**
 * Utility to register a test user
 */
export const registerTestUser = async (app: Express, userData: { email: string; password: string; name: string }) => {
  const response = await request(app)
    .post('/api/auth/register')
    .send(userData);
  
  return response;
};

/**
 * Utility to login a test user
 */
export const loginTestUser = async (app: Express, credentials: { email: string; password: string }) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send(credentials);
  
  return response;
};

/**
 * Mock database for tests to avoid real DB connections
 */
export const setupDatabaseMock = () => {
  jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn().mockImplementation(() => ({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        // Add more mocked Prisma methods as needed
      })),
    };
  });
}; 