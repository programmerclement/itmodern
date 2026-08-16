import { axiosClient } from '../api/axiosClient.js';

export const getCategories = () => axiosClient.get('/categories');

export const getCategoryBySlug = (slug) => axiosClient.get(`/categories/${slug}`);

// Admin
export const adminGetCategories = (params) => axiosClient.get('/categories/all', { params });

export const createCategory = (payload) => axiosClient.post('/categories', payload);

export const updateCategory = (id, payload) => axiosClient.put(`/categories/${id}`, payload);

export const deleteCategory = (id) => axiosClient.delete(`/categories/${id}`);
