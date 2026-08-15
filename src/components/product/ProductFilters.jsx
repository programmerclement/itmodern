import { Link } from 'react-router-dom';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useCategories } from '../../hooks/useCategories.js';
import { useBrands } from '../../hooks/useBrands.js';

const CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'REFURBISHED', label: 'Refurbished' },
  { value: 'USED', label: 'Used' },
];

function toArray(value) {
  return value ? value.split(',').filter(Boolean) : [];
}

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function ProductFilters({ filters, onChange, activeCategory, currentCategorySlug }) {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const selectedBrands = toArray(filters.brand);
  const selectedConditions = toArray(filters.condition);
  const specFields = activeCategory?.specFields?.filter((field) => field.filterable) ?? [];

  const update = (patch) => onChange({ ...patch });

  const handleSpecChange = (key, value) => {
    const nextSpecs = { ...filters.specs };
    if (value) {
      nextSpecs[key] = value;
    } else {
      delete nextSpecs[key];
    }
    update({ specs: nextSpecs });
  };

  const hasActiveFilters =
    filters.brand || filters.condition || filters.minPrice || filters.maxPrice || Object.keys(filters.specs ?? {}).length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Category</h3>
        <div className="flex flex-col gap-1">
          <Link
            to="/shop"
            className={`rounded-lg px-2.5 py-1.5 text-sm ${
              !currentCategorySlug
                ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            All products
          </Link>
          {categories?.map((category) => (
            <Link
              key={category._id}
              to={`/shop/${category.slug}`}
              className={`rounded-lg px-2.5 py-1.5 text-sm ${
                currentCategorySlug === category.slug
                  ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {brands?.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Brand</h3>
          <div className="flex flex-col gap-1.5">
            {brands.map((brand) => (
              <label
                key={brand._id}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => update({ brand: toggleInList(selectedBrands, brand.slug).join(',') })}
                />
                {brand.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Condition</h3>
        <div className="flex flex-col gap-1.5">
          {CONDITIONS.map((condition) => (
            <label
              key={condition.value}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
                checked={selectedConditions.includes(condition.value)}
                onChange={() =>
                  update({ condition: toggleInList(selectedConditions, condition.value).join(',') })
                }
              />
              {condition.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Price range (RWF)</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(event) => update({ minPrice: event.target.value })}
          />
          <span className="text-slate-400 dark:text-slate-500">–</span>
          <Input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(event) => update({ maxPrice: event.target.value })}
          />
        </div>
      </div>

      {specFields.length > 0 && (
        <div className="space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          {specFields.map((field) => (
            <div key={field.key}>
              <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{field.label}</h3>
              {field.type === 'select' && field.options?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {field.options.map((option) => {
                    const isActive = filters.specs?.[field.key] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSpecChange(field.key, isActive ? '' : option)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                          isActive
                            ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-500/15 dark:text-brand-300'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Input
                  value={filters.specs?.[field.key] ?? ''}
                  onChange={(event) => handleSpecChange(field.key, event.target.value)}
                  placeholder={field.label}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => update({ brand: '', condition: '', minPrice: '', maxPrice: '', specs: {} })}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
