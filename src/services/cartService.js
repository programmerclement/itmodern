import { axiosClient } from '../api/axiosClient.js';

export const getCart = () => axiosClient.get('/cart');

export const addCartItem = (productId, quantity = 1) =>
  axiosClient.post('/cart/items', { productId, quantity });

export const updateCartItem = (productId, quantity) =>
  axiosClient.patch(`/cart/items/${productId}`, { quantity });

export const removeCartItem = (productId) => axiosClient.delete(`/cart/items/${productId}`);

export const toggleSaveForLater = (productId) =>
  axiosClient.patch(`/cart/items/${productId}/save-for-later`);

export const mergeGuestCart = (items) => axiosClient.post('/cart/merge', { items });
