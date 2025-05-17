import { z } from "zod";

/**
 * Schema for validating logout requests
 * Note: No body validation needed as the token comes from Authorization header
 */
export const LogoutUserSchema = z.object({}).strict();
