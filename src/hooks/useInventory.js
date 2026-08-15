import { useQuery } from '@tanstack/react-query';
import * as inventoryService from '../services/inventoryService.js';

export function useLowStock() {
  return useQuery({
    queryKey: ['admin', 'inventory', 'low-stock'],
    queryFn: inventoryService.getLowStock,
    select: (result) => result.data.products,
  });
}

export function useOutOfStock() {
  return useQuery({
    queryKey: ['admin', 'inventory', 'out-of-stock'],
    queryFn: inventoryService.getOutOfStock,
    select: (result) => result.data.products,
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
