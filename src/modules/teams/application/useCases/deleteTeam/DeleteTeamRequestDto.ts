/**
 * Data Transfer Object for deleting a team
 * Validation happens at the API level in presentation/validation/teamValidationSchemas.ts
 */
export interface DeleteTeamRequestDto {
  /**
   * The ID of the team to delete
   */
  teamId: string;
}
