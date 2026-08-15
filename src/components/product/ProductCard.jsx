import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ConditionBadge from './ConditionBadge.jsx';
import PriceTag from './PriceTag.jsx';
import WishlistButton from './WishlistButton.jsx';
import ProductImagePlaceholder from './ProductImagePlaceholder.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProductCard({ product }) {
  const id = product.id ?? product._id;
  const mainImage = product.images?.find((img) => img.isMain) ?? product.images?.[0];
  const outOfStock = product.stockQuantity <= 0;
  const { addItem } = useCart();
  const toast = useToast();

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await addItem(product, 1);
      toast.success('Added to cart', product.name);
    } catch (err) {
      toast.error('Could not add to cart', err.message);
    }
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ProductImagePlaceholder categorySlug={product.category?.slug} className="h-full w-full" />
        )}

        <div className="absolute left-2 top-2">
          <ConditionBadge condition={product.condition} conditionGrade={product.conditionGrade} />
        </div>
        <WishlistButton productId={id} size="sm" className="absolute right-2 top-2" />

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.brand?.name && (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {product.brand.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-100">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
          {!outOfStock && (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/25"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
