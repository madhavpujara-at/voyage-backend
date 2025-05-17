import { z } from "zod";

/**
 * Zod schema for validating ID parameters in routes
 */
export const idParamSchema = z.object({
  id: z.string().uuid("Invalid category ID format"),
});
