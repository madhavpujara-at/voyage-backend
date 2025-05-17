/**
 * Data Transfer Object for logout request
 */
export interface LogoutUserRequestDto {
  /**
   * JWT token to invalidate (may include Bearer prefix)
   */
  token: string;
}
