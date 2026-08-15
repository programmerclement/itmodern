import { useQuery } from '@tanstack/react-query';
import * as brandService from '../services/brandService.js';

export const ADMIN_BRANDS_KEY = ['admin', 'brands'];

export function useAdminBrands() {
  return useQuery({
    queryKey: ADMIN_BRANDS_KEY,
    queryFn: brandService.adminGetBrands,
    select: (result) => result.data.brands,
  });
}
