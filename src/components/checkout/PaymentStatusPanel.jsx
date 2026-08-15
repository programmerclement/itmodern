import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Smartphone } from 'lucide-react';
import Loader from '../common/Loader.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import { usePaymentStatusByOrder } from '../../hooks/usePaymentStatus.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as paymentService from '../../services/paymentService.js';
import { MOBILE_MONEY_NETWORKS } from '../../constants/checkout.js';

function RetryPaymentForm({ orderNumber, defaultNetwork, onInitiated }) {
  const toast = useToast();
  const [network, setNetwork] = useState(defaultNetwork ?? 'MTN');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRetry = async () => {
    if (!phone.trim()) {
      toast.error('Enter the phone number to charge');
      return;
    }
    setIsSubmitting(true);
    try {
      await paymentService.initiatePayment({ orderNumber, network, phone });
      toast.success('Payment initiated — check your phone.');
      onInitiated();
    } catch (err) {
      toast.error('Could not start payment', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <Select value={network} onChange={(e) => setNetwork(e.target.value)}>
        {MOBILE_MONEY_NETWORKS.map((n) => (
          <option key={n.value} value={n.value}>
            {n.label}
          </option>
        ))}
      </Select>
      <Input type="tel" placeholder="07XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Button isLoading={isSubmitting} onClick={handleRetry}>
        Retry payment
      </Button>
    </div>
  );
}

export default function PaymentStatusPanel({ order }) {
  const isMobileMoney = order.paymentMethod === 'MOBILE_MONEY';
  const { payment, isLoading, refetch } = usePaymentStatusByOrder(order.orderNumber, {
    enabled: isMobileMoney && order.paymentStatus !== 'PAID',
  });

  if (!isMobileMoney) return null;

  if (order.paymentStatus === 'PAID') {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        Payment received. Your order is confirmed.
      </div>
    );
  }

  if (order.status === 'CANCELLED') {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <p>This order was cancelled because payment wasn&apos;t completed in time, and the stock was released.</p>
        <Button to="/shop" size="sm" variant="outline" className="mt-3">
          Start a new order
        </Button>
      </div>
    );
  }

  if (isLoading || !payment) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <Loader size="sm" /> Checking payment status...
      </div>
    );
  }

  if (payment.status === 'PENDING') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        <p className="flex items-center gap-2 font-medium">
          <Smartphone className="h-4 w-4 shrink-0" /> Waiting for payment confirmation
        </p>
        <p className="mt-1 text-amber-700 dark:text-amber-400">
          Check your phone and approve the {payment.network} prompt. This page updates automatically.
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500">
          <Clock className="h-3.5 w-3.5" /> Payment expires in 15 minutes if not completed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
      <p className="flex items-center gap-2 font-medium">
        <XCircle className="h-4 w-4 shrink-0" />
        Payment {payment.status === 'EXPIRED' ? 'expired' : 'failed'}
        <Badge variant="danger">{payment.status}</Badge>
      </p>
      {payment.statusMessage && (
        <p className="mt-1 text-red-700 dark:text-red-400">{payment.statusMessage}</p>
      )}
      <RetryPaymentForm orderNumber={order.orderNumber} defaultNetwork={payment.network} onInitiated={refetch} />
    </div>
  );
}
