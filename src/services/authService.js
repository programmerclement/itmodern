import { axiosClient } from '../api/axiosClient.js';

export const register = (payload) => axiosClient.post('/auth/register', payload);

export const login = (payload) => axiosClient.post('/auth/login', payload);

export const googleAuth = (credential) => axiosClient.post('/auth/google', { credential });

export const logout = () => axiosClient.post('/auth/logout');

export const getMe = () => axiosClient.get('/auth/me');

export const updateProfile = (payload) => axiosClient.patch('/auth/me', payload);

export const forgotPassword = (email) => axiosClient.post('/auth/forgot-password', { email });

export const resetPassword = (token, password) =>
  axiosClient.post('/auth/reset-password', { token, password });

export const verifyEmail = (token) => axiosClient.post('/auth/verify-email', { token });

export const resendVerification = () => axiosClient.post('/auth/resend-verification');

export const changePassword = (currentPassword, newPassword) =>
  axiosClient.post('/auth/change-password', { currentPassword, newPassword });
