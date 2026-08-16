import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Button from '../../components/common/Button.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import SpecificationsEditor from '../components/SpecificationsEditor.jsx';
import { useAdminProduct } from '../../hooks/useAdminProducts.js';
import { useAdminCategories } from '../../hooks/useAdminCategories.js';
import { useAdminBrands } from '../../hooks/useAdminBrands.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as productService from '../../services/productService.js';

const EMPTY_FORM = {
  name: '',
  sku: '',
  category: '',
  brand: '',
  condition: 'NEW',
  conditionGrade: '',
  price: '',
  compareAtPrice: '',
  costPrice: '',
  stockQuantity: '0',
  lowStockThreshold: '3',
  shortDescription: '',
  description: '',
  images: [],
  specifications: {},
  warrantyDuration: '',
  warrantyUnit: 'months',
  tags: '',
  status: 'draft',
  featured: false,
};

function productToForm(product) {
  return {
    name: product.name ?? '',
    sku: product.sku ?? '',
    category: product.category?._id ?? product.category ?? '',
    brand: product.brand?._id ?? product.brand ?? '',
    condition: product.condition ?? 'NEW',
    conditionGrade: product.conditionGrade ?? '',
    price: String(product.price ?? ''),
    compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : '',
    costPrice: product.costPrice != null ? String(product.costPrice) : '',
    stockQuantity: String(product.stockQuantity ?? 0),
    lowStockThreshold: String(product.lowStockThreshold ?? 3),
    shortDescription: product.shortDescription ?? '',
    description: product.description ?? '',
    images: product.images ?? [],
    specifications: product.specifications ?? {},
    warrantyDuration: product.warranty?.duration != null ? String(product.warranty.duration) : '',
    warrantyUnit: product.warranty?.unit ?? 'months',
    tags: (product.tags ?? []).join(', '),
    status: product.status ?? 'draft',
    featured: Boolean(product.featured),
  };
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const { data: product, isLoading: productLoading } = useAdminProduct(id);
  const { data: categoriesData } = useAdminCategories({ limit: 100 });
  const categories = categoriesData?.categories;
  const { data: brandsData } = useAdminBrands({ limit: 100 });
  const brands = brandsData?.brands;

  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) setForm(productToForm(product));
  }, [product]);

  const selectedCategory = categories?.find((c) => c._id === form.category);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name,
      sku: form.sku,
      category: form.category,
      brand: form.brand || undefined,
      condition: form.condition,
      conditionGrade: form.condition === 'NEW' ? undefined : form.conditionGrade || undefined,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      stockQuantity: Number(form.stockQuantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      shortDescription: form.shortDescription,
      description: form.description,
      images: form.images,
      specifications: form.specifications,
      warranty:
        form.warrantyDuration !== ''
          ? { duration: Number(form.warrantyDuration), unit: form.warrantyUnit }
          : { duration: null, unit: null },
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      status: form.status,
      featured: form.featured,
    };

    setIsSubmitting(true);
    try {
      if (isEdit) {
        await productService.updateProduct(id, payload);
        toast.success('Product updated');
      } else {
        await productService.createProduct(payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error('Could not save product', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && productLoading) {
    return <PageLoader label="Loading product" />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">{isEdit ? 'Edit product' : 'Add product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Name" required value={form.name} onChange={(e) => update({ name: e.target.value })} />
            <Input
              label="SKU"
              helperText="Optional — leave blank to auto-manage without one"
              value={form.sku}
              onChange={(e) => update({ sku: e.target.value.toUpperCase() })}
            />
            <Select
              label="Category"
              required
              value={form.category}
              onChange={(e) => update({ category: e.target.value, specifications: {} })}
            >
              <option value="" disabled>
                Select category
              </option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select label="Brand" value={form.brand} onChange={(e) => update({ brand: e.target.value })}>
              <option value="">No brand</option>
              {brands?.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </Select>
            <Select label="Condition" value={form.condition} onChange={(e) => update({ condition: e.target.value })}>
              <option value="NEW">New</option>
              <option value="REFURBISHED">Refurbished</option>
              <option value="USED">Used</option>
            </Select>
            {form.condition !== 'NEW' && (
              <Select
                label="Condition grade"
                required
                value={form.conditionGrade}
                onChange={(e) => update({ conditionGrade: e.target.value })}
              >
                <option value="" disabled>
                  Select grade
                </option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </Select>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing &amp; stock</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Price (RWF)"
              type="number"
              min="0"
              required
              value={form.price}
              onChange={(e) => update({ price: e.target.value })}
            />
            <Input
              label="Compare-at price"
              type="number"
              min="0"
              helperText="Optional — shows a strikethrough discount"
              value={form.compareAtPrice}
              onChange={(e) => update({ compareAtPrice: e.target.value })}
            />
            <Input
              label="Cost price"
              type="number"
              min="0"
              helperText="Internal only — never shown to customers"
              value={form.costPrice}
              onChange={(e) => update({ costPrice: e.target.value })}
            />
            <Input
              label="Stock quantity"
              type="number"
              min="0"
              required
              value={form.stockQuantity}
              onChange={(e) => update({ stockQuantity: e.target.value })}
            />
            <Input
              label="Low stock threshold"
              type="number"
              min="0"
              value={form.lowStockThreshold}
              onChange={(e) => update({ lowStockThreshold: e.target.value })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardBody>
            <ImageUploader images={form.images} onChange={(images) => update({ images })} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardBody>
            <SpecificationsEditor
              specFields={selectedCategory?.specFields ?? []}
              value={form.specifications}
              onChange={(specifications) => update({ specifications })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Short description"
              helperText="Shown on product cards — keep it brief"
              value={form.shortDescription}
              onChange={(e) => update({ shortDescription: e.target.value })}
            />
            <Textarea
              label="Full description"
              rows={5}
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warranty &amp; tags</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Warranty duration"
              type="number"
              min="0"
              value={form.warrantyDuration}
              onChange={(e) => update({ warrantyDuration: e.target.value })}
            />
            <Select label="Warranty unit" value={form.warrantyUnit} onChange={(e) => update({ warrantyUnit: e.target.value })}>
              <option value="days">Days</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </Select>
            <Input
              label="Tags"
              helperText="Comma-separated"
              className="sm:col-span-3"
              value={form.tags}
              onChange={(e) => update({ tags: e.target.value })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Select label="Status" value={form.status} onChange={(e) => update({ status: e.target.value })} className="sm:max-w-[200px]">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>
            <label className="flex items-center gap-2 pb-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update({ featured: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Featured on homepage
            </label>
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
