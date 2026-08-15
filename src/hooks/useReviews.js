import { useQuery } from '@tanstack/react-query';
import * as reviewService from '../services/reviewService.js';
import { useAuth } from '../context/AuthContext.jsx';

export function useProductReviews(productId, params) {
  return useQuery({
    queryKey: ['reviews', 'product', productId, params],
    queryFn: () => reviewService.getReviewsForProduct(productId, params),
    enabled: Boolean(productId),
    select: (result) => result.data,
  });
}

export function useCanReview(productId) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['reviews', 'can-review', productId],
    queryFn: () => reviewService.canReview(productId),
    enabled: Boolean(productId) && isAuthenticated,
    select: (result) => result.data,
  });
}
