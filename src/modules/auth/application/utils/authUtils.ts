import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../../../config";
import { User } from "../../domain/entities/User";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate JWT token for a user
 */
export function generateToken(user: User): string {
  // Create a payload with only the necessary user info
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  // Sign and return the token
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "24h", // Token expires in 24 hours
  });
}

/**
 * Extract user ID from JWT token
 */
export function extractUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { sub: string };
    return decoded.sub;
  } catch (error) {
    return null;
  }
} 