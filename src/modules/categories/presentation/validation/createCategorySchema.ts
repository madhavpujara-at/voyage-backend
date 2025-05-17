import { z } from "zod";
import { CreateCategoryRequestDto } from "../../application/useCases/createCategory/CreateCategoryRequestDto";

/**
 * Zod schema for validating category creation requests
 */
export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name cannot exceed 50 characters").trim(),
}) satisfies z.ZodType<CreateCategoryRequestDto>;
