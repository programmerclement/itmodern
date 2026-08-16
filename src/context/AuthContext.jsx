import { createContext, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as authService from '../services/authService.js';
import { setStoredToken, clearStoredToken } from '../utils/authToken.js';

const AuthContext = createContext(null);

const ME_QUERY_KEY = ['auth', 'me'];

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: authService.getMe,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const user = data?.data?.user ?? null;

  const setUser = (nextUser) => {
    queryClient.setQueryData(ME_QUERY_KEY, { data: { user: nextUser } });
  };

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    setStoredToken(result.data.token);
    setUser(result.data.user);
    return result.data.user;
  };

  const loginWithOtp = async (identifier, code) => {
    const result = await authService.verifyOtpLogin(identifier, code);
    setStoredToken(result.data.token);
    setUser(result.data.user);
    return result.data.user;
  };

  const register = async (payload) => {
    const result = await authService.register(payload);
    setStoredToken(result.data.token);
    setUser(result.data.user);
    return result.data.user;
  };

  const googleSignIn = async (credential) => {
    const result = await authService.googleAuth(credential);
    setStoredToken(result.data.token);
    setUser(result.data.user);
    return result.data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearStoredToken();
      queryClient.setQueryData(ME_QUERY_KEY, { data: { user: null } });
      queryClient.clear();
    }
  };

  const refetchUser = () => queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: isLoading || isFetching,
      login,
      loginWithOtp,
      register,
      googleSignIn,
      logout,
      refetchUser,
      setUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading, isFetching]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
