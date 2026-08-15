import { formatCurrency } from '../../utils/formatCurrency.js';
import { cn } from '../../utils/cn.js';

export default function PriceTag({ price, compareAtPrice, size = 'md', className }) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span
        className={cn(
          'font-semibold text-slate-900 dark:text-slate-100',
          size === 'lg' ? 'text-2xl' : 'text-base'
        )}
      >
        {formatCurrency(price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-slate-400 line-through dark:text-slate-500">
          {formatCurrency(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
