import { z } from "zod";
import { UpdateCategoryRequestDto } from "../../application/useCases/updateCategory/UpdateCategoryRequestDto";

/**
 * Zod schema for validating category update requests
 */
export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name cannot exceed 50 characters").trim(),
}) satisfies z.ZodType<UpdateCategoryRequestDto>;
