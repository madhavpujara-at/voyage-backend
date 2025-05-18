import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Middleware to validate request components (body, query, params) against Zod schemas
 * @param schemas - Object containing Zod schemas for different request parts
 * @returns Express middleware
 */
export const validateRequest = (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body if schema provided
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      // Validate query parameters if schema provided
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      // Validate URL parameters if schema provided
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error: unknown) {
      // Return validation errors
      res.status(400).json({
        message: "Validation error",
        errors: error instanceof ZodError ? error.errors : [error instanceof Error ? error.message : "Unknown error"],
      });
    }
  };
};
