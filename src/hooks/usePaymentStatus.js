import { useQuery } from '@tanstack/react-query';
import * as paymentService from '../services/paymentService.js';

const TERMINAL_STATUSES = ['SUCCESSFUL', 'FAILED', 'EXPIRED'];
const POLL_INTERVAL_MS = 4000;

function isTerminal(status) {
  return TERMINAL_STATUSES.includes(status);
}

/**
 * Looks up the latest payment for an order, then actively polls ITECPAY
 * (via GET /payments/status/:reference, which re-checks on each call) until
 * the payment reaches a terminal state.
 */
export function usePaymentStatusByOrder(orderNumber, { enabled = true } = {}) {
  const initialQuery = useQuery({
    queryKey: ['payment', 'by-order', orderNumber],
    queryFn: () => paymentService.getPaymentByOrder(orderNumber),
    enabled: enabled && Boolean(orderNumber),
    select: (result) => result.data.payment,
    retry: false,
  });

  const reference = initialQuery.data?.reference;
  const alreadyTerminal = isTerminal(initialQuery.data?.status);

  const statusQuery = useQuery({
    queryKey: ['payment', 'status', reference],
    queryFn: () => paymentService.getPaymentStatus(reference),
    enabled: enabled && Boolean(reference) && !alreadyTerminal,
    select: (result) => result.data.payment,
    refetchInterval: (query) => (isTerminal(query.state.data?.status) ? false : POLL_INTERVAL_MS),
  });

  const payment = statusQuery.data ?? initialQuery.data;

  return {
    payment,
    isLoading: initialQuery.isLoading,
    isTerminal: payment ? isTerminal(payment.status) : false,
    hasPayment: !initialQuery.isLoading && Boolean(initialQuery.data),
    refetch: statusQuery.refetch,
  };
}
