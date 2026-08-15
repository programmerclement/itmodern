import { cn } from '../../utils/cn.js';

export default function StatCard({ icon: Icon, label, value, tone = 'default', className }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
        {Icon && (
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full',
              tone === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-brand-50 text-brand-600'
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
