import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Badge from '../../components/common/Badge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx';
import { useAdminOrders } from '../../hooks/useAdminOrders.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { ORDER_STATUSES } from '../../constants/orderStatuses.js';

const PAYMENT_STATUS_OPTIONS = ['PENDING', 'PAID', 'FAILED'];

export default function Orders() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [page, setPage] = useState(1);

  const params = { search: search || undefined, status: status || undefined, paymentStatus: paymentStatus || undefined, page, limit: 10 };
  const { data, isLoading, isError, refetch } = useAdminOrders(params);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Orders</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search order #, name, phone..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-[200px]"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
        <Select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-[180px]"
        >
          <option value="">All payment statuses</option>
          {PAYMENT_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <PageLoader label="Loading orders" />
      ) : isError ? (
        <ErrorState title="Could not load orders" onRetry={refetch} />
      ) : data.orders.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No orders found" description="Try adjusting your filters." />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Total</Th>
                <Th>Payment</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.orders.map((order) => (
                <Tr key={order._id}>
                  <Td>
                    <Link to={`/admin/orders/${order.orderNumber}`} className="font-medium text-slate-900 hover:text-brand-700">
                      {order.orderNumber}
                    </Link>
                  </Td>
                  <Td>
                    <p>{order.customerName}</p>
                    <p className="text-xs text-slate-400">{order.customerEmail}</p>
                  </Td>
                  <Td>{formatCurrency(order.total)}</Td>
                  <Td>
                    <Badge variant={order.paymentStatus === 'PAID' ? 'success' : order.paymentStatus === 'FAILED' ? 'danger' : 'warning'}>
                      {order.paymentStatus}
                    </Badge>
                  </Td>
                  <Td>
                    <OrderStatusBadge status={order.status} />
                  </Td>
                  <Td className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.pagination.totalPages > 1 && (
            <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} className="mt-6" />
          )}
        </>
      )}
    </div>
  );
}
