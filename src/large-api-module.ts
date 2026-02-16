/**
 * Large API Module to Test PR Size Detection
 * This file intentionally exceeds 500 lines to trigger PR size warnings
 */

import type { Request, Response } from "express";
import { Database } from "../db";
import { Logger } from "../utils/logger";
import { Validator } from "../utils/validator";

const logger = new Logger("LargeAPI");
const db = new Database();

// ============================================================================
// User Management API - Section 1
// ============================================================================

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await db.query("SELECT * FROM users LIMIT 100");
    res.json({ success: true, data: users });
  } catch (error) {
    logger.error("Failed to get users", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!Validator.isUUID(id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }
    const user = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    logger.error("Failed to get user", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zip,
      country,
      dateOfBirth,
      gender,
      avatar,
      bio,
      website,
      timezone,
      language,
      preferences,
      metadata,
      roles,
      permissions,
      status,
      emailVerified,
      phoneVerified,
      twoFactorEnabled,
      twoFactorSecret,
      lastLoginAt,
      lastLoginIp,
      createdAt,
      updatedAt,
    } = req.body;

    // Validation
    if (!email || !Validator.isEmail(email)) {
      return res.status(400).json({ success: false, error: "Valid email is required" });
    }
    if (!username || username.length < 3) {
      return res
        .status(400)
        .json({ success: false, error: "Username must be at least 3 characters" });
    }
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ success: false, error: "Password must be at least 8 characters" });
    }
    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, error: "First and last name are required" });
    }

    // Check if email exists
    const existingEmail = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingEmail) {
      return res.status(409).json({ success: false, error: "Email already registered" });
    }

    // Check if username exists
    const existingUsername = await db.query("SELECT id FROM users WHERE username = ?", [username]);
    if (existingUsername) {
      return res.status(409).json({ success: false, error: "Username already taken" });
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const userId = await db.insert("users", {
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zip,
      country,
      dateOfBirth,
      gender,
      avatar,
      bio,
      website,
      timezone,
      language,
      preferences: JSON.stringify(preferences),
      metadata: JSON.stringify(metadata),
      roles: JSON.stringify(roles),
      permissions: JSON.stringify(permissions),
      status: status || "active",
      emailVerified: emailVerified || false,
      phoneVerified: phoneVerified || false,
      twoFactorEnabled: twoFactorEnabled || false,
      twoFactorSecret,
      lastLoginAt,
      lastLoginIp,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.info(`User created: ${userId}`);
    res.status(201).json({ success: true, data: { id: userId, email, username } });
  } catch (error) {
    logger.error("Failed to create user", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!Validator.isUUID(id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "phone",
      "address",
      "city",
      "state",
      "zip",
      "country",
      "avatar",
      "bio",
      "website",
      "timezone",
      "language",
      "preferences",
      "status",
    ];
    const filteredUpdates: any = {};

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    filteredUpdates.updatedAt = new Date();

    await db.update("users", filteredUpdates, { id });
    logger.info(`User updated: ${id}`);

    res.json({ success: true, data: { id, ...filteredUpdates } });
  } catch (error) {
    logger.error("Failed to update user", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!Validator.isUUID(id)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);
    logger.info(`User deleted: ${id}`);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete user", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// ============================================================================
// Product Management API - Section 2
// ============================================================================

export async function getProducts(req: Request, res: Response) {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      sort,
      order,
      minPrice,
      maxPrice,
      inStock,
      search,
    } = req.query;

    let query = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (minPrice) {
      query += " AND price >= ?";
      params.push(minPrice);
    }
    if (maxPrice) {
      query += " AND price <= ?";
      params.push(maxPrice);
    }
    if (inStock === "true") {
      query += " AND stock > 0";
    }
    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const sortField = sort || "createdAt";
    const sortOrder = order === "asc" ? "ASC" : "DESC";
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const offset = (Number(page) - 1) * Number(limit);
    query += " LIMIT ? OFFSET ?";
    params.push(Number(limit), offset);

    const products = await db.query(query, params);
    const total = await db.query("SELECT COUNT(*) as count FROM products");

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total.count,
        pages: Math.ceil(total.count / Number(limit)),
      },
    });
  } catch (error) {
    logger.error("Failed to get products", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    logger.error("Failed to get product", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const {
      name,
      description,
      price,
      category,
      sku,
      stock,
      weight,
      dimensions,
      images,
      tags,
      variants,
      attributes,
      metadata,
      seo,
      manufacturer,
      supplier,
      cost,
      taxClass,
      status,
      featured,
      onSale,
      salePrice,
      saleStartDate,
      saleEndDate,
    } = req.body;

    if (!name || !price || !category || !sku) {
      return res
        .status(400)
        .json({ success: false, error: "Name, price, category, and SKU are required" });
    }

    if (price < 0) {
      return res.status(400).json({ success: false, error: "Price cannot be negative" });
    }

    if (stock < 0) {
      return res.status(400).json({ success: false, error: "Stock cannot be negative" });
    }

    const existingSku = await db.query("SELECT id FROM products WHERE sku = ?", [sku]);
    if (existingSku) {
      return res.status(409).json({ success: false, error: "SKU already exists" });
    }

    const productId = await db.insert("products", {
      name,
      description,
      price,
      category,
      sku,
      stock: stock || 0,
      weight,
      dimensions: JSON.stringify(dimensions),
      images: JSON.stringify(images),
      tags: JSON.stringify(tags),
      variants: JSON.stringify(variants),
      attributes: JSON.stringify(attributes),
      metadata: JSON.stringify(metadata),
      seo: JSON.stringify(seo),
      manufacturer,
      supplier,
      cost,
      taxClass,
      status: status || "active",
      featured: featured || false,
      onSale: onSale || false,
      salePrice,
      saleStartDate,
      saleEndDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.info(`Product created: ${productId}`);
    res.status(201).json({ success: true, data: { id: productId, name, sku, price } });
  } catch (error) {
    logger.error("Failed to create product", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "stock",
      "weight",
      "images",
      "tags",
      "status",
      "featured",
      "onSale",
      "salePrice",
    ];
    const filteredUpdates: any = {};

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    filteredUpdates.updatedAt = new Date();
    await db.update("products", filteredUpdates, { id });

    logger.info(`Product updated: ${id}`);
    res.json({ success: true, data: { id, ...filteredUpdates } });
  } catch (error) {
    logger.error("Failed to update product", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    logger.info(`Product deleted: ${id}`);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete product", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// ============================================================================
// Order Management API - Section 3
// ============================================================================

export async function getOrders(req: Request, res: Response) {
  try {
    const { page = 1, limit = 20, status, userId, startDate, endDate } = req.query;

    let query = "SELECT * FROM orders WHERE 1=1";
    const params: any[] = [];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    if (userId) {
      query += " AND userId = ?";
      params.push(userId);
    }
    if (startDate) {
      query += " AND createdAt >= ?";
      params.push(startDate);
    }
    if (endDate) {
      query += " AND createdAt <= ?";
      params.push(endDate);
    }

    query += " ORDER BY createdAt DESC LIMIT ? OFFSET ?";
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), offset);

    const orders = await db.query(query, params);
    res.json({ success: true, data: orders });
  } catch (error) {
    logger.error("Failed to get orders", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const items = await db.query("SELECT * FROM order_items WHERE orderId = ?", [id]);
    order.items = items;

    res.json({ success: true, data: order });
  } catch (error) {
    logger.error("Failed to get order", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const {
      userId,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod,
      couponCode,
      notes,
    } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "User ID and items are required" });
    }

    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await db.query("SELECT id, price, stock FROM products WHERE id = ?", [
        item.productId,
      ]);
      if (!product) {
        return res
          .status(400)
          .json({ success: false, error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ success: false, error: `Insufficient stock for product ${item.productId}` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });

      // Update stock
      await db.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        item.quantity,
        item.productId,
      ]);
    }

    // Calculate totals
    const shippingCost = calculateShipping(subtotal, shippingMethod);
    const tax = subtotal * 0.08; // 8% tax
    let discount = 0;

    if (couponCode) {
      const coupon = await db.query("SELECT * FROM coupons WHERE code = ? AND active = true", [
        couponCode,
      ]);
      if (coupon && coupon.expiresAt > new Date()) {
        if (coupon.type === "percentage") {
          discount = subtotal * (coupon.value / 100);
        } else {
          discount = coupon.value;
        }
      }
    }

    const total = subtotal + shippingCost + tax - discount;

    // Create order
    const orderId = await db.insert("orders", {
      userId,
      status: "pending",
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      shippingAddress: JSON.stringify(shippingAddress),
      billingAddress: JSON.stringify(billingAddress),
      paymentMethod,
      shippingMethod,
      couponCode,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create order items
    for (const item of orderItems) {
      await db.insert("order_items", { ...item, orderId });
    }

    logger.info(`Order created: ${orderId}`);
    res.status(201).json({ success: true, data: { id: orderId, total, status: "pending" } });
  } catch (error) {
    logger.error("Failed to create order", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, trackingNumber, notes } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    await db.update("orders", { status, trackingNumber, notes, updatedAt: new Date() }, { id });
    logger.info(`Order ${id} status updated to ${status}`);

    res.json({ success: true, data: { id, status } });
  } catch (error) {
    logger.error("Failed to update order status", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function cancelOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await db.query("SELECT * FROM orders WHERE id = ?", [id]);

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (order.status === "delivered" || order.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, error: "Cannot cancel delivered or already cancelled order" });
    }

    // Restore stock
    const items = await db.query("SELECT * FROM order_items WHERE orderId = ?", [id]);
    for (const item of items) {
      await db.query("UPDATE products SET stock = stock + ? WHERE id = ?", [
        item.quantity,
        item.productId,
      ]);
    }

    await db.update("orders", { status: "cancelled", updatedAt: new Date() }, { id });
    logger.info(`Order cancelled: ${id}`);

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    logger.error("Failed to cancel order", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// ============================================================================
// Inventory Management API - Section 4
// ============================================================================

export async function getInventory(req: Request, res: Response) {
  try {
    const { productId, warehouseId, lowStock } = req.query;

    let query =
      "SELECT i.*, p.name as productName FROM inventory i JOIN products p ON i.productId = p.id WHERE 1=1";
    const params: any[] = [];

    if (productId) {
      query += " AND i.productId = ?";
      params.push(productId);
    }
    if (warehouseId) {
      query += " AND i.warehouseId = ?";
      params.push(warehouseId);
    }
    if (lowStock === "true") {
      query += " AND i.quantity <= i.reorderLevel";
    }

    const inventory = await db.query(query, params);
    res.json({ success: true, data: inventory });
  } catch (error) {
    logger.error("Failed to get inventory", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function updateInventory(req: Request, res: Response) {
  try {
    const { productId, warehouseId, quantity, reorderLevel, reorderQuantity } = req.body;

    const existing = await db.query(
      "SELECT * FROM inventory WHERE productId = ? AND warehouseId = ?",
      [productId, warehouseId],
    );

    if (existing) {
      await db.update(
        "inventory",
        { quantity, reorderLevel, reorderQuantity, updatedAt: new Date() },
        { productId, warehouseId },
      );
    } else {
      await db.insert("inventory", {
        productId,
        warehouseId,
        quantity,
        reorderLevel,
        reorderQuantity,
        updatedAt: new Date(),
      });
    }

    // Check if stock is low and needs reordering
    if (quantity <= reorderLevel) {
      await createReorderRequest(productId, warehouseId, reorderQuantity);
    }

    logger.info(`Inventory updated: ${productId} at warehouse ${warehouseId}`);
    res.json({ success: true, data: { productId, warehouseId, quantity } });
  } catch (error) {
    logger.error("Failed to update inventory", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getInventoryTransactions(req: Request, res: Response) {
  try {
    const { productId, type, startDate, endDate } = req.query;

    let query = "SELECT * FROM inventory_transactions WHERE 1=1";
    const params: any[] = [];

    if (productId) {
      query += " AND productId = ?";
      params.push(productId);
    }
    if (type) {
      query += " AND type = ?";
      params.push(type);
    }
    if (startDate) {
      query += " AND createdAt >= ?";
      params.push(startDate);
    }
    if (endDate) {
      query += " AND createdAt <= ?";
      params.push(endDate);
    }

    query += " ORDER BY createdAt DESC LIMIT 100";

    const transactions = await db.query(query, params);
    res.json({ success: true, data: transactions });
  } catch (error) {
    logger.error("Failed to get inventory transactions", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// ============================================================================
// Analytics & Reporting API - Section 5
// ============================================================================

export async function getSalesReport(req: Request, res: Response) {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;

    let dateFormat;
    switch (groupBy) {
      case "hour":
        dateFormat = "%Y-%m-%d %H:00:00";
        break;
      case "day":
        dateFormat = "%Y-%m-%d";
        break;
      case "week":
        dateFormat = "%Y-%u";
        break;
      case "month":
        dateFormat = "%Y-%m";
        break;
      default:
        dateFormat = "%Y-%m-%d";
    }

    const query = `
      SELECT 
        DATE_FORMAT(createdAt, '${dateFormat}') as period,
        COUNT(*) as orderCount,
        SUM(subtotal) as revenue,
        SUM(shippingCost) as shippingRevenue,
        SUM(tax) as taxCollected,
        SUM(discount) as discounts,
        SUM(total) as totalRevenue
      FROM orders 
      WHERE status IN ('delivered', 'shipped') 
      AND createdAt BETWEEN ? AND ?
      GROUP BY period
      ORDER BY period
    `;

    const report = await db.query(query, [startDate, endDate]);
    res.json({ success: true, data: report });
  } catch (error) {
    logger.error("Failed to get sales report", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getProductPerformance(req: Request, res: Response) {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    const query = `
      SELECT 
        p.id,
        p.name,
        p.sku,
        COUNT(oi.id) as timesOrdered,
        SUM(oi.quantity) as unitsSold,
        SUM(oi.total) as revenue,
        AVG(oi.price) as avgPrice
      FROM products p
      JOIN order_items oi ON p.id = oi.productId
      JOIN orders o ON oi.orderId = o.id
      WHERE o.status IN ('delivered', 'shipped')
      AND o.createdAt BETWEEN ? AND ?
      GROUP BY p.id, p.name, p.sku
      ORDER BY unitsSold DESC
      LIMIT ?
    `;

    const performance = await db.query(query, [startDate, endDate, Number(limit)]);
    res.json({ success: true, data: performance });
  } catch (error) {
    logger.error("Failed to get product performance", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getCustomerAnalytics(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;

    const totalCustomers = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE createdAt BETWEEN ? AND ?",
      [startDate, endDate],
    );
    const activeCustomers = await db.query(
      "SELECT COUNT(DISTINCT userId) as count FROM orders WHERE createdAt BETWEEN ? AND ?",
      [startDate, endDate],
    );
    const avgOrderValue = await db.query(
      "SELECT AVG(total) as avg FROM orders WHERE createdAt BETWEEN ? AND ?",
      [startDate, endDate],
    );
    const totalRevenue = await db.query(
      "SELECT SUM(total) as total FROM orders WHERE createdAt BETWEEN ? AND ?",
      [startDate, endDate],
    );

    res.json({
      success: true,
      data: {
        totalCustomers: totalCustomers.count,
        activeCustomers: activeCustomers.count,
        averageOrderValue: avgOrderValue.avg || 0,
        totalRevenue: totalRevenue.total || 0,
      },
    });
  } catch (error) {
    logger.error("Failed to get customer analytics", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function hashPassword(password: string): Promise<string> {
  // Placeholder for password hashing
  return Promise.resolve(`hashed_${password}`);
}

function calculateShipping(subtotal: number, method: string): number {
  const rates: { [key: string]: number } = {
    standard: 5.99,
    express: 15.99,
    overnight: 29.99,
    free: 0,
  };

  if (subtotal > 50 && method === "standard") {
    return 0; // Free shipping on orders over $50
  }

  return rates[method] || rates.standard;
}

async function createReorderRequest(
  productId: string,
  warehouseId: string,
  quantity: number,
): Promise<void> {
  await db.insert("reorder_requests", {
    productId,
    warehouseId,
    quantity,
    status: "pending",
    createdAt: new Date(),
  });
  logger.info(`Reorder request created for product ${productId}`);
}

// ============================================================================
// Export all handlers
// ============================================================================

export default {
  // User management
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  // Product management
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,

  // Order management
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,

  // Inventory management
  getInventory,
  updateInventory,
  getInventoryTransactions,

  // Analytics
  getSalesReport,
  getProductPerformance,
  getCustomerAnalytics,
};
