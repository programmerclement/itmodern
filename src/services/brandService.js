import { axiosClient } from '../api/axiosClient.js';

export const getBrands = () => axiosClient.get('/brands');

// Admin
export const adminGetBrands = (params) => axiosClient.get('/brands/all', { params });

export const createBrand = (payload) => axiosClient.post('/brands', payload);

export const updateBrand = (id, payload) => axiosClient.put(`/brands/${id}`, payload);

export const deleteBrand = (id) => axiosClient.delete(`/brands/${id}`);
