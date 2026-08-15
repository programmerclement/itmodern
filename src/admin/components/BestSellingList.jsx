import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProductImagePlaceholder from '../../components/product/ProductImagePlaceholder.jsx';

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

  return (
    <ol className="space-y-3">
      {products.map((product, index) => {
        const mainImage = product.images?.[0];
        return (
          <li key={product._id ?? product.id}>
            <Link
              to={`/admin/products/${product._id ?? product.id}`}
              className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-slate-50"
            >
              <span className="w-4 shrink-0 text-center text-xs font-semibold text-slate-400">{index + 1}</span>
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                {mainImage ? (
                  <img src={mainImage.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ProductImagePlaceholder className="h-full w-full" />
                )}
              </div>
              <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{product.name}</span>
              <span className="shrink-0 text-xs font-medium text-slate-500">{product.salesCount} sold</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
