'use server';

import { cookies } from 'next/headers';
import { AUTH_STORAGE_KEY } from '@/config/storage';

export type AuthTokens = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
};

export async function setAuthTokens(tokens: AuthTokens): Promise<void> {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === 'production';

  cookieStore.set(AUTH_STORAGE_KEY.ACCESS_TOKEN, tokens.access_token, {
    httpOnly: true,
    secure,
    sameSite: 'strict',
    expires: new Date(Date.now() + (tokens.expires_in || 900) * 1000),
    path: '/',
  });

  if (tokens.refresh_token) {
    cookieStore.set(AUTH_STORAGE_KEY.REFRESH_TOKEN, tokens.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      expires: new Date(Date.now() + (tokens.refresh_expires_in || 7 * 24 * 3600) * 1000),
      path: '/',
    });
  }
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_STORAGE_KEY.ACCESS_TOKEN)?.value || null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_STORAGE_KEY.REFRESH_TOKEN)?.value || null;
}

export async function getAuthTokens(): Promise<{
  access_token: string;
  refresh_token: string | null;
} | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }
  const refreshToken = await getRefreshToken();
  return { access_token: accessToken, refresh_token: refreshToken };
}

export async function clearAuthTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_STORAGE_KEY.ACCESS_TOKEN);
  cookieStore.delete(AUTH_STORAGE_KEY.REFRESH_TOKEN);
}

export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await getAccessToken();
  return accessToken !== null;
}
