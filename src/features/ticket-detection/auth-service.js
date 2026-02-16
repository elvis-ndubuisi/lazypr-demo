/**
 * Authentication Service - Ticket Detection Test
 *
 * This module tests lazyPR's ticket detection feature.
 * Associated tickets: AUTH-456, SECURITY-789
 *
 * Expected lazyPR behavior:
 * - Detect AUTH-456 from PR title
 * - Detect SECURITY-789 from commit message
 * - Detect #123 from PR body
 * - Link all tickets in PR summary
 */

const crypto = require("crypto");

class AuthenticationService {
  constructor(config = {}) {
    this.config = {
      tokenExpiry: config.tokenExpiry || 3600,
      maxAttempts: config.maxAttempts || 5,
      lockoutDuration: config.lockoutDuration || 900,
      ...config,
    };
    this.failedAttempts = new Map();
  }

  /**
   * Authenticate user with credentials
   * Addresses: AUTH-456 - Implement secure authentication
   *
   * @param {string} username - User identifier
   * @param {string} password - User password
   * @param {Object} options - Auth options
   * @returns {Promise<Object>} Auth result with tokens
   */
  async authenticate(username, password, options = {}) {
    // AUTH-456: Validate input
    if (!username || typeof username !== "string") {
      throw new AuthenticationError("Username is required", "INVALID_USERNAME");
    }

    if (!password || password.length < 8) {
      throw new AuthenticationError("Password must be at least 8 characters", "INVALID_PASSWORD");
    }

    // Check for account lockout
    if (this.isAccountLocked(username)) {
      const remainingTime = this.getLockoutRemainingTime(username);
      throw new AuthenticationError(
        `Account locked. Try again in ${remainingTime} seconds`,
        "ACCOUNT_LOCKED",
      );
    }

    try {
      // Retrieve user from database
      const user = await this.getUserByUsername(username);

      if (!user) {
        // SECURITY-789: Generic error message to prevent user enumeration
        await this.recordFailedAttempt(username);
        throw new AuthenticationError("Invalid credentials", "AUTH_FAILED");
      }

      // Verify password
      const isValid = await this.verifyPassword(password, user.passwordHash);

      if (!isValid) {
        await this.recordFailedAttempt(username);
        throw new AuthenticationError("Invalid credentials", "AUTH_FAILED");
      }

      // Clear failed attempts on success
      this.clearFailedAttempts(username);

      // Generate tokens
      const tokens = await this.generateTokens(user, options);

      // Log successful authentication
      await this.logAuthEvent(user.id, "LOGIN_SUCCESS", { ip: options.ip });

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles || ["user"],
        },
        tokens,
        expiresAt: new Date(Date.now() + this.config.tokenExpiry * 1000).toISOString(),
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }

      // Log unexpected errors
      console.error("Authentication error:", error);
      throw new AuthenticationError("Authentication failed", "AUTH_ERROR");
    }
  }

  /**
   * Verify password against hash
   * SECURITY-789: Use secure password verification
   *
   * @param {string} password - Plain text password
   * @param {string} hash - Stored hash
   * @returns {Promise<boolean>} Whether password matches
   */
  async verifyPassword(password, hash) {
    // In production, use bcrypt or Argon2
    // This is simplified for demo purposes
    const hashedInput = crypto
      .createHash("sha256")
      .update(password + "salt")
      .digest("hex");

    return hashedInput === hash;
  }

  /**
   * Generate authentication tokens
   * @param {Object} user - User object
   * @param {Object} options - Token options
   * @returns {Promise<Object>} Access and refresh tokens
   */
  async generateTokens(user, options = {}) {
    const accessToken = this.generateSecureToken();
    const refreshToken = this.generateSecureToken();

    // Store tokens in cache/session store
    await this.storeToken(accessToken, {
      userId: user.id,
      type: "access",
      expiresAt: Date.now() + this.config.tokenExpiry * 1000,
    });

    await this.storeToken(refreshToken, {
      userId: user.id,
      type: "refresh",
      expiresAt: Date.now() + this.config.tokenExpiry * 24 * 60 * 60 * 1000, // 24 hours
    });

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: this.config.tokenExpiry,
    };
  }

  /**
   * Record failed authentication attempt
   * @param {string} username - Username
   */
  async recordFailedAttempt(username) {
    const attempts = this.failedAttempts.get(username) || { count: 0, firstAttempt: Date.now() };
    attempts.count++;
    attempts.lastAttempt = Date.now();

    this.failedAttempts.set(username, attempts);

    // Log security event
    await this.logAuthEvent(null, "LOGIN_FAILED", {
      username,
      attemptCount: attempts.count,
    });
  }

  /**
   * Check if account is locked
   * @param {string} username - Username
   * @returns {boolean} Whether account is locked
   */
  isAccountLocked(username) {
    const attempts = this.failedAttempts.get(username);
    if (!attempts) return false;

    return (
      attempts.count >= this.config.maxAttempts &&
      Date.now() - attempts.lastAttempt < this.config.lockoutDuration * 1000
    );
  }

  /**
   * Get remaining lockout time
   * @param {string} username - Username
   * @returns {number} Seconds remaining
   */
  getLockoutRemainingTime(username) {
    const attempts = this.failedAttempts.get(username);
    if (!attempts || attempts.count < this.config.maxAttempts) return 0;

    const elapsed = Date.now() - attempts.lastAttempt;
    const remaining = this.config.lockoutDuration * 1000 - elapsed;
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  /**
   * Clear failed attempts
   * @param {string} username - Username
   */
  clearFailedAttempts(username) {
    this.failedAttempts.delete(username);
  }

  /**
   * Generate cryptographically secure token
   * @returns {string} Secure token
   */
  generateSecureToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Store token (mock implementation)
   * @param {string} token - Token to store
   * @param {Object} data - Token metadata
   */
  async storeToken(token, data) {
    // In production: store in Redis/database
    console.log(`Token stored: ${token.substring(0, 8)}...`);
  }

  /**
   * Get user by username (mock implementation)
   * @param {string} username - Username
   * @returns {Promise<Object|null>} User object or null
   */
  async getUserByUsername(username) {
    // Mock database
    const users = [
      {
        id: "user-001",
        username: "demo",
        email: "demo@example.com",
        passwordHash: crypto.createHash("sha256").update("demo123salt").digest("hex"),
        roles: ["user", "admin"],
      },
      {
        id: "user-002",
        username: "test",
        email: "test@example.com",
        passwordHash: crypto.createHash("sha256").update("test123salt").digest("hex"),
        roles: ["user"],
      },
    ];

    return users.find((u) => u.username === username) || null;
  }

  /**
   * Log authentication event
   * @param {string} userId - User ID
   * @param {string} event - Event type
   * @param {Object} metadata - Additional data
   */
  async logAuthEvent(userId, event, metadata = {}) {
    console.log(`[AUTH] ${new Date().toISOString()} - ${event}`, {
      userId,
      ...metadata,
    });
  }
}

/**
 * Custom authentication error
 */
class AuthenticationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AuthenticationError";
    this.code = code;
  }
}

module.exports = { AuthenticationService, AuthenticationError };
