import { axiosClient } from '../api/axiosClient.js';

export const getDashboardSummary = () => axiosClient.get('/admin/dashboard');
