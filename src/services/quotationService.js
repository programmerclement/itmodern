import { axiosClient } from '../api/axiosClient.js';

export const requestQuotation = (payload) => axiosClient.post('/quotations', payload);

export const getMyQuotations = (params) => axiosClient.get('/quotations', { params });

export const getQuotationByNumber = (quotationNumber) => axiosClient.get(`/quotations/${quotationNumber}`);

export const acceptQuotation = (quotationNumber, payload) =>
  axiosClient.post(`/quotations/${quotationNumber}/accept`, payload);

export const declineQuotation = (quotationNumber) =>
  axiosClient.patch(`/quotations/${quotationNumber}/decline`);

// Admin
export const adminGetQuotations = (params) => axiosClient.get('/quotations/admin/all', { params });

export const adminCreateQuotation = (payload) => axiosClient.post('/quotations/admin', payload);

export const adminUpdateQuotation = (id, payload) => axiosClient.put(`/quotations/admin/${id}`, payload);
