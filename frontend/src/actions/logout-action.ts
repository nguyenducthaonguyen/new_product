'use server';

import { redirect } from 'next/navigation';
import { clearAuthTokens } from '@/lib/auth-cookies';
import { httpClient } from '@/lib/http-client';

const API_BASE = '/api/v1/auth';

export async function logout(allDevices = false): Promise<void> {
  try {
    const endpoint = allDevices ? `${API_BASE}/logout/all` : `${API_BASE}/logout`;
    await httpClient.post(endpoint, {});
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('[Logout] Error calling logout API:', error);
  } finally {
    // Always clear cookies
    await clearAuthTokens();
    // Redirect to home
    redirect('/');
  }
}
