'use server';

import { cookies } from 'next/headers';
import { getRefreshToken, setAuthTokens } from '@/lib/auth-cookies';
import { httpClient } from '@/lib/http-client';

const API_BASE = '/api/v1/auth';

/**
 * Refresh access token using refresh token
 * This is a server action that can be called from server components/actions
 */
export async function refreshAccessToken(): Promise<{
  success: boolean;
  access_token?: string;
  expires_in?: number;
  error?: string;
}> {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
      };
    }

    // Call backend refresh endpoint
    // Backend reads refresh_token from cookie automatically
    // We need to use fetch directly to include cookies
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get('refresh_token')?.value || refreshToken;

    if (!refreshTokenCookie) {
      return {
        success: false,
        error: 'No refresh token in cookies',
      };
    }

    // Use fetch directly to ensure cookies are sent
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    const response = await fetch(`${baseUrl}${API_BASE}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData?.detail || `HTTP ${response.status}`,
      };
    }

    const responseData = await response.json();

    // Backend returns { status_code: 200, message: "...", data: { access_token, ... } }
    // Backend also sets access_token in cookie automatically
    if (responseData?.status_code === 200 && responseData?.data?.access_token) {
      const { access_token, expires_in } = responseData.data;

      // Update our cookie to match backend (using same cookie name as backend)
      const cookieStore = await cookies();
      cookieStore.set('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expires_in || 900,
        path: '/',
      });

      return {
        success: true,
        access_token,
        expires_in,
      };
    }

    return {
      success: false,
      error: 'Failed to refresh token',
    };
  } catch (error: any) {
    console.error('Error refreshing token:', error);
    return {
      success: false,
      error: error?.message || 'Failed to refresh token',
    };
  }
}

