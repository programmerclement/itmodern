import { axiosClient } from '../api/axiosClient.js';

export const adjustStock = (payload) => axiosClient.post('/inventory/adjust', payload);

export const getStockHistory = (productId, params) =>
  axiosClient.get(`/inventory/history/${productId}`, { params });

export const getLowStock = (params) => axiosClient.get('/inventory/low-stock', { params });

export const getOutOfStock = (params) => axiosClient.get('/inventory/out-of-stock', { params });
