import Badge from '../common/Badge.jsx';

const CONDITION_CONFIG = {
  NEW: { label: 'New', variant: 'success' },
  REFURBISHED: { label: 'Refurbished', variant: 'brand' },
  USED: { label: 'Used', variant: 'warning' },
};

export default function ConditionBadge({ condition, conditionGrade, className }) {
  const config = CONDITION_CONFIG[condition] ?? CONDITION_CONFIG.NEW;
  const label = conditionGrade ? `${config.label} · Grade ${conditionGrade}` : config.label;

  return (
    <Badge variant={config.variant} className={className}>
      {label}
    </Badge>
  );
}
