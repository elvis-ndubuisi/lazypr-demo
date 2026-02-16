/**
 * User Management Service
 * Ticket: AUTH-456 - Implement user authentication
 * Related: #789 - Security review
 * See: PROJ-123 for API specifications
 * Linear: LINEAR-001 for login flow
 */

class UserService {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
  }

  /**
   * Validate user data
   * Addresses LINEAR-001: Add validation layer
   *
   * @param {Object} user - User object to validate
   * @returns {boolean} Whether user is valid
   */
  validateUser(user) {
    if (!user || !user.id || !user.email) {
      return false;
    }

    // Email validation for #789 security requirements
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return false;
    }

    return true;
  }

  /**
   * Create new user
   * Implements AUTH-456 user creation
   *
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(data) {
    // Validation for PROJ-123 API compliance
    if (!this.validateUser(data)) {
      throw new Error("Invalid user data");
    }

    const user = {
      id: `user-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    this.users.set(user.id, user);

    // Log for #789 security audit
    console.log(`[SECURITY] User created: ${user.id}`);

    return user;
  }

  /**
   * Authenticate user
   * Part of AUTH-456 implementation
   *
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Auth result
   */
  async authenticate(email, password) {
    // Find user by email
    const user = Array.from(this.users.values()).find((u) => u.email === email);

    if (!user) {
      throw new Error("User not found");
    }

    // Validate password (simplified for demo)
    if (password !== "demo123") {
      throw new Error("Invalid credentials");
    }

    // Create session for LINEAR-001
    const sessionId = `session-${Date.now()}`;
    this.sessions.set(sessionId, {
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      sessionId,
    };
  }

  /**
   * Get user by ID
   *
   * @param {string} userId - User ID
   * @returns {Object|undefined} User object
   */
  getUser(userId) {
    return this.users.get(userId);
  }

  /**
   * List all users
   *
   * @returns {Array} Array of users
   */
  listUsers() {
    return Array.from(this.users.values());
  }
}

module.exports = { UserService };
