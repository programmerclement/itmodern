import { axiosClient } from '../api/axiosClient.js';

export const getReviewsForProduct = (productId, params) =>
  axiosClient.get(`/reviews/product/${productId}`, { params });

export const canReview = (productId) => axiosClient.get(`/reviews/can-review/${productId}`);

export const createReview = (payload) => axiosClient.post('/reviews', payload);

// Admin
export const adminGetReviews = (params) => axiosClient.get('/reviews/admin/all', { params });

export const moderateReview = (id, status) => axiosClient.patch(`/reviews/${id}/status`, { status });
