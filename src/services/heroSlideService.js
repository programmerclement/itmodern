import { axiosClient } from '../api/axiosClient.js';

export const getHeroSlides = () => axiosClient.get('/hero-slides');

// Admin
export const adminGetHeroSlides = () => axiosClient.get('/hero-slides/all');

export const createHeroSlide = (payload) => axiosClient.post('/hero-slides', payload);

export const updateHeroSlide = (id, payload) => axiosClient.put(`/hero-slides/${id}`, payload);

export const deleteHeroSlide = (id) => axiosClient.delete(`/hero-slides/${id}`);

export const reorderHeroSlides = (orderedIds) => axiosClient.post('/hero-slides/reorder', { orderedIds });
