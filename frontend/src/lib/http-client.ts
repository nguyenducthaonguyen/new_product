/**
 * API utility for handling HTTP requests with common response and error handling
 */
import type { ApiResponse } from '@/types/api';
import { Logger } from './logger';

const logger = Logger.create('HttpClient');

// Error types for different scenarios
export class ApiError extends Error {
  status: number;
  response?: Response;
  data?: any;

  constructor(message: string, status: number, response?: Response, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
    this.data = data;
  }
}

export const RESPONSE_TYPES = {
  JSON: 'json',
  TEXT: 'text',
  BLOB: 'blob',
  ARRAY_BUFFER: 'arrayBuffer',
  FORM_DATA: 'formData',
} as const;

// Response types for different content handling
export type ResponseType = (typeof RESPONSE_TYPES)[keyof typeof RESPONSE_TYPES];

// Request configuration interface
export type RequestConfig = {
  timeout?: number;
  baseURL?: string;
  params?: Record<string, any>;
  responseType?: ResponseType;
} & RequestInit;

// Default configuration
const DEFAULT_CONFIG: RequestConfig = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Base URL configuration - can be overridden via environment variables
// Backend API is at /api/v1, so we need to include /api in the base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

/**
 * Creates a timeout promise that rejects after the specified time
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeout);
  });
}

/**
 * Safely parses response based on content length and response type
 */
async function parseResponse<T>(response: Response, responseType?: ResponseType): Promise<T | null> {
  switch (responseType) {
    case RESPONSE_TYPES.JSON:
      return await response.json() as T;
    case RESPONSE_TYPES.TEXT:
      return await response.text() as T;
    case RESPONSE_TYPES.BLOB:
      return await response.blob() as T;
    case RESPONSE_TYPES.ARRAY_BUFFER:
      return await response.arrayBuffer() as T;
    case RESPONSE_TYPES.FORM_DATA:
      return await response.formData() as T;
    default:
      return null;
  }
}

/**
 * Converts an object to URL search parameters
 */
function objectToParams(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return params.toString();
}

/**
 * Main HTTP client class
 */
export class HttpClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string = BASE_URL, defaultHeaders: HeadersInit = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  /**
   * Makes an HTTP request with common error handling
   * Automatically handles 401 errors by refreshing token and retrying
   */
  private async request<T>(endpoint: string, config: RequestConfig = {}, retryCount = 0): Promise<ApiResponse<T>> {
    const {
      timeout = DEFAULT_CONFIG.timeout,
      baseURL = this.baseURL,
      params,
      headers = {},
      responseType = 'json',
      ...fetchConfig
    } = config;

    // Build URL with parameters
    let url = new URL(endpoint, baseURL).href;
    if (params) {
      const paramString = objectToParams(params);
      url += `?${paramString}`;
    }

    logger.info(`Request: ${fetchConfig.method || 'GET'} ${url}`);

    // Merge headers
    const mergedHeaders = {
      ...DEFAULT_CONFIG.headers,
      ...this.defaultHeaders,
      ...headers,
    };

    // Create fetch promise
    const fetchPromise = fetch(url, {
      ...fetchConfig,
      headers: mergedHeaders,
      credentials: 'include', // Include cookies for refresh token
    });

    // Create timeout promise
    const timeoutPromise = createTimeoutPromise(timeout!);

    try {
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Handle non-Response (timeout case)
      if (!(response instanceof Response)) {
        throw new ApiError('Request timeout', 408);
      }

      // Parse response using the safe parser
      let responseData: any;
      try {
        responseData = await parseResponse(response, responseType);
      } catch (parseError) {
        // If parsing fails, handle gracefully
        logger.error('Response parsing error', parseError);
        responseData = null;
      }

      // Handle 401 Unauthorized - Try to refresh token and retry
      if (response.status === 401 && retryCount === 0) {
        // Skip refresh for auth endpoints (login, refresh, register)
        const isAuthEndpoint = endpoint.includes('/auth/login')
          || endpoint.includes('/auth/refresh')
          || endpoint.includes('/auth/register');

        if (!isAuthEndpoint) {
          logger.info('Access token expired, attempting to refresh...');
          try {
            // Import refresh function dynamically to avoid circular dependencies
            const { refreshAccessToken } = await import('@/actions/refresh-action');
            const refreshResult = await refreshAccessToken();

            if (refreshResult.success && refreshResult.access_token) {
              logger.info('Token refreshed successfully, retrying request...');
              // Get new access token from cookies (backend sets it)
              const { getAccessToken } = await import('@/lib/auth-cookies');
              const newAccessToken = await getAccessToken();

              if (newAccessToken) {
                // Retry the request with new token (recursive call with retryCount = 1)
                return this.request<T>(endpoint, {
                  ...config,
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                }, 1); // Set retryCount to 1 to prevent infinite loop
              }
            } else {
              logger.error('Failed to refresh token:', refreshResult.error);
              // Fall through to throw 401 error
            }
          } catch (refreshError) {
            logger.error('Error during token refresh:', refreshError);
            // Fall through to throw 401 error
          }
        }
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = responseData?.message || responseData?.error || `HTTP ${response.status}`;
        throw new ApiError(errorMessage, response.status, response, responseData);
      }

      // Return successful response
      // Backend returns { status_code: 200, message: "...", data: {...} }
      // So we check status_code or response.ok to determine success
      const isSuccess = responseData?.status_code === 200 || response.ok;
      return {
        success: isSuccess,
        message: responseData?.message,
        data: responseData?.data,
        meta: responseData?.meta,
        raw: response,
      };
    } catch (error) {
      // Handle network errors and API errors
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network/fetch errors
      if (error instanceof TypeError) {
        throw new ApiError('Network error', 0, undefined, error);
      }

      // Handle other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        undefined,
        error,
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    // Check if Content-Type is form-urlencoded
    const headers = config.headers || {};
    const defaultHeaders = DEFAULT_CONFIG.headers || {};
    const contentType = (headers as Record<string, string>)['Content-Type']
      || (headers as Record<string, string>)['content-type']
      || (defaultHeaders as Record<string, string>)['Content-Type'];

    // If Content-Type is form-urlencoded and data is a string, use it directly
    // Otherwise, stringify JSON data
    let body: string | undefined;
    if (data) {
      if (contentType?.includes('application/x-www-form-urlencoded') && typeof data === 'string') {
        body = data; // Already form-urlencoded string
      } else {
        body = JSON.stringify(data);
      }
    }

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Set default headers
   */
  setDefaultHeaders(headers: HeadersInit) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set authorization token
   */
  setAuthToken(tokenType: string, token: string) {
    this.setDefaultHeaders({ Authorization: `${tokenType} ${token}` });
  }

  /**
   * Remove authorization token
   */
  removeAuthToken() {
    const headers = { ...this.defaultHeaders };
    delete (headers as any).Authorization;
    this.defaultHeaders = headers;
  }
}

export const httpClient = new HttpClient();
