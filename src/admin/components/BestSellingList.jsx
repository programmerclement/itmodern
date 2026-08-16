import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProductImagePlaceholder from '../../components/product/ProductImagePlaceholder.jsx';
import { cn } from '../../utils/cn.js';

const RANK_BADGE_STYLES = ['bg-amber-400 text-white', 'bg-slate-300 text-slate-700', 'bg-orange-400 text-white'];

export default function BestSellingList({ products = [] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No sales yet"
        description="Best-selling products will appear here once orders are paid."
        className="min-h-[220px] py-6"
      />
    );
  }

  const maxSales = Math.max(...products.map((p) => p.salesCount), 1);

  return (
    <ol className="space-y-1">
      {products.map((product, index) => {
        const mainImage = product.images?.[0];
        const relativeWidth = Math.max((product.salesCount / maxSales) * 100, 4);

        return (
          <li key={product._id ?? product.id}>
            <Link
              to={`/admin/products/${product._id ?? product.id}`}
              className="group flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-slate-50"
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                  RANK_BADGE_STYLES[index] ?? 'bg-slate-100 text-slate-400'
                )}
              >
                {index + 1}
              </span>
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-50 transition-transform group-hover:scale-105">
                {mainImage ? (
                  <img src={mainImage.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ProductImagePlaceholder className="h-full w-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-700">{product.name}</p>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-400 transition-all duration-700 ease-out"
                    style={{ width: `${relativeWidth}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-xs font-medium text-slate-500">{product.salesCount} sold</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
