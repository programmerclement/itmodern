import { useParams } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';
import { Card, CardBody } from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import PaymentStatusPanel from '../../components/checkout/PaymentStatusPanel.jsx';
import { useOrder } from '../../hooks/useOrders.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { data: order, isLoading, isError, refetch } = useOrder(orderNumber);

  if (isLoading) return <PageLoader label="Loading your order" />;
  if (isError || !order) {
    return <ErrorState title="Order not found" onRetry={refetch} />;
  }

  const awaitingPayment = order.paymentMethod === 'MOBILE_MONEY' && order.paymentStatus !== 'PAID';

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        {awaitingPayment ? (
          <Clock className="h-14 w-14 text-amber-500 dark:text-amber-400" />
        ) : (
          <CheckCircle2 className="h-14 w-14 text-emerald-500 dark:text-emerald-400" />
        )}
        <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {awaitingPayment ? 'Order received' : 'Order placed!'}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Order <span className="font-medium text-slate-700 dark:text-slate-200">{order.orderNumber}</span> has been received.
          {awaitingPayment
            ? ' Complete your mobile money payment below to confirm it.'
            : ` We'll be in touch to confirm ${order.deliveryMethod === 'DELIVERY' ? 'delivery' : 'pickup'}.`}
        </p>
      </div>

      <div className="mt-8">
        <PaymentStatusPanel order={order} />
      </div>

      <Card className="mt-6">
        <CardBody className="space-y-4">
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li key={item.product} className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">
                  {item.name} &times; {item.quantity}
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {formatCurrency(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>
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
          {order.deliveryMethod === 'DELIVERY' && order.address && (
            <div className="border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <p className="font-medium text-slate-900 dark:text-slate-100">Delivering to</p>
              <p>{order.address.recipientName} &middot; {order.address.phone}</p>
              <p>
                {order.address.street}, {order.address.district}, {order.address.province}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to={`/account/orders/${order.orderNumber}`} variant="outline">
          View order
        </Button>
        <Button to="/shop">Continue shopping</Button>
      </div>
    </div>
  );
}
