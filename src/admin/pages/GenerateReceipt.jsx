import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Receipt as ReceiptIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Button from '../../components/common/Button.jsx';
import ProductPicker from '../components/ProductPicker.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as receiptService from '../../services/receiptService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

// "ram" -> "Ram", "storageType" -> "Storage Type" — good enough to read on a
// receipt without needing the category's specField labels for this.
function humanizeSpecKey(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function buildProductDescription(product) {
  const specs = product.specifications;
  if (specs && typeof specs === 'object') {
    const parts = Object.entries(specs)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${humanizeSpecKey(key)}: ${value}`);
    if (parts.length) return parts.join(', ');
  }
  return product.shortDescription || '';
}

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'MOMO', label: 'MTN Mobile Money' },
  { value: 'AIRTEL_MONEY', label: 'Airtel Money' },
  { value: 'BK', label: 'Bank of Kigali' },
  { value: 'EQUITY_BANK', label: 'Equity Bank' },
  { value: 'OTHER', label: 'Other' },
];

const DEFAULT_WARRANTY_NOTE =
  "Warranty solved by repairing the product or returning goods to the supplier. If neither works, we replace the product. No refund.";

const EMPTY_ITEM = {
  productId: '',
  name: '',
  description: '',
  serialNumber: '',
  unitCost: '',
  quantity: '1',
  warrantyDuration: '',
  warrantyUnit: 'months',
};

function ReceiptItemRow({ item, index, onChange, onRemove, canRemove }) {
  const handlePickProduct = (product) => {
    onChange(index, {
      productId: product._id,
      name: product.name,
      description: buildProductDescription(product),
      unitCost: String(product.price),
      warrantyDuration: product.warranty?.duration ? String(product.warranty.duration) : '',
      warrantyUnit: product.warranty?.unit ?? 'months',
    });
  };

  const handleClearProduct = () => {
    onChange(index, { productId: '' });
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ProductPicker
          selectedLabel={item.productId ? item.name : ''}
          onSelect={handlePickProduct}
          onClear={handleClearProduct}
        />
        <Input
          label="Item name"
          required
          value={item.name}
          onChange={(e) => onChange(index, { name: e.target.value })}
        />
      </div>

      <Textarea
        label="Description / specs"
        rows={2}
        placeholder="e.g. Processor i5, Ram 8gb, SSD 256gb"
        helperText={item.productId ? 'Auto-filled from the product’s specifications — edit freely.' : undefined}
        value={item.description}
        onChange={(e) => onChange(index, { description: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Input
          label="Serial number"
          className="col-span-2 sm:col-span-1"
          value={item.serialNumber}
          onChange={(e) => onChange(index, { serialNumber: e.target.value })}
        />
        <Input
          label="Unit cost"
          type="number"
          min="0"
          required
          value={item.unitCost}
          onChange={(e) => onChange(index, { unitCost: e.target.value })}
        />
        <Input
          label="Quantity"
          type="number"
          min="1"
          required
          value={item.quantity}
          onChange={(e) => onChange(index, { quantity: e.target.value })}
        />
        <Input
          label="Warranty"
          type="number"
          min="0"
          placeholder="0"
          value={item.warrantyDuration}
          onChange={(e) => onChange(index, { warrantyDuration: e.target.value })}
        />
        <Select
          label="Unit"
          value={item.warrantyUnit}
          onChange={(e) => onChange(index, { warrantyUnit: e.target.value })}
        >
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">
          Amount: {formatCurrency((Number(item.unitCost) || 0) * (Number(item.quantity) || 0))}
        </p>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label="Remove item"
            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function GenerateReceipt() {
  const navigate = useNavigate();
  const toast = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [warrantyNote, setWarrantyNote] = useState(DEFAULT_WARRANTY_NOTE);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateItem = (index, patch) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.unitCost) || 0) * (Number(item.quantity) || 0),
    0
  );
  const total = Math.max(0, subtotal - (Number(discount) || 0));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (items.some((item) => !item.name.trim() || !item.unitCost)) {
      toast.error('Every item needs a name and unit cost');
      return;
    }

    // Opened here, synchronously in the click handler, so the browser
    // doesn't treat it as a blocked popup — filled in with the actual PDF
    // once the receipt has been created below.
    const previewTab = receiptService.openBlankTab();

    setIsSubmitting(true);
    try {
      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        items: items.map((item) => ({
          productId: item.productId || undefined,
          name: item.name,
          description: item.description,
          serialNumber: item.serialNumber,
          unitCost: Number(item.unitCost),
          quantity: Number(item.quantity) || 1,
          warrantyDuration: item.warrantyDuration ? Number(item.warrantyDuration) : undefined,
          warrantyUnit: item.warrantyDuration ? item.warrantyUnit : undefined,
        })),
        discount: Number(discount) || 0,
        paymentMethod,
        warrantyNote,
        notes,
      };

      const result = await receiptService.createReceipt(payload);
      const receiptNumber = result.data.receipt.receiptNumber;
      toast.success(
        'Receipt created',
        customerPhone.trim() ? `${receiptNumber} — SMS sent to customer` : receiptNumber
      );
      await receiptService.loadPdfIntoTab(previewTab, receiptNumber);
      navigate('/admin/receipts');
    } catch (err) {
      if (previewTab && !previewTab.closed) previewTab.close();
      toast.error('Could not create receipt', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Generate receipt</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <Input
              label="Phone number"
              type="tel"
              helperText="Optional — if given, the receipt confirmation is sent to it by SMS."
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <Input
              label="Email address"
              type="email"
              className="sm:col-span-2"
              helperText="Optional — lets you email the receipt to the customer later from the Receipts list."
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {items.map((item, index) => (
              <ReceiptItemRow
                key={index}
                item={item}
                index={index}
                onChange={updateItem}
                onRemove={removeItem}
                canRemove={items.length > 1}
              />
            ))}
            <Button type="button" variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={addItem}>
              Add item
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Paid via" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Discount"
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 border-t border-slate-100 pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {Number(discount) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(Number(discount))}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warranty terms &amp; notes</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Textarea
              label="Warranty terms"
              rows={3}
              value={warrantyNote}
              onChange={(e) => setWarrantyNote(e.target.value)}
            />
            <Textarea
              label="Extra notes"
              rows={2}
              placeholder="Optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardBody>
        </Card>

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting} leftIcon={<ReceiptIcon className="h-4 w-4" />}>
          Generate receipt &amp; preview PDF
        </Button>
      </form>
    </div>
  );
}
