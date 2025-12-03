'use server';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';

import type { AddToCartRequest, Cart, SimpleCart, UpdateCartItemRequest } from '@/entities/cart';
import { CartSchema, SimpleCartSchema } from '@/entities/cart';
import { httpClient } from '@/lib/http-client';

// Backend API base is already /api, so we use /v1/cart
const API_BASE = '/api/v1/cart';

async function getSessionId(): Promise<string | undefined> {
  // Get session ID from cookies for guest carts
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value || cookieStore.get('X-Session-ID')?.value;

  // If no session ID, generate one and set it (for guest carts)
  if (!sessionId) {
    sessionId = randomUUID();
    // Set session_id cookie (valid for 30 days)
    cookieStore.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
  }

  return sessionId;
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  // Try different possible cookie names
  const token
    = cookieStore.get('access_token')?.value
      || cookieStore.get('ACCESS_TOKEN')?.value;
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Get or generate session ID for guest carts
  const sessionId = await getSessionId();
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }

  return headers;
}

export async function getCart() {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        cart_id: 'cart_abc',
        total_items: 0,
        total_price: 0,
        items: [],
      } as Cart,
    };
  }

  try {
    const headers = await getAuthHeaders();
    const response = await httpClient.get<Cart>(API_BASE, {
      headers,
    });

    if (response.success && response.data) {
      const validatedData = CartSchema.parse(response.data);
      return {
        success: true,
        data: validatedData,
      };
    }

    // Return empty cart if no data
    return {
      success: true,
      data: {
        cart_id: '',
        total_items: 0,
        total_price: 0,
        items: [],
      } as Cart,
    };
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    // Return empty cart on error (cart endpoint should always return success)
    return {
      success: true,
      data: {
        cart_id: '',
        total_items: 0,
        total_price: 0,
        items: [],
      } as Cart,
    };
  }
}

export async function addToCart(request: AddToCartRequest) {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'Item added to cart',
      data: {
        cart_id: 'cart_abc',
        total_items: 1,
        total_price: 120.0,
        items: [
          {
            itemId: 'item_1',
            sku: request.sku,
            quantity: request.quantity,
            price: 120.0,
          },
        ],
      } as Cart,
    };
  }

  try {
    const headers = await getAuthHeaders();
    // POST /items returns SimpleCartResponse (without items array)
    const response = await httpClient.post<SimpleCart>(`${API_BASE}/items`, request, {
      headers,
    });

    if (response.success && response.data) {
      // Parse SimpleCartResponse
      const simpleCart = SimpleCartSchema.parse(response.data);

      // Fetch full cart to get items array
      const fullCartResponse = await getCart();
      if (fullCartResponse.success && fullCartResponse.data) {
        return {
          success: true,
          message: response.message || 'Item added to cart',
          data: fullCartResponse.data, // Return full cart with all items
        };
      }

      // Fallback: return simple cart with empty items
      return {
        success: true,
        message: response.message || 'Item added to cart',
        data: {
          ...simpleCart,
          items: [],
        } as Cart,
      };
    }

    return {
      success: false,
      error: 'Failed to add item to cart',
      data: null,
    };
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    // Backend returns error in detail field for BusinessException
    const errorDetail = error?.data?.detail || error?.data || error?.response?.data?.detail;
    return {
      success: false,
      error: errorDetail?.message || error?.message || 'Failed to add item to cart',
      errorCode: errorDetail?.error_code,
      data: null,
    };
  }
}

export async function updateCartItem(itemId: string, request: UpdateCartItemRequest) {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        cart_id: 'cart_abc',
        total_items: request.quantity,
        total_price: 120.0 * request.quantity,
        items: [
          {
            itemId,
            sku: 'SKU-RED-42',
            quantity: request.quantity,
            price: 120.0,
          },
        ],
      } as Cart,
    };
  }

  try {
    // Extract numeric ID from "item_{id}" format
    const numericId = itemId.startsWith('item_') 
      ? itemId.replace('item_', '') 
      : itemId;
    
    const headers = await getAuthHeaders();
    const response = await httpClient.patch<Cart>(`${API_BASE}/items/${numericId}`, request, {
      headers,
    });

    if (response.success && response.data) {
      const validatedData = CartSchema.parse(response.data);
      return {
        success: true,
        data: validatedData,
      };
    }

    return {
      success: false,
      error: 'Failed to update cart item',
      data: null,
    };
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    // Backend returns error in detail field for BusinessException
    const errorDetail = error?.data?.detail || error?.data || error?.response?.data?.detail;
    return {
      success: false,
      error: errorDetail?.message || error?.message || 'Failed to update cart item',
      errorCode: errorDetail?.error_code,
      data: null,
    };
  }
}

export async function removeCartItem(itemId: string) {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        cart_id: 'cart_abc',
        total_items: 0,
        total_price: 0,
        items: [],
      } as Cart,
    };
  }

  try {
    // Extract numeric ID from "item_{id}" format
    const numericId = itemId.startsWith('item_') 
      ? itemId.replace('item_', '') 
      : itemId;
    
    const headers = await getAuthHeaders();
    const response = await httpClient.delete<Cart>(`${API_BASE}/items/${numericId}`, {
      headers,
    });

    if (response.success && response.data) {
      const validatedData = CartSchema.parse(response.data);
      return {
        success: true,
        data: validatedData,
      };
    }

    return {
      success: false,
      error: 'Failed to remove cart item',
      data: null,
    };
  } catch (error: any) {
    console.error('Error removing cart item:', error);
    // Backend returns error in detail field for BusinessException
    const errorDetail = error?.data?.detail || error?.data || error?.response?.data?.detail;
    return {
      success: false,
      error: errorDetail?.message || error?.message || 'Failed to remove cart item',
      errorCode: errorDetail?.error_code,
      data: null,
    };
  }
}
