import { axiosClient } from '../api/axiosClient.js';

export async function downloadOrdersCsv({ startDate, endDate, status } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  if (status) params.set('status', status);

  const response = await axiosClient.get(`/orders/admin/export?${params.toString()}`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(response);
  const link = document.createElement('a');
  link.href = url;
  link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
