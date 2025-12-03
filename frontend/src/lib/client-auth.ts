'use client';

import type { UserResponse } from '@/entities/user';
import { useUserStore } from '@/stores/user-store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

/**
 * Get access token from browser cookies
 */
function getAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      return value || null;
    }
  }
  return null;
}

/**
 * Fetch current user info from /api/v1/auth/me
 * This will check Zustand store first, and only call API if not found
 */
export async function fetchCurrentUser(): Promise<{
  success: boolean;
  data: UserResponse | null;
  error?: string;
}> {
  // Check Zustand store first (client-side only)
  if (typeof window !== 'undefined') {
    const userStore = useUserStore.getState();
    if (userStore.user) {
      // Check if we still have access token (user might have logged out)
      const accessToken = getAccessTokenFromCookie();
      if (accessToken) {
        // User exists in store and we have token, return cached user
        return {
          success: true,
          data: userStore.user,
        };
      } else {
        // No token but user in store - clear it
        userStore.clearUser();
      }
    }
  }

  // If not in store or no token, fetch from API
  try {
    const accessToken = getAccessTokenFromCookie();

    if (!accessToken) {
      return { success: false, data: null, error: 'Not authenticated' };
    }

    const response = await fetch(`${API_BASE}/v1/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid -> clear cookie and store
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        if (typeof window !== 'undefined') {
          useUserStore.getState().clearUser();
        }
      }
      return { success: false, data: null, error: `HTTP ${response.status}` };
    }

    const result = await response.json();

    if (result.data) {
      const userData = result.data as UserResponse;
      // Save to Zustand store
      if (typeof window !== 'undefined') {
        useUserStore.getState().setUser(userData);
      }
      return { success: true, data: userData };
    }

    return { success: false, data: null, error: result.message || 'Failed to fetch user' };
  } catch (error: any) {
    return { success: false, data: null, error: error?.message || 'Network error' };
  }
}
