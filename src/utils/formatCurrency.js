const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'RWF',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '';
  return formatter.format(amount);
}
