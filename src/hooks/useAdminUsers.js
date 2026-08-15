import { useQuery } from '@tanstack/react-query';
import * as userService from '../services/userService.js';

export function useAdminUsers(params) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => userService.adminGetUsers(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
  });
}

export function useAdminUser(id) {
  return useQuery({
    queryKey: ['admin', 'users', 'detail', id],
    queryFn: () => userService.adminGetUser(id),
    enabled: Boolean(id),
    select: (result) => result.data.user,
  });
}
