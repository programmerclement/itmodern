import { Link } from 'react-router-dom';
import ProductImagePlaceholder from './ProductImagePlaceholder.jsx';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-center transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="h-16 w-16 overflow-hidden rounded-full">
        {category.imageUrl ? (
          <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
        ) : (
          <ProductImagePlaceholder categorySlug={category.slug} className="h-full w-full" />
        )}
      </div>
      <span className="text-sm font-medium text-slate-900 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-400">
        {category.name}
      </span>
    </Link>
  );
}
