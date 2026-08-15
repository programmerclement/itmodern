import ProductGrid from '../../components/product/ProductGrid.jsx';
import { useWishlist } from '../../hooks/useWishlist.js';

export default function Wishlist() {
  const { products, isLoading } = useWishlist();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">Wishlist</h1>
      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}
