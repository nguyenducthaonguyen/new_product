export const AUTH_STORAGE_KEY = {
  ACCESS_TOKEN: 'access_token', // Match backend cookie name
  REFRESH_TOKEN: 'refresh_token', // Match backend cookie name
  TOKEN_TYPE: 'auth.token_type',
  EXPIRES_AT: 'auth.expires_at',
} as const;
