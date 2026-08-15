import Badge from '../common/Badge.jsx';

const STATUS_CONFIG = {
  REQUESTED: { label: 'Requested', variant: 'warning' },
  QUOTED: { label: 'Quoted', variant: 'info' },
  ACCEPTED: { label: 'Accepted', variant: 'success' },
  DECLINED: { label: 'Declined', variant: 'danger' },
  EXPIRED: { label: 'Expired', variant: 'neutral' },
};

export default function QuotationStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: 'neutral' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
