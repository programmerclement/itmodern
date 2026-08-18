import { axiosClient } from '../api/axiosClient.js';

export const createReceipt = (payload) => axiosClient.post('/receipts', payload);

export const getReceipts = (params) => axiosClient.get('/receipts', { params });

export const getReceiptByNumber = (receiptNumber) => axiosClient.get(`/receipts/${receiptNumber}`);

export const emailReceipt = (receiptNumber, email) =>
  axiosClient.post(`/receipts/${receiptNumber}/email`, email ? { email } : {});

export const verifyReceipt = (receiptNumber) => axiosClient.get(`/receipts/verify/${receiptNumber}`);

// Browsers only allow window.open() to skip the popup blocker when it's
// called synchronously inside a user-gesture handler (a click), before any
// `await`. Call this first, then loadPdfIntoTab() once the PDF is ready —
// splitting it this way lets callers do async work (like creating the
// receipt) in between without the tab getting blocked.
export function openBlankTab() {
  return window.open('', '_blank');
}

export async function loadPdfIntoTab(newTab, receiptNumber) {
  try {
    const blob = await axiosClient.get(`/receipts/${receiptNumber}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(blob);

    if (newTab && !newTab.closed) {
      newTab.location.href = url;
    } else {
      // Popup was blocked anyway — fall back to a same-tab navigation.
      window.location.href = url;
    }

    // Give the browser time to load the blob into the tab before releasing it.
    window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
  } catch (err) {
    if (newTab && !newTab.closed) newTab.close();
    throw err;
  }
}

// Convenience for call sites where the PDF is opened directly from a click
// (no async work in between) — opens a new tab with the browser's native PDF
// viewer, which the admin can download or print from directly.
export async function previewReceiptPdf(receiptNumber) {
  const newTab = openBlankTab();
  await loadPdfIntoTab(newTab, receiptNumber);
}
