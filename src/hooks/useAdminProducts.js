import { useQuery } from '@tanstack/react-query';
import * as productService from '../services/productService.js';

export function useAdminProducts(params) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => productService.adminGetProducts(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}

export function useAdminProductStats() {
  return useQuery({
    queryKey: ['admin', 'products', 'stats'],
    queryFn: productService.adminGetProductStats,
    select: (result) => result.data,
  });
}

export function useAdminProduct(id) {
  return useQuery({
    queryKey: ['admin', 'products', 'detail', id],
    queryFn: () => productService.adminGetProduct(id),
    enabled: Boolean(id),
    select: (result) => result.data.product,
  });
}
