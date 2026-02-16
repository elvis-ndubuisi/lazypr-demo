/**
 * API Client Module
 * References: AUTH-456, LINEAR-001, #789, PROJ-123
 */

import axios from "axios";

// AUTH-456: Implement OAuth2 flow
export class OAuthClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private tokenEndpoint: string;

  constructor(config: OAuthConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.tokenEndpoint = config.tokenEndpoint;
  }

  // LINEAR-001: Add PKCE support
  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await axios.post(this.tokenEndpoint, {
      grant_type: "authorization_code",
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code_verifier: codeVerifier,
    });
    return response.data;
  }

  // #789: Refresh token rotation
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await axios.post(this.tokenEndpoint, {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });
    return response.data;
  }
}

// PROJ-123: API rate limiting
export class RateLimitedClient {
  private baseUrl: string;
  private rateLimit: number;
  private tokens: number;
  private lastRefill: number;

  constructor(baseUrl: string, rateLimit = 100) {
    this.baseUrl = baseUrl;
    this.rateLimit = rateLimit;
    this.tokens = rateLimit;
    this.lastRefill = Date.now();
  }

  async request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    this.checkRateLimit();

    if (this.tokens <= 0) {
      throw new Error("Rate limit exceeded");
    }

    this.tokens--;
    const response = await axios.get(`${this.baseUrl}${endpoint}`, options);
    return response.data;
  }

  private checkRateLimit(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;

    // Refill tokens every minute
    if (elapsed >= 60000) {
      this.tokens = this.rateLimit;
      this.lastRefill = now;
    }
  }
}

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tokenEndpoint: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export default { OAuthClient, RateLimitedClient };
