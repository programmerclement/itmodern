import { axiosClient } from '../api/axiosClient.js';

function buildParams({ startDate, endDate, status } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  if (status) params.set('status', status);
  return params;
}

function triggerDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadOrdersCsv(filters = {}) {
  const params = buildParams(filters);
  const blob = await axiosClient.get(`/orders/admin/export?${params.toString()}`, {
    responseType: 'blob',
  });
  triggerDownload(blob, `orders-${new Date().toISOString().slice(0, 10)}.csv`);
}

export async function downloadOrdersPdf(filters = {}) {
  const params = buildParams(filters);
  const blob = await axiosClient.get(`/orders/admin/export-pdf?${params.toString()}`, {
    responseType: 'blob',
  });
  triggerDownload(blob, `orders-${new Date().toISOString().slice(0, 10)}.pdf`);
}
