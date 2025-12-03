'use server';

import type { ProductDetail, ProductListItem } from '@/entities/product';
import { ProductDetailSchema, ProductListItemSchema } from '@/entities/product';
import { httpClient } from '@/lib/http-client';

// Backend API base is already /api, so we use /v1/products
const API_BASE = '/api/v1/products';

export async function getProducts(params?: { offset?: number; limit?: number }) {
  try {
    const response = await httpClient.get<ProductListItem[]>(API_BASE, {
      params,
    });

    if (response.success && response.data) {
      // Validate data with schema
      const validatedData = response.data.map((item: ProductListItem) =>
        ProductListItemSchema.parse(item),
      );
      return {
        success: true,
        data: validatedData,
      };
    }

    return {
      success: false,
      data: [],
      error: 'Failed to fetch products',
    };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      data: [],
      error: error?.data?.message || error?.message || 'Failed to fetch products',
      errorCode: error?.data?.error_code,
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const response = await httpClient.get<ProductDetail>(`${API_BASE}/${slug}`);

    if (response.success && response.data) {
      // Validate data with schema
      const validatedData = ProductDetailSchema.parse(response.data);
      return {
        success: true,
        data: validatedData,
      };
    }

    return {
      success: false,
      data: null,
      error: 'Product not found',
    };
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return {
      success: false,
      data: null,
      error: error?.data?.message || error?.message || 'Product not found',
      errorCode: error?.data?.error_code,
    };
  }
}
