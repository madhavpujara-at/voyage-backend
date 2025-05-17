/**
 * Data Transfer Object for logout response
 */
export interface LogoutUserResponseDto {
  /**
   * Whether the logout was successful
   */
  success: boolean;
  
  /**
   * Message providing additional information about the result
   */
  message: string;
} 