import { z } from "zod";
import { UpdateUserRoleRequestDto } from "../../application/useCases/updateUserRole/UpdateUserRoleRequestDto";
import { UserRole } from "../../../auth/domain/entities/User";

/**
 * Zod schema for validating user role update requests
 */
export const UpdateUserRoleSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  newRole: z.enum([UserRole.TEAM_MEMBER, UserRole.TECH_LEAD, UserRole.ADMIN] as const, {
    errorMap: () => ({ message: "Role must be one of: TEAM_MEMBER, TECH_LEAD, ADMIN" }),
  }),
});

// Type guard to ensure the validated data matches the DTO
export type ValidatedUpdateUserRoleRequest = z.infer<typeof UpdateUserRoleSchema>;

// Ensure the schema matches the DTO
// This will cause a compile-time error if the schema doesn't match the DTO
type _EnsureMatch = UpdateUserRoleRequestDto extends ValidatedUpdateUserRoleRequest ? true : false;
