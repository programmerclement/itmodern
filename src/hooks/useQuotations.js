import { useQuery } from '@tanstack/react-query';
import * as quotationService from '../services/quotationService.js';

export function useMyQuotations(params) {
  return useQuery({
    queryKey: ['quotations', params],
    queryFn: () => quotationService.getMyQuotations(params),
    select: (result) => result.data,
  });
}

export function useQuotation(quotationNumber) {
  return useQuery({
    queryKey: ['quotations', 'detail', quotationNumber],
    queryFn: () => quotationService.getQuotationByNumber(quotationNumber),
    enabled: Boolean(quotationNumber),
    select: (result) => result.data.quotation,
  });
}
