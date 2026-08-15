import { cn } from '../../utils/cn.js';

export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className={cn('w-full min-w-max border-collapse text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ className, children, ...props }) {
  return (
    <thead className={cn('bg-slate-50 dark:bg-slate-800', className)} {...props}>
      {children}
    </thead>
  );
}

export function Tbody({ className, children, ...props }) {
  return (
    <tbody className={cn('divide-y divide-slate-100 dark:divide-slate-700', className)} {...props}>
      {children}
    </tbody>
  );
}

export function Tr({ className, children, ...props }) {
  return (
    <tr className={cn('hover:bg-slate-50/75 dark:hover:bg-slate-700/40', className)} {...props}>
      {children}
    </tr>
  );
}

export function Th({ className, children, ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({ className, children, ...props }) {
  return (
    <td className={cn('whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300', className)} {...props}>
      {children}
    </td>
  );
}
