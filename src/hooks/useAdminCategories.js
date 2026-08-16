import { useQuery } from '@tanstack/react-query';
import * as categoryService from '../services/categoryService.js';

export const ADMIN_CATEGORIES_KEY = ['admin', 'categories'];

export function useAdminCategories(params) {
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_KEY, params],
    queryFn: () => categoryService.adminGetCategories(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}
