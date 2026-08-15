import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export default function Loader({ size = 'md', className, label = 'Loading' }) {
  return (
    <span role="status" className={cn('inline-flex items-center', className)}>
      <Loader2 className={cn('animate-spin text-brand-600 dark:text-brand-400', sizeClasses[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">
      <Loader size="lg" label={label} />
    </div>
  );
}
