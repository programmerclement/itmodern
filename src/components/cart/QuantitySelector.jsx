import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export default function QuantitySelector({ quantity, onChange, max, min = 1, size = 'md' }) {
  const decrease = () => onChange(Math.max(min, quantity - 1));
  const increase = () => onChange(max ? Math.min(max, quantity + 1) : quantity + 1);

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600',
        size === 'sm' ? 'h-8' : 'h-10'
      )}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="flex h-full w-8 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-slate-100">{quantity}</span>
      <button
        type="button"
        onClick={increase}
        disabled={max !== undefined && quantity >= max}
        aria-label="Increase quantity"
        className="flex h-full w-8 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
