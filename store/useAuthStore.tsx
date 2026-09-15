"use client";

import { createStore, useStore as useZustandStore } from 'zustand';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type User = {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null;

interface AuthProps {
  user: User;
  isAuthenticated: boolean;
}

interface AuthState extends AuthProps {
  setUser: (user: User) => void;
}

type AuthStore = ReturnType<typeof createAuthStore>;

export const createAuthStore = (initProps?: Partial<AuthProps>) => {
  const DEFAULT_PROPS: AuthProps = {
    user: null,
    isAuthenticated: false,
  };
  return createStore<AuthState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
  }));
};

export const AuthStoreContext = createContext<AuthStore | null>(null);

export function AuthStoreProvider({ children, user }: { children: ReactNode, user: User }) {
  const [store] = useState(() => createAuthStore({ user, isAuthenticated: !!user }));
  
  useEffect(() => {
    store.setState({ user, isAuthenticated: !!user });
  }, [user, store]);
  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  const store = useContext(AuthStoreContext);
  if (!store) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }
  return useZustandStore(store, selector);
}
