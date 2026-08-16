import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Boxes, PackageX, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card.jsx';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ProductImagePlaceholder from '../../components/product/ProductImagePlaceholder.jsx';
import AdjustStockModal from '../components/AdjustStockModal.jsx';
import { useLowStock, useOutOfStock } from '../../hooks/useInventory.js';

function ProductStockTable({ products, onAdjust }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Product</Th>
          <Th>SKU</Th>
          <Th>Stock</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product) => {
          const mainImage = product.images?.[0];
          return (
            <Tr key={product._id}>
              <Td>
                <div className="h-9 w-9 overflow-hidden rounded-lg bg-slate-50">
                  {mainImage ? (
                    <img src={mainImage.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ProductImagePlaceholder className="h-full w-full" />
                  )}
                </div>
              </Td>
              <Td className="font-medium text-slate-900">{product.name}</Td>
              <Td className="text-xs text-slate-400">{product.sku || '—'}</Td>
              <Td className={product.stockQuantity === 0 ? 'text-red-600' : 'text-amber-600'}>
                {product.stockQuantity}
              </Td>
              <Td>
                <Button size="sm" variant="outline" onClick={() => onAdjust(product)}>
                  Adjust stock
                </Button>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

function InventorySection({ title, icon, emptyTitle, useHook, search, page, onSearchChange, onPageChange, onAdjust }) {
  const { data, isLoading } = useHook({ search: search || undefined, page, limit: 10 });
  const products = data?.products;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{title}</CardTitle>
        <Input
          placeholder="Search name or SKU..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:max-w-[220px]"
        />
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <PageLoader label="Loading" />
        ) : products?.length === 0 ? (
          <EmptyState
            icon={icon}
            title={emptyTitle}
            description={search ? 'Try adjusting your search.' : undefined}
            className="min-h-[120px] py-4"
          />
        ) : (
          <>
            <ProductStockTable products={products} onAdjust={onAdjust} />
            {data?.pagination.totalPages > 1 && (
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={onPageChange}
                className="mt-4"
              />
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}

export default function Inventory() {
  const [lowSearch, setLowSearch] = useState('');
  const [lowPage, setLowPage] = useState(1);
  const [outSearch, setOutSearch] = useState('');
  const [outPage, setOutPage] = useState(1);
  const queryClient = useQueryClient();

  const [adjustingProduct, setAdjustingProduct] = useState(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Inventory</h1>

      <div className="space-y-6">
        <InventorySection
          title="Low stock"
          icon={Boxes}
          emptyTitle="No low stock products"
          useHook={useLowStock}
          search={lowSearch}
          page={lowPage}
          onSearchChange={(value) => {
            setLowSearch(value);
            setLowPage(1);
          }}
          onPageChange={setLowPage}
          onAdjust={setAdjustingProduct}
        />

        <InventorySection
          title="Out of stock"
          icon={PackageX}
          emptyTitle="No out-of-stock products"
          useHook={useOutOfStock}
          search={outSearch}
          page={outPage}
          onSearchChange={(value) => {
            setOutSearch(value);
            setOutPage(1);
          }}
          onPageChange={setOutPage}
          onAdjust={setAdjustingProduct}
        />
      </div>

      <AdjustStockModal
        isOpen={Boolean(adjustingProduct)}
        onClose={() => setAdjustingProduct(null)}
        product={adjustingProduct}
        onAdjusted={invalidate}
      />
    </div>
  );
}
