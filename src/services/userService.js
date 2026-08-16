import { axiosClient } from '../api/axiosClient.js';

export const adminGetUsers = (params) => axiosClient.get('/users', { params });

export const adminGetUserStats = () => axiosClient.get('/users/stats');

export const adminGetUser = (id) => axiosClient.get(`/users/${id}`);

export const adminCreateUser = (payload) => axiosClient.post('/users', payload);

export const adminUpdateUserStatus = (id, status) => axiosClient.patch(`/users/${id}/status`, { status });

export const adminUpdateUserRole = (id, role) => axiosClient.patch(`/users/${id}/role`, { role });

export const adminResetUserPassword = (id) => axiosClient.post(`/users/${id}/reset-password`);

export const adminDeleteUser = (id) => axiosClient.delete(`/users/${id}`);
