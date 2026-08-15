import { useQuery } from '@tanstack/react-query';
import * as quotationService from '../services/quotationService.js';

export function useAdminQuotations(params) {
  return useQuery({
    queryKey: ['admin', 'quotations', params],
    queryFn: () => quotationService.adminGetQuotations(params),
    select: (result) => result.data,
  });
}
