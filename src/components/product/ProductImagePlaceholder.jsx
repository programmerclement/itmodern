import { Laptop, Monitor, HardDrive, Wifi, Mouse, Cpu, Package } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const CATEGORY_ICONS = {
  laptops: Laptop,
  desktops: Cpu,
  monitors: Monitor,
  'storage-drives': HardDrive,
  networking: Wifi,
  accessories: Mouse,
};

export default function ProductImagePlaceholder({ categorySlug, className }) {
  const Icon = CATEGORY_ICONS[categorySlug] ?? Package;

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 dark:from-slate-800 dark:to-slate-900',
        className
      )}
    >
      <Icon
        className="h-1/3 w-1/3 text-brand-300 dark:text-slate-600"
        strokeWidth={1.25}
        aria-hidden="true"
      />
    </div>
  );
}
