import { Link } from 'react-router-dom';
import { Trash2, Heart, RotateCcw } from 'lucide-react';
import QuantitySelector from './QuantitySelector.jsx';
import PriceTag from '../product/PriceTag.jsx';
import ProductImagePlaceholder from '../product/ProductImagePlaceholder.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function CartItemRow({ item }) {
  const { updateQuantity, removeItem, toggleSaveForLater, canSaveForLater } = useCart();
  const toast = useToast();
  const { product, quantity, productId, available, maxQuantity } = item;
  const mainImage = product.images?.find((img) => img.isMain) ?? product.images?.[0];

  const handleRemove = async () => {
    try {
      await removeItem(productId);
    } catch (err) {
      toast.error('Could not remove item', err.message);
    }
  };

  const handleQuantityChange = async (next) => {
    try {
      await updateQuantity(productId, next);
    } catch (err) {
      toast.error('Could not update quantity', err.message);
    }
  };

  const handleToggleSave = async () => {
    try {
      await toggleSaveForLater(productId);
    } catch (err) {
      toast.error('Could not update item', err.message);
    }
  };

  return (
    <div className="flex gap-4 py-4">
      <Link
        to={`/products/${product.slug}`}
        className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800"
      >
        {mainImage ? (
          <img src={mainImage.url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <ProductImagePlaceholder categorySlug={product.category?.slug} className="h-full w-full" />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/products/${product.slug}`}
              className="text-sm font-medium text-slate-900 hover:text-brand-700 dark:text-slate-100 dark:hover:text-brand-400"
            >
              {product.name}
            </Link>
            {!available && (
              <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">No longer available</p>
            )}
          </div>
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantitySelector quantity={quantity} onChange={handleQuantityChange} max={maxQuantity} size="sm" />
          <div className="flex items-center gap-1">
            {canSaveForLater && (
              <button
                type="button"
                onClick={handleToggleSave}
                aria-label={item.savedForLater ? 'Move to cart' : 'Save for later'}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                {item.savedForLater ? <RotateCcw className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove from cart"
              className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
