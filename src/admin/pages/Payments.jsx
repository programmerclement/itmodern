import { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Select from '../../components/common/Select.jsx';
import Badge from '../../components/common/Badge.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAdminPayments, useAdminPaymentStats } from '../../hooks/useAdminPayments.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const STATUS_OPTIONS = ['PENDING', 'SUCCESSFUL', 'FAILED', 'EXPIRED'];
const NETWORK_OPTIONS = ['MTN', 'AIRTEL', 'SPENN'];

const STATUS_VARIANT = {
  PENDING: 'warning',
  SUCCESSFUL: 'success',
  FAILED: 'danger',
  EXPIRED: 'neutral',
};

export default function Payments() {
  const [status, setStatus] = useState('');
  const [network, setNetwork] = useState('');

  const { data: stats } = useAdminPaymentStats();
  const { data, isLoading, isError, refetch } = useAdminPayments({
    status: status || undefined,
    network: network || undefined,
    limit: 20,
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Payments</h1>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={DollarSign} label="Revenue (paid)" value={formatCurrency(stats.total.totalRevenue)} />
          <StatCard icon={CheckCircle2} label="Successful" value={stats.total.successfulTransactions} />
          <StatCard icon={Clock} label="Pending" value={stats.total.pendingTransactions} tone="warning" />
          <StatCard icon={CreditCard} label="Failed / expired" value={stats.total.failedTransactions} tone="warning" />
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:max-w-[180px]">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select value={network} onChange={(e) => setNetwork(e.target.value)} className="sm:max-w-[180px]">
          <option value="">All networks</option>
          {NETWORK_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <PageLoader label="Loading payments" />
      ) : isError ? (
        <ErrorState title="Could not load payments" onRetry={refetch} />
      ) : data.payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments found" description="Try adjusting your filters." />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Reference</Th>
              <Th>Customer</Th>
              <Th>Order</Th>
              <Th>Network</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.payments.map((payment) => (
              <Tr key={payment._id}>
                <Td className="text-xs text-slate-500">{payment.reference}</Td>
                <Td>
                  {payment.user ? `${payment.user.firstName} ${payment.user.lastName}` : '—'}
                </Td>
                <Td>{payment.order?.orderNumber ?? '—'}</Td>
                <Td>{payment.network}</Td>
                <Td>{formatCurrency(payment.amount)}</Td>
                <Td>
                  <Badge variant={STATUS_VARIANT[payment.status] ?? 'neutral'}>{payment.status}</Badge>
                </Td>
                <Td className="text-xs text-slate-500">
                  {new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
