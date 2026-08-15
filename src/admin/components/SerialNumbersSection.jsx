import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card.jsx';
import Select from '../../components/common/Select.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { useOrderSerialNumbers } from '../../hooks/useSerialNumbers.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as serialNumberService from '../../services/serialNumberService.js';

export default function SerialNumbersSection({ order }) {
  const { data: serials, isLoading } = useOrderSerialNumbers(order.orderNumber);
  const queryClient = useQueryClient();
  const toast = useToast();

  const [productId, setProductId] = useState(order.items[0]?.product ?? '');
  const [serialNumber, setSerialNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'serial-numbers', order.orderNumber] });

  const handleAdd = async (event) => {
    event.preventDefault();
    if (!serialNumber.trim()) {
      toast.error('Enter a serial number');
      return;
    }
    setIsSubmitting(true);
    try {
      await serialNumberService.addSerialNumber({
        orderNumber: order.orderNumber,
        productId,
        serialNumber: serialNumber.trim(),
      });
      toast.success('Serial number added');
      setSerialNumber('');
      invalidate();
    } catch (err) {
      toast.error('Could not add serial number', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await serialNumberService.deleteSerialNumber(id);
      toast.success('Serial number removed');
      invalidate();
    } catch (err) {
      toast.error('Could not remove serial number', err.message);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Serial numbers &amp; warranty</CardTitle>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleAdd} className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Select label="Item" value={productId} onChange={(e) => setProductId(e.target.value)} className="sm:max-w-[240px]">
            {order.items.map((item) => (
              <option key={item.product} value={item.product}>
                {item.name}
              </option>
            ))}
          </Select>
          <Input
            label="Serial number"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" isLoading={isSubmitting}>
            Add
          </Button>
        </form>

        {!isLoading && serials?.length > 0 && (
          <ul className="space-y-2">
            {serials.map((serial) => (
              <li key={serial._id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5 text-sm">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-500" />
                  <span className="font-medium text-slate-900">{serial.serialNumber}</span>
                  <Badge variant={serial.status === 'ACTIVE' ? 'success' : 'neutral'}>{serial.status}</Badge>
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(serial._id)}
                  aria-label="Remove serial number"
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
