import { useQuery } from '@tanstack/react-query';
import { getBrands } from '../services/brandService.js';

export const useBrands = () =>
  useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    staleTime: 5 * 60 * 1000,
    select: (result) => result.data.brands,
  });
