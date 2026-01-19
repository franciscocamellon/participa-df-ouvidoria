// Import from the canonical apiService location for consistency
import { API_BASE_URL } from "./apiService";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean; // API may ignore it; kept for UI compatibility
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  phoneE164: string;
  password: string;
}

export interface ResetPasswordCredentials {
  token: string;
  password: string;
}

export type UserRole = "CUSTOMER" | "ADMIN" | "AGENT" | string;
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | string;

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phoneE164?: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: "Bearer" | string;
  expiresIn: number;
  user: AuthUser;
}

type ApiErrorShape = {
  message?: string;
  errors?: any;
};

class AuthService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    const data = isJson
        ? await response.json().catch(() => null)
        : await response.text().catch(() => null);

    if (!response.ok) {
      const err = (data ?? {}) as ApiErrorShape;

      throw {
        message: err?.message || `Request failed (${response.status})`,
        errors: err?.errors,
        status: response.status,
      };
    }

    return data as T;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // API expects: { email, password }
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };

    return this.request<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // NOTE: these endpoints were in your previous mock service.
  // Keep them here only if/when your backend provides them.
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: ResetPasswordCredentials): Promise<{ message: string }> {
    return this.request<{ message: string }>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getSocialLoginUrl(provider: "google" | "github" | "govbr"): Promise<{ url: string }> {
    return this.request<{ url: string }>(`/api/v1/auth/social/${provider}`, {
      method: "GET",
    });
  }
}

export const authService = new AuthService();
