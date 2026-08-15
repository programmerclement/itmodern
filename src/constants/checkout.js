// Mirrors backend/src/constants/order.js — used only to preview the total
// before submitting; the backend always computes the authoritative total.
export const DELIVERY_FEE_RWF = 3000;
export const FREE_DELIVERY_THRESHOLD_RWF = 300000;

export const PAYMENT_METHODS = [
  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery / Pickup', available: true },
  { value: 'MOBILE_MONEY', label: 'Mobile Money (MTN / Airtel / SPENN)', available: true },
  { value: 'CARD', label: 'Card payment', available: false },
];

export const MOBILE_MONEY_NETWORKS = [
  { value: 'MTN', label: 'MTN Mobile Money' },
  { value: 'AIRTEL', label: 'Airtel Money' },
  { value: 'SPENN', label: 'SPENN' },
];
