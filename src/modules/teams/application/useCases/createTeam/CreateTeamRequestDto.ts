/**
 * Data Transfer Object for creating a team
 * Validation happens at the API level in presentation/validation/teamValidationSchemas.ts
 */
export interface CreateTeamRequestDto {
  /**
   * The name of the team to create
   */
  name: string;
} 