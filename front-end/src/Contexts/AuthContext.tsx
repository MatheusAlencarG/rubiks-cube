import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { api, ApiError } from '../api/client';
import type { User } from '../api/types';

const SESSION_KEY = 'rubiks.session.v1';
function storedToken(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}
const AuthContext = createContext({
  token: null as string | null,
  user: undefined as User | undefined,
  loading: false,
  login: async (_data: { identifier: string; password: string }) => {},
  register: async (_data: { username: string; email: string; password: string }) => {},
  logout: () => {},
});
export const useAuth = () => useContext(AuthContext);
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(storedToken);
  const { mutate } = useSWRConfig();
  const generation = useRef(0);
  const key = token ? ['user', token] : null;
  const {
    data: user,
    error,
    isLoading,
  } = useSWR<User>(key, ([, jwt]: string[]) => api('/users/me', { token: jwt }), {
    shouldRetryOnError: false,
  });
  function logout() {
    generation.current++;
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setToken(null);
    void mutate(k => Array.isArray(k) && k[0] !== 'tutorials', undefined, { revalidate: false });
  }
  useEffect(() => {
    if (error instanceof ApiError && [401, 403].includes(error.status)) {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {}
      setToken(null);
    }
  }, [error]);
  async function authenticate(route: string, body: unknown) {
    const requestGeneration = ++generation.current;
    const result = await api<{ jwt?: string; user: User }>(route, { method: 'POST', body });
    if (!result.jwt)
      throw new Error(
        'Confirme seu e-mail antes de entrar. / Confirm your email before signing in.'
      );
    if (requestGeneration !== generation.current) return;
    try {
      sessionStorage.setItem(SESSION_KEY, result.jwt);
    } catch {}
    await mutate(['user', result.jwt], result.user, { revalidate: false });
    setToken(result.jwt);
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading: Boolean(token && isLoading),
        logout,
        login: data => authenticate('/auth/local', data),
        register: data => authenticate('/auth/local/register', data),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
