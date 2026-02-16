/**
 * Title Enhancement Test Module
 *
 * This module tests lazyPR's automatic title enhancement feature.
 * It starts with a vague commit message that doesn't match the code changes.
 *
 * Expected lazyPR behavior:
 * - Detect that commit message "Fix stuff" doesn't match actual changes
 * - Analyze the code to understand what's really being changed
 * - Suggest enhanced title like "Refactor database connection handling"
 * - Auto-update PR title if enabled
 *
 * Associated: Refactoring database layer
 */

const { EventEmitter } = require("events");

/**
 * Database Connection Manager
 * Handles connection pooling, retries, and monitoring
 */
class DatabaseManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      maxConnections: config.maxConnections || 10,
      connectionTimeout: config.connectionTimeout || 5000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      ...config,
    };

    this.connections = new Map();
    this.connectionQueue = [];
    this.isShuttingDown = false;
  }

  /**
   * Initialize connection pool
   * Sets up initial connections and event handlers
   */
  async initialize() {
    try {
      this.emit("initializing");

      // Create initial connection pool
      for (let i = 0; i < this.config.maxConnections; i++) {
        const connection = await this.createConnection();
        this.connections.set(connection.id, {
          ...connection,
          inUse: false,
          createdAt: new Date(),
        });
      }

      this.emit("initialized", { poolSize: this.connections.size });
      return true;
    } catch (error) {
      this.emit("error", error);
      throw new Error(`Failed to initialize database pool: ${error.message}`);
    }
  }

  /**
   * Get connection from pool
   * Implements queuing when all connections are in use
   */
  async getConnection() {
    if (this.isShuttingDown) {
      throw new Error("Database manager is shutting down");
    }

    // Find available connection
    const availableConnection = Array.from(this.connections.values()).find((conn) => !conn.inUse);

    if (availableConnection) {
      availableConnection.inUse = true;
      availableConnection.lastUsed = new Date();
      return availableConnection;
    }

    // If no connections available, queue the request
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Connection timeout"));
      }, this.config.connectionTimeout);

      this.connectionQueue.push({
        resolve: (conn) => {
          clearTimeout(timeoutId);
          resolve(conn);
        },
        reject: (err) => {
          clearTimeout(timeoutId);
          reject(err);
        },
        queuedAt: Date.now(),
      });
    });
  }

  /**
   * Release connection back to pool
   */
  releaseConnection(connectionId) {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      console.warn(`Attempted to release unknown connection: ${connectionId}`);
      return;
    }

    connection.inUse = false;
    connection.lastReleased = new Date();

    // Check if there are queued requests
    if (this.connectionQueue.length > 0) {
      const nextRequest = this.connectionQueue.shift();
      connection.inUse = true;
      connection.lastUsed = new Date();
      nextRequest.resolve(connection);
    }
  }

  /**
   * Execute query with automatic retry logic
   */
  async executeQuery(query, params = {}) {
    let lastError;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      let connection;

      try {
        connection = await this.getConnection();

        // Execute query (mock implementation)
        const result = await this.performQuery(connection, query, params);

        this.releaseConnection(connection.id);
        return result;
      } catch (error) {
        lastError = error;

        if (connection) {
          this.releaseConnection(connection.id);
        }

        if (attempt < this.config.retryAttempts) {
          // Exponential backoff
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `Query failed after ${this.config.retryAttempts} attempts: ${lastError.message}`,
    );
  }

  /**
   * Perform actual database query
   */
  async performQuery(connection, query, params) {
    // Simulate query execution
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          rows: [{ id: 1, data: "mock-result" }],
          rowCount: 1,
          query: query.substring(0, 50) + "...",
        });
      }, 10);
    });
  }

  /**
   * Create new database connection
   */
  async createConnection() {
    return {
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      host: this.config.host || "localhost",
      port: this.config.port || 5432,
      connected: true,
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    this.isShuttingDown = true;
    this.emit("shutting-down");

    // Wait for queued requests to complete or timeout
    const waitTime = Math.min(5000, this.connectionQueue.length * 100);
    await this.sleep(waitTime);

    // Close all connections
    for (const [id, connection] of this.connections) {
      if (!connection.inUse) {
        this.connections.delete(id);
      }
    }

    this.emit("shutdown");
  }

  /**
   * Get pool statistics
   */
  getPoolStats() {
    const connections = Array.from(this.connections.values());
    return {
      total: connections.length,
      available: connections.filter((c) => !c.inUse).length,
      inUse: connections.filter((c) => c.inUse).length,
      queued: this.connectionQueue.length,
      maxSize: this.config.maxConnections,
    };
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const conn = await this.getConnection();
      await this.executeQuery("SELECT 1");
      this.releaseConnection(conn.id);

      return {
        healthy: true,
        poolSize: this.connections.size,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Utility: Sleep function
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = { DatabaseManager };
