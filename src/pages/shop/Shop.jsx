import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import ProductFilters from '../../components/product/ProductFilters.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Drawer from '../../components/common/Drawer.jsx';
import { useProducts } from '../../hooks/useProducts.js';
import { useCategory } from '../../hooks/useCategories.js';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

const SPEC_PREFIX = 'spec.';

export default function Shop() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');

  const { data: activeCategory } = useCategory(categorySlug);

  const filters = useMemo(() => {
    const specs = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith(SPEC_PREFIX)) specs[key.slice(SPEC_PREFIX.length)] = value;
    }
    return {
      brand: searchParams.get('brand') ?? '',
      condition: searchParams.get('condition') ?? '',
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
      sort: searchParams.get('sort') ?? 'newest',
      q: searchParams.get('q') ?? '',
      page: Number(searchParams.get('page') ?? 1),
      specs,
    };
  }, [searchParams]);

  useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  const updateFilters = (patch, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(patch)) {
      if (key === 'specs') {
        for (const specKey of Object.keys(filters.specs)) next.delete(`${SPEC_PREFIX}${specKey}`);
        for (const [specKey, specValue] of Object.entries(value ?? {})) {
          if (specValue) next.set(`${SPEC_PREFIX}${specKey}`, specValue);
        }
        continue;
      }
      if (value) next.set(key, value);
      else next.delete(key);
    }

    if (resetPage) next.delete('page');
    setSearchParams(next);
  };

  const queryParams = useMemo(() => {
    const params = {
      category: categorySlug || undefined,
      brand: filters.brand || undefined,
      condition: filters.condition || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      sort: filters.sort,
      search: filters.q || undefined,
      page: filters.page,
      limit: 20,
    };
    for (const [key, value] of Object.entries(filters.specs)) {
      params[`${SPEC_PREFIX}${key}`] = value;
    }
    return params;
  }, [categorySlug, filters]);

  const { data, isLoading, isError, refetch } = useProducts(queryParams);

  const activeFilterCount =
    (filters.brand ? filters.brand.split(',').filter(Boolean).length : 0) +
    (filters.condition ? filters.condition.split(',').filter(Boolean).length : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    Object.keys(filters.specs ?? {}).length;

  const filterProps = {
    filters,
    onChange: updateFilters,
    activeCategory,
    currentCategorySlug: categorySlug,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {activeCategory?.name ?? 'All products'}
          </h1>
          {activeCategory?.description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{activeCategory.description}</p>
          )}
        </div>

        <form
          className="flex flex-1 items-center gap-2 sm:max-w-sm"
          onSubmit={(event) => {
            event.preventDefault();
            updateFilters({ q: searchInput });
          }}
        >
          <Input
            placeholder="Search products..."
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={
              searchInput ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateFilters({ q: '' });
                  }}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null
            }
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button type="submit" className="shrink-0">
            Search
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters {...filterProps} />
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Button
              variant={activeFilterCount > 0 ? 'primary' : 'outline'}
              size="sm"
              className="lg:hidden"
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white/25 px-1 text-[10px] font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {data?.pagination?.total ?? 0} {data?.pagination?.total === 1 ? 'product' : 'products'}
            </p>
            <Select
              value={filters.sort}
              onChange={(event) => updateFilters({ sort: event.target.value }, { resetPage: false })}
              className="ml-auto w-auto sm:ml-0"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <ProductGrid
            products={data?.products}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />

          {data?.pagination && data.pagination.totalPages > 1 && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={(page) => updateFilters({ page: String(page) }, { resetPage: false })}
              className="mt-8"
            />
          )}
        </div>
      </div>

      <Drawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} title="Filters">
        <ProductFilters {...filterProps} />
      </Drawer>
    </div>
  );
}
