import { ShieldCheck } from 'lucide-react';
import { Card, CardBody } from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ProductImagePlaceholder from '../../components/product/ProductImagePlaceholder.jsx';
import { useMyWarranties } from '../../hooks/useSerialNumbers.js';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Warranty() {
  const { data: serials, isLoading } = useMyWarranties();

  if (isLoading) return <PageLoader label="Loading warranties" />;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">Warranty</h1>

      {serials?.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No registered devices"
          description="Serial numbers for your delivered orders will appear here once registered."
        />
      ) : (
        <div className="space-y-3">
          {serials?.map((serial) => (
            <Card key={serial._id}>
              <CardBody className="flex gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800">
                  {serial.product?.images?.[0] ? (
                    <img src={serial.product.images[0].url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ProductImagePlaceholder className="h-full w-full" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{serial.product?.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">S/N: {serial.serialNumber}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge variant={serial.status === 'ACTIVE' ? 'success' : 'neutral'}>{serial.status}</Badge>
                    {serial.warrantyEnd && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {serial.status === 'ACTIVE' ? 'Until' : 'Expired'} {formatDate(serial.warrantyEnd)}
                      </span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
