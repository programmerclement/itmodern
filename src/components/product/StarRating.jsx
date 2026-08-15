import { Star } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export default function StarRating({ value = 0, onChange, size = 'md', readOnly = true }) {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-0.5" role={readOnly ? undefined : 'radiogroup'}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          aria-label={readOnly ? undefined : `Rate ${star} star${star > 1 ? 's' : ''}`}
          className={cn(readOnly ? 'cursor-default' : 'cursor-pointer')}
        >
          <Star
            className={cn(
              starSize,
              star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
            )}
          />
        </button>
      ))}
    </div>
  );
}
