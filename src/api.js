/**
 * API Module
 *
 * RESTful API endpoints for the demo application.
 * Demonstrates various code patterns for lazyPR analysis.
 */

const { AuthManager } = require("./auth");

class APIRouter {
  constructor() {
    this.auth = new AuthManager();
    this.routes = new Map();
    this.middleware = [];
    this.setupRoutes();
  }

  /**
   * Setup all API routes
   */
  setupRoutes() {
    // Health check
    this.get("/health", this.healthCheck.bind(this));

    // Authentication routes
    this.post("/auth/login", this.login.bind(this));
    this.post("/auth/logout", this.logout.bind(this));
    this.get("/auth/verify", this.verifySession.bind(this));

    // User routes
    this.get("/users", this.listUsers.bind(this));
    this.get("/users/:id", this.getUser.bind(this));
    this.put("/users/:id", this.updateUser.bind(this));
    this.delete("/users/:id", this.deleteUser.bind(this));

    // Data routes
    this.get("/data", this.getData.bind(this));
    this.post("/data", this.createData.bind(this));
    this.put("/data/:id", this.updateData.bind(this));
    this.delete("/data/:id", this.deleteData.bind(this));
  }

  /**
   * Register a GET route
   */
  get(path, handler) {
    this.addRoute("GET", path, handler);
  }

  /**
   * Register a POST route
   */
  post(path, handler) {
    this.addRoute("POST", path, handler);
  }

  /**
   * Register a PUT route
   */
  put(path, handler) {
    this.addRoute("PUT", path, handler);
  }

  /**
   * Register a DELETE route
   */
  delete(path, handler) {
    this.addRoute("DELETE", path, handler);
  }

  /**
   * Add route to registry
   */
  addRoute(method, path, handler) {
    const key = `${method}:${path}`;
    this.routes.set(key, handler);
  }

  /**
   * Health check endpoint
   */
  async healthCheck(req, res) {
    return res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime: process.uptime(),
    });
  }

  /**
   * User login endpoint
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await this.auth.authenticate(username, password);

      if (result.success) {
        return res.json({
          success: true,
          message: "Login successful",
          data: result,
        });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * User logout endpoint
   */
  async logout(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      this.auth.logout(token);
    }

    return res.json({
      success: true,
      message: "Logout successful",
    });
  }

  /**
   * Verify session endpoint
   */
  async verifySession(req, res) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const session = this.auth.verifyToken(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    return res.json({
      success: true,
      data: session,
    });
  }

  /**
   * List all users (protected)
   */
  async listUsers(req, res) {
    // Mock data for demo
    const users = [
      { id: 1, username: "demo", email: "demo@example.com" },
      { id: 2, username: "test", email: "test@example.com" },
      { id: 3, username: "admin", email: "admin@example.com" },
    ];

    return res.json({
      success: true,
      data: users,
    });
  }

  /**
   * Get single user (protected)
   */
  async getUser(req, res) {
    const { id } = req.params;

    return res.json({
      success: true,
      data: {
        id: Number.parseInt(id),
        username: `user${id}`,
        email: `user${id}@example.com`,
      },
    });
  }

  /**
   * Update user (protected)
   */
  async updateUser(req, res) {
    const { id } = req.params;
    const updates = req.body;

    return res.json({
      success: true,
      message: `User ${id} updated`,
      data: { id: Number.parseInt(id), ...updates },
    });
  }

  /**
   * Delete user (protected)
   */
  async deleteUser(req, res) {
    const { id } = req.params;

    return res.json({
      success: true,
      message: `User ${id} deleted`,
    });
  }

  /**
   * Get data (protected)
   */
  async getData(req, res) {
    const data = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 100),
      createdAt: new Date().toISOString(),
    }));

    return res.json({
      success: true,
      data,
    });
  }

  /**
   * Create data (protected)
   */
  async createData(req, res) {
    const newItem = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json({
      success: true,
      message: "Data created",
      data: newItem,
    });
  }

  /**
   * Update data (protected)
   */
  async updateData(req, res) {
    const { id } = req.params;
    const updates = req.body;

    return res.json({
      success: true,
      message: `Data ${id} updated`,
      data: { id: Number.parseInt(id), ...updates },
    });
  }

  /**
   * Delete data (protected)
   */
  async deleteData(req, res) {
    const { id } = req.params;

    return res.json({
      success: true,
      message: `Data ${id} deleted`,
    });
  }
}

module.exports = { APIRouter };
