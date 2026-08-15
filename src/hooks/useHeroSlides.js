import { useQuery } from '@tanstack/react-query';
import * as heroSlideService from '../services/heroSlideService.js';

export const HERO_SLIDES_KEY = ['hero-slides'];

export function useHeroSlides() {
  return useQuery({
    queryKey: HERO_SLIDES_KEY,
    queryFn: heroSlideService.getHeroSlides,
    select: (result) => result.data.slides,
  });
}
