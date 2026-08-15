import { axiosClient } from '../api/axiosClient.js';

export const adminGetUsers = (params) => axiosClient.get('/users', { params });

export const adminGetUser = (id) => axiosClient.get(`/users/${id}`);

export const adminUpdateUserStatus = (id, status) => axiosClient.patch(`/users/${id}/status`, { status });
