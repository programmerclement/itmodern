import { useQuery } from '@tanstack/react-query';
import * as categoryService from '../services/categoryService.js';

export const ADMIN_CATEGORIES_KEY = ['admin', 'categories'];

export function useAdminCategories() {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_KEY,
    queryFn: categoryService.adminGetCategories,
    select: (result) => result.data.categories,
  });
}
