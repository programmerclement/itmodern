import { axiosClient } from '../api/axiosClient.js';

export const initiatePayment = (payload) => axiosClient.post('/payments/initiate', payload);

export const getPaymentStatus = (reference) => axiosClient.get(`/payments/status/${reference}`);

export const getPaymentByOrder = (orderNumber) => axiosClient.get(`/payments/by-order/${orderNumber}`);

// Admin
export const adminGetPayments = (params) => axiosClient.get('/payments/admin/all', { params });

export const adminGetPaymentStats = () => axiosClient.get('/payments/admin/stats');
