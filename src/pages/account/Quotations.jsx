import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Card, CardBody } from '../../components/common/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import QuotationStatusBadge from '../../components/account/QuotationStatusBadge.jsx';
import { useMyQuotations } from '../../hooks/useQuotations.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Quotations() {
  const { data, isLoading, isError, refetch } = useMyQuotations();

  if (isLoading) return <PageLoader label="Loading quotations" />;
  if (isError) return <ErrorState title="Could not load quotations" onRetry={refetch} />;

  const quotations = data?.quotations ?? [];

  if (quotations.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No quotations yet"
        description="Request a quotation from your cart for bulk or business orders."
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">Quotations</h1>
      <div className="space-y-3">
        {quotations.map((quotation) => (
          <Link key={quotation._id} to={`/account/quotations/${quotation.quotationNumber}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {quotation.quotationNumber}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(quotation.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    &middot; {quotation.items.length} item{quotation.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(quotation.total)}
                  </span>
                  <QuotationStatusBadge status={quotation.status} />
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
