import { axiosClient } from '../api/axiosClient.js';

export const register = (payload) => axiosClient.post('/auth/register', payload);

export const login = (payload) => axiosClient.post('/auth/login', payload);

export const googleAuth = (credential) => axiosClient.post('/auth/google', { credential });

export const logout = () => axiosClient.post('/auth/logout');

export const getMe = () => axiosClient.get('/auth/me');

export const updateProfile = (payload) => axiosClient.patch('/auth/me', payload);

export const requestOtp = (identifier, purpose) =>
  axiosClient.post('/auth/otp/request', { identifier, purpose });

export const verifyOtpLogin = (identifier, code) =>
  axiosClient.post('/auth/otp/login', { identifier, code });

export const resetPasswordWithOtp = (identifier, code, password) =>
  axiosClient.post('/auth/otp/reset-password', { identifier, code, password });

export const verifyEmail = (token) => axiosClient.post('/auth/verify-email', { token });

export const resendVerification = () => axiosClient.post('/auth/resend-verification');

export const changePassword = (currentPassword, newPassword) =>
  axiosClient.post('/auth/change-password', { currentPassword, newPassword });
