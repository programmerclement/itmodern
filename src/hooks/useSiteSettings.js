import { useQuery } from '@tanstack/react-query';
import * as siteSettingsService from '../services/siteSettingsService.js';

export const SITE_SETTINGS_KEY = ['site-settings'];

export function useSiteSettings() {
  return useQuery({
    queryKey: SITE_SETTINGS_KEY,
    queryFn: siteSettingsService.getSiteSettings,
    select: (result) => result.data.settings,
    staleTime: 5 * 60 * 1000,
  });
}
