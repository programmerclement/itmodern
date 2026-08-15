import { useQuery } from '@tanstack/react-query';
import * as heroSlideService from '../services/heroSlideService.js';

export const ADMIN_HERO_SLIDES_KEY = ['admin', 'hero-slides'];

export function useAdminHeroSlides() {
  return useQuery({
    queryKey: ADMIN_HERO_SLIDES_KEY,
    queryFn: heroSlideService.adminGetHeroSlides,
    select: (result) => result.data.slides,
  });
}
