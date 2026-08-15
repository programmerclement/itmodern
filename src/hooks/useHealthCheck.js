import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../services/healthService.js';

export const useHealthCheck = () =>
  useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    retry: 1,
    staleTime: 30_000,
  });
