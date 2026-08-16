import axios from 'axios';
import { getStoredToken, clearStoredToken } from '../utils/authToken.js';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
  // The auth cookie is the primary session mechanism, but it's a third-party
  // cookie when the frontend and API are on different domains (Netlify +
  // Render), which browsers increasingly block outright. Falling back to a
  // Bearer header — which the backend already accepts — keeps auth working
  // regardless of cookie support.
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken();
    }

    const data = error.response?.data;
    // Validation errors come back as a generic "Validation failed" message
    // plus a { field: reason } details map — surface the first specific
    // reason instead of the unhelpful generic one.
    const firstDetail = data?.details && Object.values(data.details)[0];
    const message = firstDetail ?? data?.message ?? error.message ?? 'Unexpected network error';
    return Promise.reject(new Error(message));
  }
);
