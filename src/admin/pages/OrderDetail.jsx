import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card.jsx';
import Select from '../../components/common/Select.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx';
import SerialNumbersSection from '../components/SerialNumbersSection.jsx';
import { useOrder } from '../../hooks/useOrders.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as orderService from '../../services/orderService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { ORDER_STATUSES } from '../../constants/orderStatuses.js';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrderDetail() {
  const { orderNumber } = useParams();
  const { data: order, isLoading, isError, refetch } = useOrder(orderNumber);
  const queryClient = useQueryClient();
  const toast = useToast();

  const [nextStatus, setNextStatus] = useState('');
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  if (isLoading) return <PageLoader label="Loading order" />;
  if (isError || !order) return <ErrorState title="Order not found" onRetry={refetch} />;

  const handleMarkPaid = async () => {
    setIsMarkingPaid(true);
    try {
      await orderService.adminMarkPaymentReceived(order.orderNumber);
      toast.success('Payment marked as received');
      queryClient.invalidateQueries({ queryKey: ['orders', 'detail', order.orderNumber] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    } catch (err) {
      toast.error('Could not update payment', err.message);
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!nextStatus) {
      toast.error('Select a status');
      return;
    }
    setIsUpdating(true);
    try {
      await orderService.adminUpdateOrderStatus(order.orderNumber, nextStatus, note);
      toast.success('Order status updated');
      setNote('');
      setNextStatus('');
      queryClient.invalidateQueries({ queryKey: ['orders', 'detail', order.orderNumber] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    } catch (err) {
      toast.error('Could not update status', err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{order.orderNumber}</h1>
          <p className="text-sm text-slate-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={order.paymentStatus === 'PAID' ? 'success' : order.paymentStatus === 'FAILED' ? 'danger' : 'warning'}>
            {order.paymentStatus}
          </Badge>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {order.paymentMethod === 'MANUAL_TRANSFER' && order.paymentStatus !== 'PAID' && order.status !== 'CANCELLED' && (
        <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-amber-800">
            This order is paying by mobile money / bank transfer. Confirm once the payment has actually arrived.
          </p>
          <Button size="sm" isLoading={isMarkingPaid} onClick={handleMarkPaid}>
            Mark payment received
          </Button>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Update status</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Select label="New status" value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} className="sm:max-w-[220px]">
            <option value="">Select status</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </Select>
          <Input label="Note" placeholder="Optional" value={note} onChange={(e) => setNote(e.target.value)} className="flex-1" />
          <Button onClick={handleUpdateStatus} isLoading={isUpdating}>
            Update
          </Button>
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status history</CardTitle>
        </CardHeader>
        <CardBody className="space-y-2">
          {order.statusHistory.map((entry, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-slate-700">{entry.status.replace(/_/g, ' ')}</span>
              <span className="text-slate-400">{formatDate(entry.changedAt)}</span>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardBody className="space-y-3">
          {order.items.map((item) => (
            <div key={item.product} className="flex justify-between text-sm">
              <span className="text-slate-600">
                {item.name} &times; {item.quantity}
              </span>
              <span className="font-medium text-slate-900">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
          <div className="space-y-1.5 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery fee</span>
              <span className="text-slate-900">{order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <SerialNumbersSection order={order} />

      <Card>
        <CardHeader>
          <CardTitle>{order.deliveryMethod === 'DELIVERY' ? 'Delivery details' : 'Pickup details'}</CardTitle>
        </CardHeader>
        <CardBody className="space-y-1 text-sm text-slate-600">
          <p>
            {order.customerName} &middot; {order.customerPhone} &middot; {order.customerEmail}
          </p>
          {order.address && (
            <p>
              {order.address.street}, {order.address.district}, {order.address.province}
            </p>
          )}
          {order.notes && <p className="text-slate-500">Note: {order.notes}</p>}
          <p className="pt-2 text-xs uppercase tracking-wide text-slate-400">
            Payment method: {order.paymentMethod.replace(/_/g, ' ')}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
