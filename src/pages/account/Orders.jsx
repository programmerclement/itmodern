import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Card, CardBody } from '../../components/common/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Button from '../../components/common/Button.jsx';
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx';
import { useOrders } from '../../hooks/useOrders.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Orders() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useOrders({ page, limit: 10 });

  if (isLoading) return <PageLoader label="Loading orders" />;
  if (isError) return <ErrorState title="Could not load orders" onRetry={refetch} />;

  const orders = data?.orders ?? [];

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Your order history will show up here once you place an order."
        action={<Button to="/shop">Start shopping</Button>}
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">Orders</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order._id} to={`/account/orders/${order.orderNumber}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    &middot; {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(order.total)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {data.pagination.totalPages > 1 && (
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
          className="mt-6"
        />
      )}
    </div>
  );
}
