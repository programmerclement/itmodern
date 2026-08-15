import { useQuery } from '@tanstack/react-query';
import * as couponService from '../services/couponService.js';

export const ADMIN_COUPONS_KEY = ['admin', 'coupons'];

export function useAdminCoupons() {
  return useQuery({
    queryKey: ADMIN_COUPONS_KEY,
    queryFn: couponService.adminGetCoupons,
    select: (result) => result.data.coupons,
  });
}
