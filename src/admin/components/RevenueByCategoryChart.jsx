import { useEffect, useState } from 'react';
import { PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import { cn } from '../../utils/cn.js';

// Fixed categorical order (never cycled) — color follows the category name,
// not its rank, so re-sorting or filtering never repaints the survivors.
const CATEGORY_COLORS = [
  { bar: 'bg-brand-500', dot: 'bg-brand-500' },
  { bar: 'bg-accent-500', dot: 'bg-accent-500' },
  { bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  { bar: 'bg-violet-500', dot: 'bg-violet-500' },
  { bar: 'bg-rose-500', dot: 'bg-rose-500' },
  { bar: 'bg-amber-500', dot: 'bg-amber-500' },
  { bar: 'bg-cyan-500', dot: 'bg-cyan-500' },
  { bar: 'bg-slate-500', dot: 'bg-slate-500' },
];

function colorForCategory(name) {
  const hash = [...String(name)].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
}

export default function RevenueByCategoryChart({ data = [] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (data.length === 0) {
    return (
      <EmptyState
        icon={PieChart}
        title="No category revenue yet"
        description="Revenue by category will appear here once orders are paid."
        className="min-h-[220px] py-6"
      />
    );
  }

  const max = Math.max(...data.map((d) => d.revenue), 1);
  const total = data.reduce((sum, d) => sum + d.revenue, 0) || 1;

  return (
    <div className="space-y-4">
      {data.map((entry, index) => {
        const color = colorForCategory(entry.category);
        const percent = (entry.revenue / total) * 100;

        return (
          <div key={entry.category}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', color.dot)} />
                {entry.category}
              </span>
              <span className="tabular-nums text-slate-500">
                {formatCurrency(entry.revenue)} <span className="text-slate-400">· {percent.toFixed(0)}%</span>
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn('h-full rounded-full transition-all duration-700 ease-out', color.bar)}
                style={{
                  width: isMounted ? `${Math.max((entry.revenue / max) * 100, 3)}%` : '0%',
                  transitionDelay: `${index * 60}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
