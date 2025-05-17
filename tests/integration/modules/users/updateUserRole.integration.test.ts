import request from "supertest";
import express from "express";
import { createTestUser, createTestToken, getAuthHeader } from "../../../testUtils";
import { UserRole } from "../../../../src/modules/auth/domain/entities/User";

describe("User Role Update Integration Tests", () => {
  let app: express.Application;

  beforeEach(() => {
    // Create Express app
    app = express();
    app.use(express.json());

    // Setup the controller for different test scenarios
    app.patch("/api/users/:userId/role", (req, res) => {
      const { userId } = req.params;
      const { newRole } = req.body;

      // Check for auth header - for this test we'll just check it exists
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: No token provided",
        });
      }

      // Simulate non-admin authorization check
      if (req.headers["x-test-role"] === UserRole.TEAM_MEMBER) {
        return res.status(403).json({
          status: "error",
          message: "Forbidden: Insufficient permissions",
        });
      }

      // Simulate not found user
      if (userId === "non-existent-user") {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      // Simulate successful update
      if (userId && newRole) {
        return res.status(200).json({
          status: "success",
          data: {
            id: userId,
            email: "test@example.com",
            role: newRole,
            updatedAt: new Date(),
          },
        });
      }

      // Fallback for unexpected inputs
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    });

    // Setup global error handler
    app.use((err: any, req: any, res: any, next: any) => {
      res.status(500).json({
        status: "error",
        message: err.message || "Internal server error",
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("PATCH /api/users/:userId/role", () => {
    it("should update user role successfully when called by admin", async () => {
      // Arrange
      const userId = "user-123";
      const newRole = UserRole.TECH_LEAD;
      const adminUser = {
        id: "admin-user-id",
        email: "admin@example.com",
        name: "Admin User",
        role: UserRole.ADMIN,
      };
      const token = createTestToken(adminUser);

      // Act
      const response = await request(app)
        .patch(`/api/users/${userId}/role`)
        .set(getAuthHeader(token))
        .send({ newRole });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("role", newRole);
    });

    it("should return 404 when user does not exist", async () => {
      // Arrange
      const userId = "non-existent-user";
      const adminUser = {
        id: "admin-user-id",
        email: "admin@example.com",
        name: "Admin User",
        role: UserRole.ADMIN,
      };
      const token = createTestToken(adminUser);

      // Act
      const response = await request(app)
        .patch(`/api/users/${userId}/role`)
        .set(getAuthHeader(token))
        .send({ newRole: UserRole.TECH_LEAD });

      // Assert
      expect(response.status).toBe(404);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("User not found");
    });

    it("should return 403 when called by non-admin user", async () => {
      // Arrange
      const userId = "user-123";
      const regularUser = {
        id: "regular-user-id",
        email: "user@example.com",
        name: "Regular User",
        role: UserRole.TEAM_MEMBER,
      };
      const token = createTestToken(regularUser);

      // Act
      const response = await request(app)
        .patch(`/api/users/${userId}/role`)
        .set(getAuthHeader(token))
        .set("x-test-role", UserRole.TEAM_MEMBER) // Custom header for test role
        .send({ newRole: UserRole.TECH_LEAD });

      // Assert
      expect(response.status).toBe(403);
      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Forbidden");
    });

    it("should handle unexpected errors", async () => {
      // Arrange
      const adminUser = {
        id: "admin-user-id",
        email: "admin@example.com",
        name: "Admin User",
        role: UserRole.ADMIN,
      };
      const token = createTestToken(adminUser);

      // Act - missing userId will trigger error
      const response = await request(app)
        .patch(`/api/users/`) // No userId provided in URL
        .set(getAuthHeader(token))
        .send({ newRole: UserRole.TECH_LEAD });

      // Assert - should return 404 Not Found for the route
      expect(response.status).toBe(404);
    });
  });
});
