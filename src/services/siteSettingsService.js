import { axiosClient } from '../api/axiosClient.js';

export const getSiteSettings = () => axiosClient.get('/settings');

export const updateSiteSettings = (payload) => axiosClient.put('/settings', payload);
