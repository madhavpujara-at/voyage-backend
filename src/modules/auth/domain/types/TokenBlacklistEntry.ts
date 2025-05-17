/**
 * Represents a blacklisted/invalidated token
 */
export interface TokenBlacklistEntry {
  token: string; // The blacklisted token (or its hash)
  userId: string; // User ID associated with the token
  createdAt: Date; // When the token was blacklisted
  expiresAt: Date; // When the token expires (can be used for cleanup)
}
