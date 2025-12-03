'use server';

import { cookies } from 'next/headers';
import type { CreateOrderRequest, OrderResponse, Order } from '@/entities/order';
import {
  OrderResponseSchema,
  OrderSchema,
} from '@/entities/order';
import { httpClient } from '@/lib/http-client';

const API_BASE = '/api/v1/orders';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token
    = cookieStore.get('access_token')?.value
      || cookieStore.get('ACCESS_TOKEN')?.value;
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function createOrder(request: CreateOrderRequest) {
  try {
    const headers = await getAuthHeaders();
    const response = await httpClient.post<OrderResponse['data']>(`${API_BASE}/checkout`, request, {
      headers,
    });

    if (response.success && response.data) {
      const validatedData = OrderResponseSchema.parse({
        status_code: 200,
        message: 'Order created successfully',
        data: response.data,
      });
      return {
        success: true,
        data: validatedData.data,
      };
    }

    return {
      success: false,
      error: 'Failed to create order',
      data: null,
    };
  } catch (error: any) {
    console.error('Error creating order:', error);
    const errorDetail = error?.data?.detail || error?.data || error?.response?.data?.detail;
    return {
      success: false,
      error: errorDetail?.message || error?.message || 'Failed to create order',
      errorCode: errorDetail?.error_code,
      data: null,
    };
  }
}

export async function getOrder(orderId: number) {
  try {
    const headers = await getAuthHeaders();
    const response = await httpClient.get<Order>(`${API_BASE}/${orderId}`, {
      headers,
    });

    if (response.success && response.data) {
      // Backend returns order_date as datetime and total as Decimal
      // Convert them to the expected format before validation
      const orderData: any = {
        ...response.data,
        order_date: typeof response.data.order_date === 'string'
          ? response.data.order_date
          : (response.data.order_date as any) instanceof Date
            ? (response.data.order_date as Date).toISOString()
            : new Date(response.data.order_date as any).toISOString(),
        total: typeof response.data.total === 'number'
          ? response.data.total
          : parseFloat(String(response.data.total)),
        items: (response.data.items || []).map((item: any) => ({
          ...item,
          price: typeof item.price === 'number'
            ? item.price
            : parseFloat(String(item.price)),
        })),
      };

      const validatedData = OrderSchema.parse(orderData);
      return {
        success: true,
        data: validatedData,
      };
    }

    return {
      success: false,
      error: 'Failed to fetch order',
      data: null,
    };
  } catch (error: any) {
    console.error('Error fetching order:', error);
    const errorDetail = error?.data?.detail || error?.data || error?.response?.data?.detail;
    return {
      success: false,
      error: errorDetail?.message || error?.message || 'Failed to fetch order',
      errorCode: errorDetail?.error_code,
      data: null,
    };
  }
}
