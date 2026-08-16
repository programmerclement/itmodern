import { WHATSAPP_NUMBER } from '../constants/config.js';
import { formatCurrency } from './formatCurrency.js';

export function buildWhatsAppLink(message) {
  const digitsOnly = WHATSAPP_NUMBER.replace(/\D/g, '');
  if (!digitsOnly) return null;

  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

export function buildProductInquiryLink(product) {
  const message = [
    'Hello, I am interested in:',
    product.name,
    '',
    ...(product.sku ? [`SKU: ${product.sku}`] : []),
    `Price: ${formatCurrency(product.price)}`,
  ].join('\n');

  return buildWhatsAppLink(message);
}
