import { axiosClient } from '../api/axiosClient.js';

export const getHealth = () => axiosClient.get('/health');
