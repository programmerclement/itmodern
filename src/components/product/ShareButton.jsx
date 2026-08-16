import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { cn } from '../../utils/cn.js';

export default function ShareButton({ title, text, url, className, size = 'md' }) {
  const toast = useToast();
  const [justCopied, setJustCopied] = useState(false);

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const shareUrl = url ?? window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Could not share');
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setJustCopied(true);
      toast.success('Link copied', 'Share it anywhere you like.');
      setTimeout(() => setJustCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Share this product"
      title="Share"
      className={cn(
        'flex items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm backdrop-blur transition-colors hover:text-brand-600 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:text-brand-400',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        className
      )}
    >
      {justCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
    </button>
  );
}
