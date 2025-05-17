import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateRequest = (schema: ZodSchema, isQuery = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body or query parameters
      const data = isQuery ? req.query : req.body;
      const validated = schema.parse(data);

      // Replace the request data with the validated data
      if (isQuery) {
        req.query = validated;
      } else {
        req.body = validated;
      }

      next();
    } catch (error: unknown) {
      res.status(400).json({
        message: "Validation error",
        errors: error instanceof ZodError ? error.errors : [error instanceof Error ? error.message : "Unknown error"],
      });
    }
  };
};
