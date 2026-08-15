import { AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import Button from './Button.jsx';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again. If the problem continues, contact support.',
  onRetry,
  retryLabel = 'Try again',
  className,
}) {
  return (
    <div
      className={cn(
        'flex min-h-[40vh] flex-col items-center justify-center px-4 py-12 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/15">
        <AlertTriangle className="h-7 w-7 text-red-500 dark:text-red-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {onRetry && (
        <div className="mt-6">
          <Button variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
