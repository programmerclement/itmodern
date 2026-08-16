import { useQuery } from '@tanstack/react-query';
import * as inventoryService from '../services/inventoryService.js';

export function useLowStock(params) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'low-stock', params],
    queryFn: () => inventoryService.getLowStock(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}

export function useOutOfStock(params) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'out-of-stock', params],
    queryFn: () => inventoryService.getOutOfStock(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}

export function useStockHistory(productId, params) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'history', productId, params],
    queryFn: () => inventoryService.getStockHistory(productId, params),
    enabled: Boolean(productId),
    select: (result) => result.data,
  });
}
