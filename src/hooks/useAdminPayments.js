import { useQuery } from '@tanstack/react-query';
import * as paymentService from '../services/paymentService.js';

export function useAdminPayments(params) {
  return useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: () => paymentService.adminGetPayments(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}

export function useAdminPaymentStats() {
  return useQuery({
    queryKey: ['admin', 'payments', 'stats'],
    queryFn: paymentService.adminGetPaymentStats,
    select: (result) => result.data,
  });
}
