/**
 * User Authentication Service
 * Handles user login, registration, and session management
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Session } from "../models/Session";
import { User } from "../models/User";
import { AuditLog } from "../services/AuditLog";

const SALT_ROUNDS = 12;
const JWT_EXPIRY = "24h";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  requires2FA?: boolean;
}

interface RegistrationData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  acceptTerms: boolean;
  marketingConsent?: boolean;
}

export class AuthenticationService {
  private auditLog: AuditLog;
  private failedAttempts: Map<string, number>;
  private lockoutTimers: Map<string, Date>;

  constructor() {
    this.auditLog = new AuditLog();
    this.failedAttempts = new Map();
    this.lockoutTimers = new Map();
  }

  /**
   * Register a new user account
   */
  async register(data: RegistrationData): Promise<AuthResult> {
    try {
      // Validate input
      if (!data.email || !data.password || !data.username) {
        return { success: false, error: "Missing required fields" };
      }

      if (!data.acceptTerms) {
        return { success: false, error: "Terms must be accepted" };
      }

      // Check password strength
      if (data.password.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
      }

      if (!/[A-Z]/.test(data.password)) {
        return { success: false, error: "Password must contain uppercase letter" };
      }

      if (!/[a-z]/.test(data.password)) {
        return { success: false, error: "Password must contain lowercase letter" };
      }

      if (!/[0-9]/.test(data.password)) {
        return { success: false, error: "Password must contain number" };
      }

      if (!/[!@#$%^&*]/.test(data.password)) {
        return { success: false, error: "Password must contain special character" };
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email: data.email });
      if (existingEmail) {
        return { success: false, error: "Email already registered" };
      }

      // Check if username already exists
      const existingUsername = await User.findOne({ username: data.username });
      if (existingUsername) {
        return { success: false, error: "Username already taken" };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

      // Create user
      const user = new User({
        email: data.email,
        passwordHash: hashedPassword,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        marketingConsent: data.marketingConsent || false,
        createdAt: new Date(),
        lastLogin: null,
        isActive: true,
        emailVerified: false,
        twoFactorEnabled: false,
        loginAttempts: 0,
        lockedUntil: null,
      });

      await user.save();

      // Send verification email
      await this.sendVerificationEmail(user);

      // Log registration
      await this.auditLog.log({
        action: "USER_REGISTERED",
        userId: user.id,
        details: { email: data.email, username: data.username },
        timestamp: new Date(),
        ipAddress: null,
      });

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        user: this.sanitizeUser(user),
        token,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Registration failed" };
    }
  }

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string, ipAddress: string): Promise<AuthResult> {
    try {
      // Check if account is locked
      if (this.isAccountLocked(email)) {
        return { success: false, error: "Account temporarily locked. Please try again later." };
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        await this.recordFailedAttempt(email);
        return { success: false, error: "Invalid credentials" };
      }

      if (!user.isActive) {
        return { success: false, error: "Account deactivated" };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        await this.recordFailedAttempt(email);
        await this.auditLog.log({
          action: "LOGIN_FAILED",
          userId: user.id,
          details: { reason: "invalid_password", email },
          timestamp: new Date(),
          ipAddress,
        });
        return { success: false, error: "Invalid credentials" };
      }

      // Check if 2FA is required
      if (user.twoFactorEnabled) {
        return {
          success: true,
          requires2FA: true,
          user: this.sanitizeUser(user),
        };
      }

      // Reset failed attempts
      this.resetFailedAttempts(email);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Create session
      await this.createSession(user, ipAddress);

      // Log successful login
      await this.auditLog.log({
        action: "LOGIN_SUCCESS",
        userId: user.id,
        details: { email },
        timestamp: new Date(),
        ipAddress,
      });

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        user: this.sanitizeUser(user),
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    }
  }

  /**
   * Verify 2FA token and complete login
   */
  async verify2FA(userId: string, token: string, ipAddress: string): Promise<AuthResult> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      // Verify TOTP token
      const isValid = this.verifyTOTP(user.twoFactorSecret, token);
      if (!isValid) {
        await this.auditLog.log({
          action: "2FA_FAILED",
          userId: user.id,
          details: { reason: "invalid_token" },
          timestamp: new Date(),
          ipAddress,
        });
        return { success: false, error: "Invalid 2FA code" };
      }

      // Reset failed attempts
      this.resetFailedAttempts(user.email);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Create session
      await this.createSession(user, ipAddress);

      // Log successful login
      await this.auditLog.log({
        action: "LOGIN_2FA_SUCCESS",
        userId: user.id,
        details: { email: user.email },
        timestamp: new Date(),
        ipAddress,
      });

      // Generate token
      const authToken = this.generateToken(user);

      return {
        success: true,
        user: this.sanitizeUser(user),
        token: authToken,
      };
    } catch (error) {
      console.error("2FA verification error:", error);
      return { success: false, error: "2FA verification failed" };
    }
  }

  /**
   * Logout user and invalidate session
   */
  async logout(userId: string, token: string): Promise<boolean> {
    try {
      await Session.deleteOne({ userId, token });

      await this.auditLog.log({
        action: "LOGOUT",
        userId,
        details: {},
        timestamp: new Date(),
        ipAddress: null,
      });

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(oldToken: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(oldToken, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        return { success: false, error: "Invalid token" };
      }

      const newToken = this.generateToken(user);

      return {
        success: true,
        user: this.sanitizeUser(user),
        token: newToken,
      };
    } catch (error) {
      return { success: false, error: "Token refresh failed" };
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthResult> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return { success: false, error: "Current password is incorrect" };
      }

      // Validate new password
      if (newPassword.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
      }

      // Hash and save new password
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      user.passwordHash = hashedPassword;
      await user.save();

      // Invalidate all existing sessions
      await Session.deleteMany({ userId });

      // Log password change
      await this.auditLog.log({
        action: "PASSWORD_CHANGED",
        userId,
        details: {},
        timestamp: new Date(),
        ipAddress: null,
      });

      // Generate new token
      const token = this.generateToken(user);

      return {
        success: true,
        user: this.sanitizeUser(user),
        token,
      };
    } catch (error) {
      console.error("Password change error:", error);
      return { success: false, error: "Password change failed" };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists
        return true;
      }

      // Generate reset token
      const resetToken = this.generateResetToken();
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      // Send reset email
      await this.sendPasswordResetEmail(user, resetToken);

      await this.auditLog.log({
        action: "PASSWORD_RESET_REQUESTED",
        userId: user.id,
        details: { email },
        timestamp: new Date(),
        ipAddress: null,
      });

      return true;
    } catch (error) {
      console.error("Password reset request error:", error);
      return false;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<AuthResult> {
    try {
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!user) {
        return { success: false, error: "Invalid or expired reset token" };
      }

      // Validate new password
      if (newPassword.length < 8) {
        return { success: false, error: "Password must be at least 8 characters" };
      }

      // Hash and save new password
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      user.passwordHash = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      // Invalidate all sessions
      await Session.deleteMany({ userId: user.id });

      // Log password reset
      await this.auditLog.log({
        action: "PASSWORD_RESET_COMPLETED",
        userId: user.id,
        details: {},
        timestamp: new Date(),
        ipAddress: null,
      });

      // Generate new token
      const authToken = this.generateToken(user);

      return {
        success: true,
        user: this.sanitizeUser(user),
        token: authToken,
      };
    } catch (error) {
      console.error("Password reset error:", error);
      return { success: false, error: "Password reset failed" };
    }
  }

  // Helper methods
  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET!,
      { expiresIn: JWT_EXPIRY },
    );
  }

  private generateResetToken(): string {
    return [...Array(32)].map(() => Math.random().toString(36)[2]).join("");
  }

  private sanitizeUser(user: User): Partial<User> {
    const { passwordHash, passwordResetToken, twoFactorSecret, ...sanitized } = user.toObject();
    return sanitized;
  }

  private async createSession(user: User, ipAddress: string): Promise<void> {
    const session = new Session({
      userId: user.id,
      token: this.generateToken(user),
      ipAddress,
      userAgent: null,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
    await session.save();
  }

  private async recordFailedAttempt(email: string): Promise<void> {
    const attempts = (this.failedAttempts.get(email) || 0) + 1;
    this.failedAttempts.set(email, attempts);

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      this.lockoutTimers.set(email, new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60000));
    }
  }

  private resetFailedAttempts(email: string): void {
    this.failedAttempts.delete(email);
    this.lockoutTimers.delete(email);
  }

  private isAccountLocked(email: string): boolean {
    const lockoutTime = this.lockoutTimers.get(email);
    if (!lockoutTime) return false;

    if (new Date() > lockoutTime) {
      this.resetFailedAttempts(email);
      return false;
    }

    return true;
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    // Implementation for sending verification email
    console.log(`Sending verification email to ${user.email}`);
  }

  private async sendPasswordResetEmail(user: User, token: string): Promise<void> {
    // Implementation for sending password reset email
    console.log(`Sending password reset email to ${user.email} with token ${token}`);
  }

  private verifyTOTP(secret: string, token: string): boolean {
    // Implementation for TOTP verification
    return true; // Placeholder
  }
}

export default AuthenticationService;
