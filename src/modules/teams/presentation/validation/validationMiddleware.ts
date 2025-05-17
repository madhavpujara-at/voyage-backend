import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../../../../shared/errors/ValidationError";

export const validateRequest = <T>(schema: ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        ...req.body,
        ...req.params,
        ...req.query,
      });

      // Replace request data with validated data
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        next(new ValidationError("Validation failed", validationErrors));
      } else {
        next(error);
      }
    }
  };
};
