import { formatCurrency } from './formatCurrency.js';

// wa.me needs the full international number (country code, no leading 0, no
// +) — but admins naturally type local Rwandan format (07XXXXXXXX). Convert
// those, same convention as the backend's Pindo SMS phone normalization
// (toInternational() in sms.service.js): a leading 0 gets replaced by 25,
// which — since the 0 is still part of the digit string — yields 250...
// Anything already starting with a country code passes through untouched.
function toInternational(digits) {
  return digits.startsWith('0') ? `25${digits}` : digits;
}

export function buildWhatsAppLink(number, message) {
  const digitsOnly = (number ?? '').replace(/\D/g, '');
  if (!digitsOnly) return null;

  return `https://wa.me/${toInternational(digitsOnly)}?text=${encodeURIComponent(message)}`;
}

export function buildProductInquiryMessage(product) {
  return [
    'Hello, I am interested in:',
    product.name,
    '',
    ...(product.sku ? [`SKU: ${product.sku}`] : []),
    `Price: ${formatCurrency(product.price)}`,
  ].join('\n');
}
