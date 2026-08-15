import { useQuery } from '@tanstack/react-query';
import { getMyOrders, getOrderByNumber } from '../services/orderService.js';

export function useOrders(params) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getMyOrders(params),
    select: (result) => result.data,
  });
}

export function useOrder(orderNumber) {
  return useQuery({
    queryKey: ['orders', 'detail', orderNumber],
    queryFn: () => getOrderByNumber(orderNumber),
    enabled: Boolean(orderNumber),
    select: (result) => result.data.order,
  });
}
