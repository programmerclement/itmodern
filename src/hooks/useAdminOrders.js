import { useQuery } from '@tanstack/react-query';
import * as orderService from '../services/orderService.js';

export function useAdminOrders(params) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => orderService.adminGetOrders(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}
