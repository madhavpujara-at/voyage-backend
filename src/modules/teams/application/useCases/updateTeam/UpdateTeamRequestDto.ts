/**
 * Data Transfer Object for updating a team
 * Validation happens at the API level in presentation/validation/teamValidationSchemas.ts
 */
export interface UpdateTeamRequestDto {
  /**
   * The ID of the team to update
   */
  teamId: string;

  /**
   * The new name for the team
   */
  name: string;
}
