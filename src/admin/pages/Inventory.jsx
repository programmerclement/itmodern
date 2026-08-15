import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Boxes, PackageX } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card.jsx';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
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
              <Td className="text-xs text-slate-400">{product.sku}</Td>
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

export default function Inventory() {
  const { data: lowStock, isLoading: lowLoading } = useLowStock();
  const { data: outOfStock, isLoading: outLoading } = useOutOfStock();
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
        <Card>
          <CardHeader>
            <CardTitle>Low stock</CardTitle>
          </CardHeader>
          <CardBody>
            {lowLoading ? (
              <PageLoader label="Loading" />
            ) : lowStock.length === 0 ? (
              <EmptyState icon={Boxes} title="No low stock products" className="min-h-[120px] py-4" />
            ) : (
              <ProductStockTable products={lowStock} onAdjust={setAdjustingProduct} />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Out of stock</CardTitle>
          </CardHeader>
          <CardBody>
            {outLoading ? (
              <PageLoader label="Loading" />
            ) : outOfStock.length === 0 ? (
              <EmptyState icon={PackageX} title="No out-of-stock products" className="min-h-[120px] py-4" />
            ) : (
              <ProductStockTable products={outOfStock} onAdjust={setAdjustingProduct} />
            )}
          </CardBody>
        </Card>
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
