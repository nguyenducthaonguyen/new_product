'use server';

import { cache } from 'react';
import { headers } from 'next/headers';

import type { LoginFormData } from '@/entities/user';
import { setAuthTokens } from '@/lib/auth-cookies';
import { httpClient } from '@/lib/http-client';

const API_BASE = '/api/v1/auth';

export async function login(data: LoginFormData) {
  try {
    // Backend now accepts JSON body
    const response = await httpClient.post<{
      token_type: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
      refresh_expires_in: number;
      id: number;
      username: string;
      role: string;
    }>(`${API_BASE}/login`, {
      username: data.username,
      password: data.password,
    });

    // Backend returns { status_code: 200, message: "Success", data: {...} }
    // httpClient extracts responseData.data and puts it in response.data
    // So response.data = { token_type, access_token, refresh_token, expires_in, refresh_expires_in, id, username, role }
    // httpClient already handles HTTP status, so if we get here, it's a successful response

    // Check if we have the access_token in response.data
    const loginData = response.data as {
      token_type?: string;
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      refresh_expires_in?: number;
      id?: number;
      username?: string;
      role?: string;
    };

    if (loginData && loginData.access_token) {
      // Store authentication tokens in cookies
      await setAuthTokens({
        access_token: loginData.access_token,
        refresh_token: loginData.refresh_token,
        expires_in: loginData.expires_in,
        refresh_expires_in: loginData.refresh_expires_in,
      });

      // Fetch user info after login
      let userData = null;
      try {
        const userResponse = await httpClient.get<{
          id: number;
          username: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          address: string | null;
          avatar: string | null;
          role: string;
          status: boolean;
          created_at: string;
          updated_at: string;
        }>(`${API_BASE}/me`, {
          headers: {
            Authorization: `Bearer ${loginData.access_token}`,
          },
        });

        if (userResponse.data) {
          userData = userResponse.data;
        }
      } catch (error) {
        // If fetching user fails, continue with redirect anyway
        // User will be fetched on next page load
        console.error('Failed to fetch user after login:', error);
      }

      // Get redirect URL from headers or default to home
      const headersList = await headers();
      const referer = headersList.get('referer');
      // Don't redirect back to login page
      const redirectUrl = referer && !referer.includes('/login')
        ? new URL(referer).pathname
        : '/';

      // Return success with user data and redirect URL
      // Client will handle redirect and save to Zustand
      return {
        success: true,
        message: 'Login successful',
        data: userData,
        redirectUrl,
      };
    }

    return {
      success: false,
      message: 'Username hoặc mật khẩu không chính xác',
    };
  } catch (error: any) {
    // Check if this is a Next.js redirect (should not be caught)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error; // Re-throw redirect errors
    }

    // Handle specific error cases
    if (error?.status === 401) {
      const errorMessage = error?.data?.detail || 'Username hoặc mật khẩu không chính xác';
      return {
        success: false,
        message: errorMessage,
      };
    }

    if (error?.status === 403) {
      return {
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa',
      };
    }

    return {
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại',
    };
  }
}

/**
 * Get current user with React cache to prevent multiple API calls in the same request
 * This will cache the result for the duration of a single request
 */
export const getCurrentUser = cache(async () => {
  try {
    const { getAccessToken } = await import('@/lib/auth-cookies');
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        data: null,
        error: 'Not authenticated',
      };
    }

    const response = await httpClient.get<{
      id: number;
      username: string;
      email: string | null;
      full_name: string | null;
      phone: string | null;
      address: string | null;
      avatar: string | null;
      role: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    }>(`${API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if we have data (backend returns { status_code: 200, message: "Success", data: {...} })
    if (response.data) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      data: null,
      error: response.message || 'Failed to fetch user',
    };
  } catch (error: any) {
    if (error?.status === 401) {
      return {
        success: false,
        data: null,
        error: 'Not authenticated',
      };
    }

    return {
      success: false,
      data: null,
      error: error?.message || 'Failed to fetch user',
    };
  }
});
