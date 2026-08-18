import { useQuery } from '@tanstack/react-query';
import * as receiptService from '../services/receiptService.js';

export function useAdminReceipts(params) {
  return useQuery({
    queryKey: ['admin', 'receipts', params],
    queryFn: () => receiptService.getReceipts(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}
