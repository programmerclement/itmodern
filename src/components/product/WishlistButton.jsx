import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWishlist } from '../../hooks/useWishlist.js';
import { useToast } from '../../context/ToastContext.jsx';
import { cn } from '../../utils/cn.js';

export default function WishlistButton({ productId, className, size = 'md' }) {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggle } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saved = isInWishlist(productId);

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Log in required', 'Log in to save items to your wishlist.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setIsSubmitting(true);
    try {
      const added = await toggle(productId);
      toast.success(added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err) {
      toast.error('Could not update wishlist', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'flex items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm backdrop-blur transition-colors hover:text-red-500 disabled:opacity-60 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:text-red-400',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        className
      )}
    >
      <Heart className={cn('h-4 w-4', saved && 'fill-red-500 text-red-500')} />
    </button>
  );
}
