import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductBySlug } from '../services/productService.js';

export const useProducts = (params) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    placeholderData: (previousData) => previousData,
    select: (result) => result.data,
  });

export const useProduct = (slug) =>
  useQuery({
    queryKey: ['products', 'detail', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
    select: (result) => result.data,
  });
