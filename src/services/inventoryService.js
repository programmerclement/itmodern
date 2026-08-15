import { axiosClient } from '../api/axiosClient.js';

export const adjustStock = (payload) => axiosClient.post('/inventory/adjust', payload);

export const getStockHistory = (productId, params) =>
  axiosClient.get(`/inventory/history/${productId}`, { params });

export const getLowStock = () => axiosClient.get('/inventory/low-stock');

export const getOutOfStock = () => axiosClient.get('/inventory/out-of-stock');
