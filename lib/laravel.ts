import axios, { type AxiosRequestConfig, type Method } from 'axios';
import { cookies } from 'next/headers';

export function laravelBaseUrl(): string {
  return process.env.LARAVEL_API_URL || 'http://127.0.0.1:8000';
}

export function getAuthToken(): string | undefined {
  return cookies().get('auth_token')?.value;
}

export async function laravelRequest<T = unknown>(
  method: Method,
  path: string,
  options: {
    data?: unknown;
    auth?: boolean;
  } = {}
) {
  const { data, auth = false } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getAuthToken();
    if (!token) {
      const err = new Error('Unauthenticated') as Error & { status?: number };
      err.status = 401;
      throw err;
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const config: AxiosRequestConfig = {
    method,
    url: `${laravelBaseUrl()}${path}`,
    headers,
    data,
    validateStatus: () => true,
  };

  const response = await axios.request<T>(config);
  return response;
}

export function laravelErrorMessage(data: unknown, fallback = 'Request failed'): string {
  if (!data || typeof data !== 'object') return fallback;
  const obj = data as Record<string, unknown>;
  if (obj.errors && typeof obj.errors === 'object') {
    const first = Object.values(obj.errors as Record<string, string[]>)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  if (typeof obj.message === 'string' && obj.message) return obj.message;
  return fallback;
}
