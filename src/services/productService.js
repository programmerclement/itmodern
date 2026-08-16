import { axiosClient } from '../api/axiosClient.js';

export const getProducts = (params) => axiosClient.get('/products', { params });

export const getProductBySlug = (slug) => axiosClient.get(`/products/${slug}`);

// Admin
export const adminGetProducts = (params) => axiosClient.get('/products/admin/all', { params });

export const adminGetProduct = (id) => axiosClient.get(`/products/admin/${id}`);

export const adminGetProductStats = () => axiosClient.get('/products/admin/stats');

export const createProduct = (payload) => axiosClient.post('/products', payload);

export const updateProduct = (id, payload) => axiosClient.put(`/products/${id}`, payload);

export const publishProduct = (id) => axiosClient.patch(`/products/${id}/publish`);

export const unpublishProduct = (id) => axiosClient.patch(`/products/${id}/unpublish`);

export const archiveProduct = (id) => axiosClient.patch(`/products/${id}/archive`);

export const toggleProductFeatured = (id) => axiosClient.patch(`/products/${id}/feature`);
