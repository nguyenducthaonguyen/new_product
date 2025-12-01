import { z } from 'zod';

export const CartItemSchema = z.object({
  itemId: z.string(),
  sku: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const CartSchema = z.object({
  cart_id: z.string(),
  total_items: z.number(),
  total_price: z.number(),
  items: z.array(CartItemSchema),
});

export const AddToCartRequestSchema = z.object({
  sku: z.string(),
  quantity: z.number().min(1),
});

export const UpdateCartItemRequestSchema = z.object({
  quantity: z.number().min(1),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type AddToCartRequest = z.infer<typeof AddToCartRequestSchema>;
export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemRequestSchema>;

