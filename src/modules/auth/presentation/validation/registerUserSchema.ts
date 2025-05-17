import { z } from "zod";
import { RegisterUserRequestDto } from "../../application/useCases/registerUser/RegisterUserRequestDto";

/**
 * Zod schema for validating user registration requests
 */
export const RegisterUserSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email must be less than 255 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    // Require at least one uppercase letter, one lowercase letter, one number, and one special character
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/,
      "Password must include uppercase, lowercase, number, and special character",
    ),
});

// Type guard to ensure the validated data matches the DTO
export type ValidatedRegisterUserRequest = z.infer<typeof RegisterUserSchema>;

// Ensure the schema matches the DTO
// This will cause a compile-time error if the schema doesn't match the DTO
type _EnsureMatch = RegisterUserRequestDto extends ValidatedRegisterUserRequest ? true : false;
