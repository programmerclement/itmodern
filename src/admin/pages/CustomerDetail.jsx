import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx';
import { useAdminUser } from '../../hooks/useAdminUsers.js';
import { useAdminOrders } from '../../hooks/useAdminOrders.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as userService from '../../services/userService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

function initialsFor(user) {
  return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
}

export default function CustomerDetail() {
  const { id } = useParams();
  const { data: user, isLoading, isError, refetch } = useAdminUser(id);
  const { data: ordersData } = useAdminOrders({ user: id, limit: 10 });
  const queryClient = useQueryClient();
  const toast = useToast();

  if (isLoading) return <PageLoader label="Loading customer" />;
  if (isError || !user) return <ErrorState title="Customer not found" onRetry={refetch} />;

  const handleToggleStatus = async () => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await userService.adminUpdateUserStatus(user.id, nextStatus);
      toast.success(nextStatus === 'active' ? 'Customer activated' : 'Customer suspended');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    } catch (err) {
      toast.error('Could not update customer', err.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700">
            {initialsFor(user)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{user.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-slate-500">{user.email}</span>
              <Badge variant={user.role === 'admin' ? 'brand' : 'neutral'}>{user.role}</Badge>
              <Badge variant={user.status === 'active' ? 'success' : 'danger'}>{user.status}</Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={handleToggleStatus}>
          {user.status === 'active' ? 'Suspend customer' : 'Activate customer'}
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total spent</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{formatCurrency(user.totalSpent)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Orders</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{user.orderCount}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Phone</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{user.phone ?? '—'}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          {ordersData?.orders?.length ? (
            ordersData.orders.map((order) => (
              <Link
                key={order._id}
                to={`/admin/orders/${order.orderNumber}`}
                className="flex items-center justify-between rounded-lg p-2 text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">{order.orderNumber}</span>
                <span className="text-slate-500">{formatCurrency(order.total)}</span>
                <OrderStatusBadge status={order.status} />
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-400">No orders yet.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
