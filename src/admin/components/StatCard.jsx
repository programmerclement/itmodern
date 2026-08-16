import { cn } from '../../utils/cn.js';
import { useCountUp } from '../../hooks/useCountUp.js';

const TONE_STYLES = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  accent: 'bg-accent-50 text-accent-600',
  sky: 'bg-sky-50 text-sky-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
};

const defaultFormatter = (n) => Math.round(n).toLocaleString();

export default function StatCard({
  icon: Icon,
  label,
  value,
  formatter = defaultFormatter,
  tone = 'brand',
  className,
  style,
}) {
  const animatedValue = useCountUp(value);

  return (
    <div
      style={style}
      className={cn(
        'animate-fade-in-up rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
        {Icon && (
          <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', TONE_STYLES[tone])}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{formatter(animatedValue)}</p>
    </div>
  );
}
