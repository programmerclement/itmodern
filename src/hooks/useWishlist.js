import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext.jsx';
import * as wishlistService from '../services/wishlistService.js';

const WISHLIST_KEY = ['wishlist'];

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
    select: (result) => result.data.products,
  });

  const products = query.data ?? [];
  const productIds = new Set(products.map((product) => product.id ?? product._id));

  const toggle = async (productId) => {
    const result = await wishlistService.toggleWishlist(productId);
    queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
    return result.data.added;
  };

  return {
    products,
    isInWishlist: (productId) => productIds.has(productId),
    toggle,
    isLoading: query.isLoading,
  };
}
