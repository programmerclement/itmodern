import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const sideClasses = {
  right: 'right-0 top-0 h-full w-full max-w-sm animate-slide-in-right',
  left: 'left-0 top-0 h-full w-full max-w-sm animate-slide-in-left',
  bottom: 'bottom-0 left-0 w-full max-h-[85vh] rounded-t-2xl animate-slide-in-bottom',
};

export default function Drawer({ isOpen, onClose, title, children, footer, side = 'right' }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/50 animate-fade-in dark:bg-slate-950/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('absolute flex flex-col bg-white shadow-xl dark:bg-slate-800', sideClasses[side])}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
