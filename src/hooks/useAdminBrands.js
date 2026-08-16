import { useQuery } from '@tanstack/react-query';
import * as brandService from '../services/brandService.js';

export const ADMIN_BRANDS_KEY = ['admin', 'brands'];

export function useAdminBrands(params) {
  return useQuery({
    queryKey: [...ADMIN_BRANDS_KEY, params],
    queryFn: () => brandService.adminGetBrands(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}
