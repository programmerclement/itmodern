import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const variantConfig = {
  success: { icon: CheckCircle2, iconClass: 'text-emerald-500 dark:text-emerald-400' },
  error: { icon: XCircle, iconClass: 'text-red-500 dark:text-red-400' },
  warning: { icon: AlertTriangle, iconClass: 'text-amber-500 dark:text-amber-400' },
  info: { icon: Info, iconClass: 'text-brand-500 dark:text-brand-400' },
};

export default function Toast({ variant = 'info', title, description, onDismiss }) {
  const { icon: Icon, iconClass } = variantConfig[variant] ?? variantConfig.info;

  return (
    <div
      role="status"
      className="animate-slide-in-top pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconClass)} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>}
        {description && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
