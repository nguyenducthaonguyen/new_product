import { z } from 'zod';

export const ShippingInfoSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const CreateOrderRequestSchema = z.object({
  shipping_info: ShippingInfoSchema,
  shipping_method: z.enum(['standard', 'express', 'overnight']),
  payment_method: z.enum(['credit_card', 'paypal', 'bank_transfer']),
  cart_id: z.string(),
});

export const OrderItemSchema = z.object({
  id: z.number(),
  product_variant_id: z.number(),
  sku: z.string(),
  product_name: z.string().nullable().optional(),
  quantity: z.number(),
  price: z.number(),
});

export const OrderSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  username: z.string().nullable().optional(),
  user_email: z.string().nullable().optional(),
  order_date: z.string(),
  status: z.string(),
  total: z.number(),
  delivery_info: z.record(z.string(), z.any()).nullable().optional(),
  items: z.array(OrderItemSchema),
});

export const OrderResponseSchema = z.object({
  status_code: z.number(),
  message: z.string(),
  data: z.object({
    order_id: z.string(),
    order_number: z.string(),
    status: z.string(),
    total_amount: z.number(),
    shipping_cost: z.number(),
    created_at: z.string(),
  }),
});

export type ShippingInfo = z.infer<typeof ShippingInfoSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;

