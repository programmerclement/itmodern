import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Star,
  Pencil,
  Package,
  Eye,
  EyeOff,
  Archive,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  PackageX,
} from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProductImagePlaceholder from '../../components/product/ProductImagePlaceholder.jsx';
import StatCard from '../components/StatCard.jsx';
import AdjustStockModal from '../components/AdjustStockModal.jsx';
import { useAdminProducts, useAdminProductStats } from '../../hooks/useAdminProducts.js';
import { useAdminCategories } from '../../hooks/useAdminCategories.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as productService from '../../services/productService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { cn } from '../../utils/cn.js';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const FEATURED_OPTIONS = [
  { value: '', label: 'Featured & not' },
  { value: 'true', label: 'Featured only' },
  { value: 'false', label: 'Not featured' },
];

const STOCK_STATUS_OPTIONS = [
  { value: '', label: 'All stock levels' },
  { value: 'in_stock', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [page, setPage] = useState(1);
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: categoriesData } = useAdminCategories({ limit: 100 });
  const categories = categoriesData?.categories;
  const { data: stats } = useAdminProductStats();
  const params = {
    search: search || undefined,
    status: status || undefined,
    category: category || undefined,
    featured: featured || undefined,
    stockStatus: stockStatus || undefined,
    page,
    limit: 10,
  };
  const { data, isLoading, isError, refetch } = useAdminProducts(params);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });

  const handleTogglePublish = async (product) => {
    try {
      if (product.status === 'published') {
        await productService.unpublishProduct(product._id);
        toast.success('Moved to draft');
      } else {
        await productService.publishProduct(product._id);
        toast.success('Product published');
      }
      invalidate();
    } catch (err) {
      toast.error('Could not update product', err.message);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await productService.toggleProductFeatured(product._id);
      invalidate();
    } catch (err) {
      toast.error('Could not update product', err.message);
    }
  };

  const handleArchive = async (product) => {
    try {
      await productService.archiveProduct(product._id);
      toast.success('Product archived');
      invalidate();
    } catch (err) {
      toast.error('Could not archive product', err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Products</h1>
        <div className="flex gap-2">
          <Button to="/admin/products/import" variant="outline">
            Import from Excel
          </Button>
          <Button to="/admin/products/new" leftIcon={<Plus className="h-4 w-4" />}>
            Add product
          </Button>
        </div>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard icon={Package} label="Total products" value={stats.total} tone="brand" />
          <StatCard icon={CheckCircle2} label="Published" value={stats.published} tone="emerald" />
          <StatCard icon={Star} label="Featured" value={stats.featured} tone="accent" />
          <StatCard icon={AlertTriangle} label="Low stock" value={stats.lowStock} tone="amber" />
          <StatCard icon={PackageX} label="Out of stock" value={stats.outOfStock} tone="rose" />
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          placeholder="Search by name or SKU..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c._id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={featured}
          onChange={(e) => {
            setFeatured(e.target.value);
            setPage(1);
          }}
        >
          {FEATURED_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={stockStatus}
          onChange={(e) => {
            setStockStatus(e.target.value);
            setPage(1);
          }}
        >
          {STOCK_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <PageLoader label="Loading products" />
      ) : isError ? (
        <ErrorState title="Could not load products" onRetry={refetch} />
      ) : data.products.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description="Try adjusting your filters." />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Product</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.products.map((product) => {
                const mainImage = product.images?.find((img) => img.isMain) ?? product.images?.[0];
                return (
                  <Tr key={product._id}>
                    <Td>
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-50">
                        {mainImage ? (
                          <img src={mainImage.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ProductImagePlaceholder categorySlug={product.category?.slug} className="h-full w-full" />
                        )}
                      </div>
                    </Td>
                    <Td>
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="font-medium text-slate-900 hover:text-brand-700"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-slate-400">{product.sku || '—'}</p>
                    </Td>
                    <Td>{product.category?.name ?? '—'}</Td>
                    <Td>{formatCurrency(product.price)}</Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => setAdjustingProduct(product)}
                        aria-label={`Adjust stock for ${product.name}`}
                        title="Adjust stock"
                        className={cn(
                          'rounded-md px-1.5 py-0.5 font-medium hover:bg-slate-100',
                          product.stockQuantity === 0
                            ? 'text-red-600'
                            : product.stockQuantity <= (product.lowStockThreshold ?? 3)
                              ? 'text-amber-600'
                              : 'text-slate-700'
                        )}
                      >
                        {product.stockQuantity}
                      </button>
                    </Td>
                    <Td>
                      <Badge
                        variant={
                          product.status === 'published'
                            ? 'success'
                            : product.status === 'archived'
                              ? 'neutral'
                              : 'warning'
                        }
                      >
                        {product.status}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View live product page"
                          title="View live"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${product._id}`}
                          aria-label="Edit product"
                          title="Edit"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(product)}
                          aria-label="Toggle featured"
                          title={product.featured ? 'Unfeature' : 'Feature'}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                          <Star className={product.featured ? 'h-4 w-4 fill-amber-400 text-amber-400' : 'h-4 w-4'} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(product)}
                          aria-label={product.status === 'published' ? 'Unpublish product' : 'Publish product'}
                          title={product.status === 'published' ? 'Unpublish' : 'Publish'}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                          {product.status === 'published' ? (
                            <Eye className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        {product.status !== 'archived' && (
                          <button
                            type="button"
                            onClick={() => handleArchive(product)}
                            aria-label="Archive product"
                            title="Archive"
                            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>

          {data.pagination.totalPages > 1 && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
              className="mt-6"
            />
          )}
        </>
      )}

      <AdjustStockModal
        isOpen={Boolean(adjustingProduct)}
        onClose={() => setAdjustingProduct(null)}
        product={adjustingProduct}
        onAdjusted={invalidate}
      />
    </div>
  );
}
