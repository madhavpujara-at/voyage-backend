import { validateRequest } from "../../../../../../src/modules/auth/presentation/middleware/validateRequest";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

describe("validateRequest Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: {
    status: jest.Mock;
    json: jest.Mock;
  };
  let nextFunction: jest.Mock;

  beforeEach(() => {
    // Setup mock request, response, and next function
    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    nextFunction = jest.fn();
  });

  it("should call next() when validation passes", async () => {
    // Arrange
    const testSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    mockRequest.body = {
      email: "test@example.com",
      password: "password123",
    };

    const middleware = validateRequest(testSchema);

    // Act
    await middleware(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("should return 400 status with validation errors when validation fails", async () => {
    // Arrange
    const testSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    mockRequest.body = {
      email: "invalid-email",
      password: "short",
    };

    const middleware = validateRequest(testSchema);

    // Act
    await middleware(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

    // Assert
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      message: "Validation failed",
      errors: expect.any(Array),
    });

    // Check that the errors array contains validation errors
    const responseBody = mockResponse.json.mock.calls[0][0];
    expect(responseBody.errors.length).toBeGreaterThan(0);

    // Verify specific validation errors
    const errorMessages = responseBody.errors.map((err: any) => err.message).join(" ");
    expect(errorMessages).toContain("email");
    expect(errorMessages).toContain("at least 8 character");
  });

  it("should pass non-ZodError errors to next()", async () => {
    // Arrange
    const testSchema = z.object({
      value: z.string(),
    });

    // Mock schema.parseAsync to throw a non-ZodError
    const mockError = new Error("Database connection error");
    jest.spyOn(testSchema, "parseAsync").mockRejectedValueOnce(mockError);

    mockRequest.body = { value: "test" };

    const middleware = validateRequest(testSchema);

    // Act
    await middleware(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
