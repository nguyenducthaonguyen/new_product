import { z } from 'zod';

export const ProductVariantSchema = z.object({
  sku: z.string(),
  color: z.string().nullable(),
  size: z.string().nullable(),
  stock: z.number(),
  price_modifier: z.number(),
});

export const ProductListItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  images: z.array(z.string()),
  rating: z.number(),
  review_count: z.number(),
});

export const ProductDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  description: z.string().nullable(),
  images: z.array(z.string()),
  variants: z.array(ProductVariantSchema),
  rating: z.number(),
  review_count: z.number(),
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type ProductListItem = z.infer<typeof ProductListItemSchema>;
export type ProductDetail = z.infer<typeof ProductDetailSchema>;
