import { useQuery } from '@tanstack/react-query';
import * as serialNumberService from '../services/serialNumberService.js';

export function useMyWarranties() {
  return useQuery({
    queryKey: ['serial-numbers', 'mine'],
    queryFn: serialNumberService.getMyWarranties,
    select: (result) => result.data.serialNumbers,
  });
}

export function useOrderSerialNumbers(orderNumber) {
  return useQuery({
    queryKey: ['admin', 'serial-numbers', orderNumber],
    queryFn: () => serialNumberService.getSerialNumbersForOrder(orderNumber),
    enabled: Boolean(orderNumber),
    select: (result) => result.data.serialNumbers,
  });
}
