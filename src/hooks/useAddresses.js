import { useQuery } from '@tanstack/react-query';
import { getAddresses } from '../services/addressService.js';

export const ADDRESSES_QUERY_KEY = ['addresses'];

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: getAddresses,
    select: (result) => result.data.addresses,
  });
}
