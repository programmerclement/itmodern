import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryBySlug } from '../services/categoryService.js';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    select: (result) => result.data.categories,
  });

export const useCategory = (slug) =>
  useQuery({
    queryKey: ['categories', slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
    select: (result) => result.data.category,
  });
