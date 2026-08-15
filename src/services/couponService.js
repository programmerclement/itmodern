import { axiosClient } from '../api/axiosClient.js';

export const validateCoupon = (code, subtotal) => axiosClient.post('/coupons/validate', { code, subtotal });

// Admin
export const adminGetCoupons = () => axiosClient.get('/coupons');

export const createCoupon = (payload) => axiosClient.post('/coupons', payload);

export const updateCoupon = (id, payload) => axiosClient.put(`/coupons/${id}`, payload);

export const deleteCoupon = (id) => axiosClient.delete(`/coupons/${id}`);
