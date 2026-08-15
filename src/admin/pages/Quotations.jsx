import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Select from '../../components/common/Select.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import QuotationStatusBadge from '../../components/account/QuotationStatusBadge.jsx';
import { useAdminQuotations } from '../../hooks/useAdminQuotations.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Quotations() {
  const [status, setStatus] = useState('');
  const { data, isLoading, isError, refetch } = useAdminQuotations({ status: status || undefined, limit: 50 });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Quotations</h1>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-[180px]">
          <option value="">All statuses</option>
          <option value="REQUESTED">Requested</option>
          <option value="QUOTED">Quoted</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="DECLINED">Declined</option>
          <option value="EXPIRED">Expired</option>
        </Select>
      </div>

      {isLoading ? (
        <PageLoader label="Loading quotations" />
      ) : isError ? (
        <ErrorState title="Could not load quotations" onRetry={refetch} />
      ) : data.quotations.length === 0 ? (
        <EmptyState icon={FileText} title="No quotations found" />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Quotation</Th>
              <Th>Customer</Th>
              <Th>Company</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.quotations.map((quotation) => (
              <Tr key={quotation._id}>
                <Td>
                  <Link
                    to={`/admin/quotations/${quotation.quotationNumber}`}
                    className="font-medium text-slate-900 hover:text-brand-700"
                  >
                    {quotation.quotationNumber}
                  </Link>
                </Td>
                <Td>
                  {quotation.customer?.firstName} {quotation.customer?.lastName}
                </Td>
                <Td>{quotation.companyName || '—'}</Td>
                <Td>{formatCurrency(quotation.total)}</Td>
                <Td>
                  <QuotationStatusBadge status={quotation.status} />
                </Td>
                <Td className="text-xs text-slate-500">
                  {new Date(quotation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
