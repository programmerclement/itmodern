import { axiosClient } from '../api/axiosClient.js';

export const checkWarranty = (serialNumber) => axiosClient.get(`/serial-numbers/check/${serialNumber}`);

export const getMyWarranties = () => axiosClient.get('/serial-numbers/mine');

// Admin
export const addSerialNumber = (payload) => axiosClient.post('/serial-numbers', payload);

export const getSerialNumbersForOrder = (orderNumber) =>
  axiosClient.get(`/serial-numbers/order/${orderNumber}`);

export const deleteSerialNumber = (id) => axiosClient.delete(`/serial-numbers/${id}`);
