/**
 * Authentication Module
 *
 * This module handles user authentication and session management.
 * Part of the lazyPR demo repository.
 */

class AuthManager {
  constructor() {
    this.sessions = new Map();
    this.tokenExpiry = 3600; // 1 hour
  }

  /**
   * Authenticate a user with credentials
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication result
   */
  async authenticate(username, password) {
    // Validate input
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // Check credentials (simplified for demo)
    const user = await this.getUserFromDatabase(username);
    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Generate session token
    const token = this.generateToken();
    this.sessions.set(token, {
      userId: user.id,
      username: user.username,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.tokenExpiry * 1000),
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  /**
   * Verify a session token
   * @param {string} token - Session token
   * @returns {Object|null} Session data or null if invalid
   */
  verifyToken(token) {
    const session = this.sessions.get(token);
    if (!session) {
      return null;
    }

    if (new Date() > session.expiresAt) {
      this.sessions.delete(token);
      return null;
    }

    return session;
  }

  /**
   * Logout a user
   * @param {string} token - Session token to invalidate
   */
  logout(token) {
    this.sessions.delete(token);
  }

  /**
   * Generate a secure random token
   * @returns {string} Random token
   */
  generateToken() {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Verify password against hash
   * @param {string} password - Plain text password
   * @param {string} hash - Stored hash
   * @returns {Promise<boolean>} Whether password matches
   */
  async verifyPassword(password, hash) {
    // Simplified for demo purposes
    // In production, use bcrypt or similar
    return password === hash; // Don't do this in production!
  }

  /**
   * Get user from database
   * @param {string} username - Username to lookup
   * @returns {Promise<Object|null>} User object or null
   */
  async getUserFromDatabase(username) {
    // Mock database lookup
    const users = [
      { id: 1, username: "demo", passwordHash: "demo123", email: "demo@example.com" },
      { id: 2, username: "test", passwordHash: "test123", email: "test@example.com" },
    ];

    return users.find((u) => u.username === username) || null;
  }
}

module.exports = { AuthManager };
