import { z } from 'zod';

export const createLoginFormSchema = (t: any) => z.object({
  username: z.string().min(3, t('errors.min_length', { label: t('login.username'), min: 3 })),
  password: z.string().min(8, t('errors.min_length', { label: t('login.password'), min: 8 })),
});

export type LoginFormData = z.infer<ReturnType<typeof createLoginFormSchema>>;

export const UserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email().nullable(),
  full_name: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  avatar: z.string().url().nullable(),
  role: z.string(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
