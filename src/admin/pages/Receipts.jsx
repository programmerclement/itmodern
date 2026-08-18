import { useState } from 'react';
import { Search, Plus, FileText, Mail, Receipt as ReceiptIcon } from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useAdminReceipts } from '../../hooks/useReceipts.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as receiptService from '../../services/receiptService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const PAYMENT_METHOD_LABELS = {
  CASH: 'Cash',
  MOMO: 'MTN MoMo',
  AIRTEL_MONEY: 'Airtel Money',
  BK: 'Bank of Kigali',
  EQUITY_BANK: 'Equity Bank',
  OTHER: 'Other',
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Receipts() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [emailTarget, setEmailTarget] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const toast = useToast();

  const { data, isLoading, isError, refetch } = useAdminReceipts({ search: search || undefined, page, limit: 10 });

  const handlePreview = async (receiptNumber) => {
    try {
      await receiptService.previewReceiptPdf(receiptNumber);
    } catch (err) {
      toast.error('Could not open receipt', err.message);
    }
  };

  const openEmailModal = (receipt) => {
    setEmailTarget(receipt);
    setEmailInput(receipt.customerEmail || '');
  };

  const handleSendEmail = async (event) => {
    event.preventDefault();
    if (!emailInput.trim()) {
      toast.error('Enter an email address');
      return;
    }
    setIsSendingEmail(true);
    try {
      await receiptService.emailReceipt(emailTarget.receiptNumber, emailInput.trim());
      toast.success('Receipt emailed', emailInput.trim());
      setEmailTarget(null);
      refetch();
    } catch (err) {
      toast.error('Could not send email', err.message);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Receipts</h1>
        <Button to="/admin/receipts/new" leftIcon={<Plus className="h-4 w-4" />}>
          Generate receipt
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search receipt #, customer, phone..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
      </div>

      {isLoading ? (
        <PageLoader label="Loading receipts" />
      ) : isError ? (
        <ErrorState title="Could not load receipts" onRetry={refetch} />
      ) : data.receipts.length === 0 ? (
        <EmptyState
          icon={ReceiptIcon}
          title="No receipts yet"
          description="Generate a receipt for an in-person sale to see it here."
          action={
            <Button to="/admin/receipts/new" leftIcon={<Plus className="h-4 w-4" />}>
              Generate receipt
            </Button>
          }
        />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>Receipt #</Th>
                <Th>Customer</Th>
                <Th>Phone</Th>
                <Th>Items</Th>
                <Th>Total</Th>
                <Th>Paid via</Th>
                <Th>Date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.receipts.map((receipt) => (
                <Tr key={receipt._id}>
                  <Td className="font-medium text-slate-900">{receipt.receiptNumber}</Td>
                  <Td>{receipt.customerName}</Td>
                  <Td>{receipt.customerPhone || '—'}</Td>
                  <Td>{receipt.items.length}</Td>
                  <Td>{formatCurrency(receipt.total)}</Td>
                  <Td>{PAYMENT_METHOD_LABELS[receipt.paymentMethod] ?? receipt.paymentMethod}</Td>
                  <Td className="text-xs text-slate-500">{formatDate(receipt.createdAt)}</Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handlePreview(receipt.receiptNumber)}
                        aria-label="Preview PDF"
                        title="Preview / print / download PDF"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEmailModal(receipt)}
                        aria-label="Email receipt"
                        title="Email receipt"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.pagination.totalPages > 1 && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
              className="mt-6"
            />
          )}
        </>
      )}

      <Modal
        isOpen={Boolean(emailTarget)}
        onClose={() => setEmailTarget(null)}
        title={`Email receipt ${emailTarget?.receiptNumber ?? ''}`}
      >
        <form onSubmit={handleSendEmail} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            required
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEmailTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSendingEmail}>
              Send
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
