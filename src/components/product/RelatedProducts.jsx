import ProductCard from './ProductCard.jsx';

export default function RelatedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">You may also like</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id ?? product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
