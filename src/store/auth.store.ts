import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token: string | null) => set({ accessToken: token }),
      logout: () => {
        set({ accessToken: null });
        if (typeof document !== 'undefined') {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
