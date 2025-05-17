import { ITokenBlacklistService } from "../../domain/interfaces/ITokenBlacklistService";
import { TokenBlacklistEntry } from "../../domain/types/TokenBlacklistEntry";
import crypto from "crypto";
import pinoLoggerFactory from "../../../../shared/logger/pino-logger";

/**
 * In-memory implementation of token blacklist service
 * This is suitable for development/testing or a single-server deployment
 * For production with multiple servers, use a shared database or Redis implementation
 */
export class InMemoryTokenBlacklistService implements ITokenBlacklistService {
  private blacklistedTokens: Map<string, TokenBlacklistEntry> = new Map();
  private logger = pinoLoggerFactory.createLogger("InMemoryTokenBlacklistService");

  /**
   * Add a token to the blacklist
   * We hash tokens for security rather than storing them in plain text
   */
  async addToBlacklist(token: string, userId: string, expiresAt: Date): Promise<TokenBlacklistEntry> {
    // Hash the token for security
    const tokenHash = this.hashToken(token);

    const entry: TokenBlacklistEntry = {
      token: tokenHash,
      userId,
      createdAt: new Date(),
      expiresAt,
    };

    this.blacklistedTokens.set(tokenHash, entry);
    this.logger.debug(`Token added to blacklist for user: ${userId}`);

    return entry;
  }

  /**
   * Check if a token is blacklisted
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);
    return this.blacklistedTokens.has(tokenHash);
  }

  /**
   * Remove expired tokens from the blacklist
   */
  async removeExpiredTokens(): Promise<void> {
    const now = new Date();
    let expiredCount = 0;

    for (const [hash, entry] of this.blacklistedTokens.entries()) {
      if (entry.expiresAt < now) {
        this.blacklistedTokens.delete(hash);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      this.logger.debug(`Removed ${expiredCount} expired tokens from blacklist`);
    }
  }

  /**
   * Hash a token to avoid storing raw tokens in memory
   */
  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
