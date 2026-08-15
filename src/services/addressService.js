import { axiosClient } from '../api/axiosClient.js';

export const getAddresses = () => axiosClient.get('/addresses');

export const createAddress = (payload) => axiosClient.post('/addresses', payload);

export const updateAddress = (id, payload) => axiosClient.put(`/addresses/${id}`, payload);

export const deleteAddress = (id) => axiosClient.delete(`/addresses/${id}`);

export const setDefaultAddress = (id) => axiosClient.patch(`/addresses/${id}/default`);
