import { TokenBlacklistEntry } from "../types/TokenBlacklistEntry";

/**
 * Service interface for managing invalid/revoked tokens
 */
export interface ITokenBlacklistService {
  /**
   * Add a token to the blacklist
   */
  addToBlacklist(token: string, userId: string, expiresAt: Date): Promise<TokenBlacklistEntry>;
  
  /**
   * Check if a token is blacklisted
   */
  isBlacklisted(token: string): Promise<boolean>;

  /**
   * Remove expired tokens from the blacklist (maintenance)
   */
  removeExpiredTokens(): Promise<void>;
} 