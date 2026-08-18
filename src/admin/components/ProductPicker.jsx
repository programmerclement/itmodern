import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useAdminProducts } from '../../hooks/useAdminProducts.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

// Live-search combobox for picking a product out of a catalog that can run
// into the hundreds — a plain <select> with every product as an option
// doesn't scale, so this queries the admin products search endpoint as the
// admin types instead of loading everything up front.
export default function ProductPicker({ selectedLabel, onSelect, onClear }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data } = useAdminProducts({
    search: debouncedQuery || undefined,
    status: 'published',
    limit: 8,
  });

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  if (selectedLabel) {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Picked from stock</label>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span className="min-w-0 flex-1 truncate">{selectedLabel}</span>
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear selected product"
            className="shrink-0 rounded-md p-0.5 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">Pick from stock (optional)</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products by name or SKU..."
          className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {data?.products?.length ? (
            data.products.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => {
                  onSelect(product);
                  setQuery('');
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                <span className="min-w-0 flex-1 truncate">
                  {product.name}
                  {product.sku && <span className="ml-1.5 text-xs text-slate-400">{product.sku}</span>}
                </span>
                <span className="shrink-0 text-xs text-slate-500">
                  {formatCurrency(product.price)} &middot; {product.stockQuantity} in stock
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-slate-400">No products found</p>
          )}
        </div>
      )}
    </div>
  );
}
