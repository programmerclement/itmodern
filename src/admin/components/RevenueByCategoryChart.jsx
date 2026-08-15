import { PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function RevenueByCategoryChart({ data = [] }) {
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

  return (
    <div className="space-y-3">
      {data.map((entry) => (
        <div key={entry.category}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="font-medium text-slate-700">{entry.category}</span>
            <span className="text-slate-500">{formatCurrency(entry.revenue)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${Math.max((entry.revenue / max) * 100, 3)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
