import { Router } from "express";
import { createAnalyticsRouter } from "../../../../../../src/modules/analytics/presentation/routes/analytics.routes";
import { AnalyticsController } from "../../../../../../src/modules/analytics/presentation/controllers/analytics.controller";
import { Request, Response, NextFunction } from "express";

// Mock modules
jest.mock("express", () => {
  const mockRouter = {
    get: jest.fn().mockReturnThis(),
  };
  return {
    Router: jest.fn().mockReturnValue(mockRouter),
  };
});

jest.mock("../../../../../../src/modules/auth/presentation/middleware/jwtStrategy", () => ({
  authenticateJwt: jest.fn().mockImplementation((req: Request, res: Response, next: NextFunction) => next()),
}));

jest.mock("../../../../../../src/modules/analytics/presentation/middleware/validateRequest", () => ({
  validateRequest: jest.fn().mockImplementation(() => (req: Request, res: Response, next: NextFunction) => next()),
}));

describe("analytics.routes", () => {
  let mockController: jest.Mocked<AnalyticsController>;
  let router: Router;

  beforeEach(() => {
    // Create mock controller
    mockController = {
      getAnalyticsData: jest.fn(),
    } as unknown as jest.Mocked<AnalyticsController>;

    // Create router with mock controller
    router = createAnalyticsRouter(mockController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a router", () => {
    expect(Router).toHaveBeenCalled();
  });

  it("should configure GET / endpoint with authentication and validation", () => {
    // Get the mock router
    const mockRouter = (Router as jest.Mock)();

    // Check that the GET route is registered
    expect(mockRouter.get).toHaveBeenCalledTimes(1);

    // Verify the first parameter is "/"
    expect(mockRouter.get.mock.calls[0][0]).toBe("/");

    // Verify middleware chain (should include authenticateJwt and validateRequest middleware)
    const middlewareChain = mockRouter.get.mock.calls[0].slice(1);
    expect(middlewareChain.length).toBe(3);

    // Last handler should be a function that calls the controller method
    const routeHandler = middlewareChain[2];
    expect(typeof routeHandler).toBe("function");

    // Simulate calling the route handler to verify it calls the controller method
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    routeHandler(mockReq, mockRes, mockNext);
    expect(mockController.getAnalyticsData).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
  });
});
