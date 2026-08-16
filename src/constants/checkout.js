// Mirrors backend/src/constants/order.js — used only to preview the total
// before submitting; the backend always computes the authoritative total.
export const DELIVERY_FEE_RWF = 3000;
export const FREE_DELIVERY_THRESHOLD_RWF = 300000;

// Shown when online payment (ITECPAY) is enabled in admin Settings.
export const PAYMENT_METHODS_ONLINE = [
  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery / Pickup', available: true },
  { value: 'MOBILE_MONEY', label: 'Mobile Money (MTN / Airtel / SPENN)', available: true },
  { value: 'CARD', label: 'Card payment', available: false },
];

// Shown instead when the admin has switched online payment off — no gateway
// call is made, the customer pays manually and an admin confirms it later.
export const PAYMENT_METHODS_MANUAL = [
  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery / Pickup', available: true },
  { value: 'MANUAL_TRANSFER', label: 'Mobile Money / Bank Transfer', available: true },
];

export const MOBILE_MONEY_NETWORKS = [
  { value: 'MTN', label: 'MTN Mobile Money' },
  { value: 'AIRTEL', label: 'Airtel Money' },
  { value: 'SPENN', label: 'SPENN' },
];
