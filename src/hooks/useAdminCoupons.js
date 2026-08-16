import { useQuery } from '@tanstack/react-query';
import * as couponService from '../services/couponService.js';

export const ADMIN_COUPONS_KEY = ['admin', 'coupons'];

export function useAdminCoupons(params) {
  return useQuery({
    queryKey: [...ADMIN_COUPONS_KEY, params],
    queryFn: () => couponService.adminGetCoupons(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}
