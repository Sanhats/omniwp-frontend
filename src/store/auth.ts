import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
      
      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
        // También guardar en localStorage para compatibilidad
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Limpiar localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      },
      
      setUser: (user: User) => {
        set({ user });
        // Actualizar localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
      },

      initializeAuth: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const userStr = localStorage.getItem('user');
          
          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              set({ user, token, isAuthenticated: true, isInitialized: true });
            } catch (error) {
              console.error('Error parsing user data:', error);
              set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } else {
            set({ isInitialized: true });
          }
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
