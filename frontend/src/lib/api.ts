const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ApiError {
  error: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role_id: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Unknown Error',
        message: 'An unexpected error occurred',
      }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signup(data: SignupRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<UserResponse> {
    return this.request<UserResponse>('/users/me', {
      method: 'GET',
    });
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return this.request<UserResponse[]>('/users/all', {
      method: 'GET',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
