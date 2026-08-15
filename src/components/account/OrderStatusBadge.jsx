import Badge from '../common/Badge.jsx';

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', variant: 'warning' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  PROCESSING: { label: 'Processing', variant: 'info' },
  READY: { label: 'Ready', variant: 'brand' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', variant: 'brand' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
};

export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: 'neutral' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
