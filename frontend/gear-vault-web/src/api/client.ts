import { OpenAPI } from '@/api/generated/client';
import type { ProfileDto } from '@/api/generated/client';
import type { Role, User } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5165';
const AUTH_TOKEN_KEY = 'gv-auth-token';

export const configureApiClient = () => {
  OpenAPI.BASE = API_BASE_URL;
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.TOKEN = async () => localStorage.getItem(AUTH_TOKEN_KEY) ?? '';
};

export const setAuthToken = (token: string | null) => {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const roleFromApi = (roleName?: string | null): Role => {
  const normalized = roleName?.trim().toLowerCase();
  if (normalized === 'super admin' || normalized === 'super-admin' || normalized === 'admin') {
    return 'super-admin';
  }
  if (normalized === 'staff' || normalized === 'customer') {
    return normalized;
  }
  return 'customer';
};

export const mapProfileToUser = (profile: ProfileDto): User => ({
  id: profile.id ?? '',
  name: profile.name ?? profile.username ?? 'User',
  email: profile.emailAddress ?? '',
  role: roleFromApi(profile.role?.name),
  avatar: profile.profileImage?.fileUrl ?? undefined,
  phone: profile.phoneNumber ?? undefined,
});

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong') => {
  if (error && typeof error === 'object') {
    const body = 'body' in error ? (error as { body?: unknown }).body : undefined;
    if (body && typeof body === 'object') {
      const message = 'message' in body ? (body as { message?: unknown }).message : undefined;
      if (typeof message === 'string' && message.trim()) return message;
    }
    const message = 'message' in error ? (error as { message?: unknown }).message : undefined;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
};

type ApiResponse<T> = {
  result?: T | null;
};

export const unwrapApiResult = <T>(value: T | ApiResponse<T> | null | undefined, fallback: T): T => {
  if (value && typeof value === 'object' && 'result' in value) {
    return (value as ApiResponse<T>).result ?? fallback;
  }
  return value ?? fallback;
};
