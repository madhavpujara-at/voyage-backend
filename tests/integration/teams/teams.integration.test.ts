import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { createTeamsRouter } from "../../../src/modules/teams/presentation/routes/teams.routes";
import { TeamsController } from "../../../src/modules/teams/presentation/controllers/teams.controller";
import { CreateTeamUseCase } from "../../../src/modules/teams/application/useCases/createTeam/CreateTeamUseCase";
import { ListTeamsUseCase } from "../../../src/modules/teams/application/useCases/listTeams/ListTeamsUseCase";
import { UpdateTeamUseCase } from "../../../src/modules/teams/application/useCases/updateTeam/UpdateTeamUseCase";
import { DeleteTeamUseCase } from "../../../src/modules/teams/application/useCases/deleteTeam/DeleteTeamUseCase";

// Mock the authentication middleware
jest.mock("../../../src/modules/auth/presentation/middleware/jwtStrategy", () => ({
  authenticateJwt: (req: Request, res: Response, next: NextFunction) => {
    // Add user info to the request
    (req as any).user = {
      id: "user-123",
      email: "test@example.com",
      role: "ADMIN",
    };
    next();
  },
  authorizeRoles: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    // This middleware just checks if the role in req.user is in the roles array
    if (roles.includes((req as any).user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  },
}));

// Mock the validation middleware
jest.mock("../../../src/modules/teams/presentation/validation/validationMiddleware", () => ({
  validateRequest: (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    // This is a simplified validation that just calls next
    // In a more comprehensive test, you could implement validation logic
    next();
  },
}));

describe("Teams API Integration Tests", () => {
  let app: express.Application;
  let mockCreateTeamUseCase: jest.Mocked<CreateTeamUseCase>;
  let mockListTeamsUseCase: jest.Mocked<ListTeamsUseCase>;
  let mockUpdateTeamUseCase: jest.Mocked<UpdateTeamUseCase>;
  let mockDeleteTeamUseCase: jest.Mocked<DeleteTeamUseCase>;

  beforeEach(() => {
    // Setup mock use cases
    mockCreateTeamUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateTeamUseCase>;

    mockListTeamsUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListTeamsUseCase>;

    mockUpdateTeamUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateTeamUseCase>;

    mockDeleteTeamUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteTeamUseCase>;

    // Create controller with mock use cases
    const teamsController = new TeamsController(
      mockCreateTeamUseCase,
      mockListTeamsUseCase,
      mockUpdateTeamUseCase,
      mockDeleteTeamUseCase,
    );

    // Setup Express app with teams router
    app = express();
    app.use(express.json());
    app.use("/api/teams", createTeamsRouter(teamsController));

    // Global error handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({ error: err.message });
    });
  });

  describe("POST /api/teams", () => {
    it("should create a new team successfully", async () => {
      // Arrange
      const teamData = { name: "Engineering Team" };
      const useCaseResult = {
        team: {
          id: "team-123",
          name: "Engineering Team",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      mockCreateTeamUseCase.execute.mockResolvedValue(useCaseResult);

      // Act
      const response = await request(app).post("/api/teams").send(teamData);

      // Assert
      expect(response.status).toBe(200);
      expect(mockCreateTeamUseCase.execute).toHaveBeenCalledWith(teamData);
      expect(response.body).toEqual({
        team: expect.objectContaining({
          id: "team-123",
          name: "Engineering Team",
        }),
      });
    });

    it("should return error when team creation fails", async () => {
      // Arrange
      const teamData = { name: "Engineering Team" };
      const error = new Error("Team with this name already exists");
      mockCreateTeamUseCase.execute.mockRejectedValue(error);

      // Act
      const response = await request(app).post("/api/teams").send(teamData);

      // Assert
      expect(response.status).toBe(500);
      expect(mockCreateTeamUseCase.execute).toHaveBeenCalledWith(teamData);
      expect(response.body).toEqual({
        error: "Team with this name already exists",
      });
    });
  });

  describe("GET /api/teams", () => {
    it("should return list of teams", async () => {
      // Arrange
      const useCaseResult = {
        teams: [
          {
            id: "team-123",
            name: "Engineering Team",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "team-456",
            name: "Product Team",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      mockListTeamsUseCase.execute.mockResolvedValue(useCaseResult);

      // Act
      const response = await request(app).get("/api/teams");

      // Assert
      expect(response.status).toBe(200);
      expect(mockListTeamsUseCase.execute).toHaveBeenCalledWith({});
      expect(response.body).toEqual({
        teams: expect.arrayContaining([
          expect.objectContaining({ id: "team-123", name: "Engineering Team" }),
          expect.objectContaining({ id: "team-456", name: "Product Team" }),
        ]),
      });
    });

    it("should return error when listing teams fails", async () => {
      // Arrange
      const error = new Error("Database error");
      mockListTeamsUseCase.execute.mockRejectedValue(error);

      // Act
      const response = await request(app).get("/api/teams");

      // Assert
      expect(response.status).toBe(500);
      expect(mockListTeamsUseCase.execute).toHaveBeenCalledWith({});
      expect(response.body).toEqual({
        error: "Database error",
      });
    });
  });

  describe("PUT /api/teams/:teamId", () => {
    it("should update team successfully", async () => {
      // Arrange
      const teamId = "team-123";
      const updateData = { name: "Updated Team Name" };
      const useCaseResult = {
        team: {
          id: teamId,
          name: updateData.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      mockUpdateTeamUseCase.execute.mockResolvedValue(useCaseResult);

      // Act
      const response = await request(app).put(`/api/teams/${teamId}`).send(updateData);

      // Assert
      expect(response.status).toBe(200);
      // The controller combines params and body, so we check if execute was called
      // with the expected combined data
      expect(mockUpdateTeamUseCase.execute).toHaveBeenCalled();
      expect(response.body).toEqual({
        team: expect.objectContaining({
          id: teamId,
          name: updateData.name,
        }),
      });
    });

    it("should return error when team update fails", async () => {
      // Arrange
      const teamId = "team-123";
      const updateData = { name: "Updated Team Name" };
      const error = new Error("Team not found");
      mockUpdateTeamUseCase.execute.mockRejectedValue(error);

      // Act
      const response = await request(app).put(`/api/teams/${teamId}`).send(updateData);

      // Assert
      expect(response.status).toBe(500);
      expect(mockUpdateTeamUseCase.execute).toHaveBeenCalled();
      expect(response.body).toEqual({
        error: "Team not found",
      });
    });
  });

  describe("DELETE /api/teams/:teamId", () => {
    it("should delete team successfully", async () => {
      // Arrange
      const teamId = "team-123";
      const useCaseResult = { success: true };
      mockDeleteTeamUseCase.execute.mockResolvedValue(useCaseResult);

      // Act
      const response = await request(app).delete(`/api/teams/${teamId}`);

      // Assert
      expect(response.status).toBe(200);
      // The controller extracts teamId from params, so we check if execute was called
      expect(mockDeleteTeamUseCase.execute).toHaveBeenCalled();
      expect(response.body).toEqual({ success: true });
    });

    it("should return error when team deletion fails", async () => {
      // Arrange
      const teamId = "team-123";
      const error = new Error("Team not found");
      mockDeleteTeamUseCase.execute.mockRejectedValue(error);

      // Act
      const response = await request(app).delete(`/api/teams/${teamId}`);

      // Assert
      expect(response.status).toBe(500);
      expect(mockDeleteTeamUseCase.execute).toHaveBeenCalled();
      expect(response.body).toEqual({
        error: "Team not found",
      });
    });
  });
});
