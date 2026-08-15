import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx';
import PaymentStatusPanel from '../../components/checkout/PaymentStatusPanel.jsx';
import { useOrder } from '../../hooks/useOrders.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as orderService from '../../services/orderService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { cn } from '../../utils/cn.js';

const PIPELINE = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
const CANCELLABLE_STATUSES = ['PENDING', 'CONFIRMED'];

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const { data: order, isLoading, isError, refetch } = useOrder(orderNumber);
  const toast = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  if (isLoading) return <PageLoader label="Loading order" />;
  if (isError || !order) return <ErrorState title="Order not found" onRetry={refetch} />;

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await orderService.cancelOrder(order.orderNumber);
      toast.success('Order cancelled');
      refetch();
    } catch (err) {
      toast.error('Could not cancel order', err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const isCancelled = order.status === 'CANCELLED';
  const currentIndex = PIPELINE.indexOf(order.status);
  const historyByStatus = new Map(order.statusHistory.map((entry) => [entry.status, entry]));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{order.orderNumber}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-6">
        <PaymentStatusPanel order={order} />
      </div>

      {!isCancelled && (
        <Card className="mb-6">
          <CardBody>
            <ol className="space-y-4">
              {PIPELINE.map((status, index) => {
                const entry = historyByStatus.get(status);
                const reached = index <= currentIndex;
                return (
                  <li key={status} className="flex items-start gap-3">
                    <span
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                        reached
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                      )}
                    >
                      {reached ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>
                    <span>
                      <span
                        className={cn(
                          'block text-sm font-medium',
                          reached ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
                        )}
                      >
                        {status.replace(/_/g, ' ')}
                      </span>
                      {entry && (
                        <span className="block text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(entry.changedAt)}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </CardBody>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          {order.items.map((item) => (
            <div key={item.product} className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                {item.name} &times; {item.quantity}
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
          <div className="space-y-1.5 border-t border-slate-100 pt-3 text-sm dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
              <span className="text-slate-900 dark:text-slate-100">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Delivery fee</span>
              <span className="text-slate-900 dark:text-slate-100">
                {order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{order.deliveryMethod === 'DELIVERY' ? 'Delivery details' : 'Pickup details'}</CardTitle>
        </CardHeader>
        <CardBody className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          <p>
            {order.customerName} &middot; {order.customerPhone}
          </p>
          {order.address && (
            <p>
              {order.address.street}, {order.address.district}, {order.address.province}
            </p>
          )}
          {order.notes && <p className="text-slate-500 dark:text-slate-400">Note: {order.notes}</p>}
          <p className="pt-2 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Payment: {order.paymentMethod.replace(/_/g, ' ')}
          </p>
        </CardBody>
      </Card>

      {CANCELLABLE_STATUSES.includes(order.status) && (
        <Button variant="outline" isLoading={isCancelling} onClick={handleCancel}>
          Cancel order
        </Button>
      )}
    </div>
  );
}
