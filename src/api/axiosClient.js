import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    // Validation errors come back as a generic "Validation failed" message
    // plus a { field: reason } details map — surface the first specific
    // reason instead of the unhelpful generic one.
    const firstDetail = data?.details && Object.values(data.details)[0];
    const message = firstDetail ?? data?.message ?? error.message ?? 'Unexpected network error';
    return Promise.reject(new Error(message));
  }
);
