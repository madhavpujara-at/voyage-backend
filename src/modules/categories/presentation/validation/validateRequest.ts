import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z } from "zod";

/**
 * Middleware for validating request data against a Zod schema
 */
export function validateRequest(schema: AnyZodObject, target: "body" | "params" | "query" = "body") {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.parseAsync(req[target]);
      req[target] = data;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
}
