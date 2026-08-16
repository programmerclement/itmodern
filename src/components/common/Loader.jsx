import { LOGO_URL } from '../../constants/config.js';
import { cn } from '../../utils/cn.js';

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export default function Loader({ size = 'md', className, label = 'Loading' }) {
  return (
    <span role="status" className={cn('inline-flex items-center', className)}>
      <img
        src={LOGO_URL}
        alt=""
        aria-hidden="true"
        className={cn('animate-logo-spin', sizeClasses[size])}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">
      <Loader size="xl" label={label} />
    </div>
  );
}
