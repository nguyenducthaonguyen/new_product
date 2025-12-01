import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '@/entities/cart';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      isLoading: false,
      error: null,
      setCart: (cart) => set({ cart, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearCart: () => set({ cart: null, error: null }),
    }),
    {
      name: 'cart-storage',
    },
  ),
);

