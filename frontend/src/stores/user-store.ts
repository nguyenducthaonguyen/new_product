import type { UserResponse } from '@/entities/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: user => set({ user, error: null }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),
      clearUser: () => set({ user: null, error: null }),
    }),
    {
      name: 'user-storage', // localStorage key
    },
  ),
);
