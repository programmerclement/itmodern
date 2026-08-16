import { axiosClient } from '../api/axiosClient.js';

export const checkout = (payload) => axiosClient.post('/orders', payload);

export const getMyOrders = (params) => axiosClient.get('/orders', { params });

export const getOrderByNumber = (orderNumber) => axiosClient.get(`/orders/${orderNumber}`);

export const cancelOrder = (orderNumber) => axiosClient.patch(`/orders/${orderNumber}/cancel`);

// Admin
export const adminGetOrders = (params) => axiosClient.get('/orders/admin/all', { params });

export const adminUpdateOrderStatus = (orderNumber, status, note) =>
  axiosClient.patch(`/orders/${orderNumber}/status`, { status, note });

export const adminMarkPaymentReceived = (orderNumber, note) =>
  axiosClient.patch(`/orders/${orderNumber}/mark-paid`, { note });
