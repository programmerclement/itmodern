import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Star, Pencil, Package } from 'lucide-react';
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
import { useAdminProducts } from '../../hooks/useAdminProducts.js';
import { useAdminCategories } from '../../hooks/useAdminCategories.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as productService from '../../services/productService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useAdminCategories();
  const params = { search: search || undefined, status: status || undefined, category: category || undefined, page, limit: 20 };
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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by name or SKU..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-[200px]"
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
          className="sm:max-w-[180px]"
        >
          {STATUS_OPTIONS.map((option) => (
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
                      <p className="text-xs text-slate-400">{product.sku}</p>
                    </Td>
                    <Td>{product.category?.name ?? '—'}</Td>
                    <Td>{formatCurrency(product.price)}</Td>
                    <Td>
                      <span className={product.stockQuantity === 0 ? 'text-red-600' : ''}>
                        {product.stockQuantity}
                      </span>
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
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(product)}
                          aria-label="Toggle featured"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                          <Star className={product.featured ? 'h-4 w-4 fill-amber-400 text-amber-400' : 'h-4 w-4'} />
                        </button>
                        <Link
                          to={`/admin/products/${product._id}`}
                          aria-label="Edit product"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Button size="sm" variant="ghost" onClick={() => handleTogglePublish(product)}>
                          {product.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        {product.status !== 'archived' && (
                          <Button size="sm" variant="ghost" onClick={() => handleArchive(product)}>
                            Archive
                          </Button>
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
    </div>
  );
}
