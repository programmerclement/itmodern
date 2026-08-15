import { axiosClient } from '../api/axiosClient.js';

export const getWishlist = () => axiosClient.get('/wishlist');

export const toggleWishlist = (productId) => axiosClient.post(`/wishlist/${productId}`);
