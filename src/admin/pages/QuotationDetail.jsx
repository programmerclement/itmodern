import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/common/Card.jsx';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Button from '../../components/common/Button.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import QuotationStatusBadge from '../../components/account/QuotationStatusBadge.jsx';
import { useQuotation } from '../../hooks/useQuotations.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as quotationService from '../../services/quotationService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

function computeSubtotal(unitPrice, quantity, discountPercent) {
  return Math.round(unitPrice * quantity * (1 - discountPercent / 100));
}

export default function AdminQuotationDetail() {
  const { quotationNumber } = useParams();
  const { data: quotation, isLoading, isError, refetch } = useQuotation(quotationNumber);
  const queryClient = useQueryClient();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [tax, setTax] = useState('0');
  const [deliveryFee, setDeliveryFee] = useState('0');
  const [validUntil, setValidUntil] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (quotation) {
      setItems(
        quotation.items.map((item) => ({
          productId: item.product,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountPercent: item.discountPercent,
        }))
      );
      setTax(String(quotation.tax ?? 0));
      setDeliveryFee(String(quotation.deliveryFee ?? 0));
      setValidUntil(quotation.validUntil ? quotation.validUntil.slice(0, 10) : '');
      setAdminNotes(quotation.adminNotes ?? '');
    }
  }, [quotation]);

  if (isLoading) return <PageLoader label="Loading quotation" />;
  if (isError || !quotation) return <ErrorState title="Quotation not found" onRetry={refetch} />;

  const updateItem = (index, patch) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + computeSubtotal(Number(item.unitPrice) || 0, item.quantity, Number(item.discountPercent) || 0),
    0
  );
  const total = subtotal + (Number(tax) || 0) + (Number(deliveryFee) || 0);

  const handleSendQuote = async () => {
    setIsSaving(true);
    try {
      await quotationService.adminUpdateQuotation(quotation._id, {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          discountPercent: Number(item.discountPercent) || 0,
        })),
        tax: Number(tax) || 0,
        deliveryFee: Number(deliveryFee) || 0,
        validUntil: validUntil || undefined,
        adminNotes,
      });
      toast.success('Quotation sent to customer');
      queryClient.invalidateQueries({ queryKey: ['quotations', 'detail', quotationNumber] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'quotations'] });
    } catch (err) {
      toast.error('Could not update quotation', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{quotation.quotationNumber}</h1>
          <p className="text-sm text-slate-500">
            {quotation.companyName || 'No company'} &middot; {quotation.contactPerson || '—'} &middot;{' '}
            {quotation.contactPhone || quotation.contactEmail}
          </p>
        </div>
        <QuotationStatusBadge status={quotation.status} />
      </div>

      {quotation.notes && (
        <Card className="mb-6">
          <CardBody>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">Customer notes: </span>
              {quotation.notes}
            </p>
          </CardBody>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardBody>
          <Table>
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>Qty</Th>
                <Th>Unit price</Th>
                <Th>Discount %</Th>
                <Th>Subtotal</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item, index) => (
                <Tr key={item.productId}>
                  <Td>{item.name}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, { unitPrice: e.target.value })}
                      className="w-32"
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discountPercent}
                      onChange={(e) => updateItem(index, { discountPercent: e.target.value })}
                      className="w-24"
                    />
                  </Td>
                  <Td>{formatCurrency(computeSubtotal(Number(item.unitPrice) || 0, item.quantity, Number(item.discountPercent) || 0))}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Tax (RWF)" type="number" value={tax} onChange={(e) => setTax(e.target.value)} />
            <Input label="Delivery fee (RWF)" type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} />
            <Input label="Valid until" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
          <Textarea
            label="Admin notes"
            className="mt-4"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />

          <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <Button className="mt-4" isLoading={isSaving} onClick={handleSendQuote}>
            {quotation.status === 'REQUESTED' ? 'Send quote to customer' : 'Update quote'}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
