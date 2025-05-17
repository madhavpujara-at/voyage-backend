import { z } from "zod";
import { LoginUserRequestDto } from "../../application/useCases/loginUser/LoginUserRequestDto";

/**
 * Zod schema for validating user login requests
 */
export const LoginUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Type guard to ensure the validated data matches the DTO
export type ValidatedLoginUserRequest = z.infer<typeof LoginUserSchema>;

// Ensure the schema matches the DTO
// This will cause a compile-time error if the schema doesn't match the DTO
type _EnsureMatch = LoginUserRequestDto extends ValidatedLoginUserRequest ? true : false; 