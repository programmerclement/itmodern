import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';

const EMPTY_FORM = {
  code: '',
  description: '',
  type: 'PERCENTAGE',
  value: '',
  minOrderAmount: '0',
  maxDiscount: '',
  usageLimit: '',
  startDate: '',
  endDate: '',
  isActive: true,
};

function couponToForm(coupon) {
  if (!coupon) return EMPTY_FORM;
  return {
    code: coupon.code,
    description: coupon.description ?? '',
    type: coupon.type,
    value: String(coupon.value),
    minOrderAmount: String(coupon.minOrderAmount ?? 0),
    maxDiscount: coupon.maxDiscount != null ? String(coupon.maxDiscount) : '',
    usageLimit: coupon.usageLimit != null ? String(coupon.usageLimit) : '',
    startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : '',
    endDate: coupon.endDate ? coupon.endDate.slice(0, 10) : '',
    isActive: coupon.isActive,
  };
}

export default function CouponFormModal({ isOpen, onClose, coupon, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) setForm(couponToForm(coupon));
  }, [isOpen, coupon]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      code: form.code,
      description: form.description,
      type: form.type,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      isActive: form.isActive,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={coupon ? 'Edit coupon' : 'Add coupon'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Code" required value={form.code} onChange={(e) => update({ code: e.target.value.toUpperCase() })} />
          <Select label="Type" value={form.type} onChange={(e) => update({ type: e.target.value })}>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed amount</option>
          </Select>
        </div>
        <Input label="Description" value={form.description} onChange={(e) => update({ description: e.target.value })} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={form.type === 'PERCENTAGE' ? 'Value (%)' : 'Value (RWF)'}
            type="number"
            required
            value={form.value}
            onChange={(e) => update({ value: e.target.value })}
          />
          <Input
            label="Minimum order (RWF)"
            type="number"
            value={form.minOrderAmount}
            onChange={(e) => update({ minOrderAmount: e.target.value })}
          />
          {form.type === 'PERCENTAGE' && (
            <Input
              label="Max discount (RWF)"
              type="number"
              helperText="Optional cap"
              value={form.maxDiscount}
              onChange={(e) => update({ maxDiscount: e.target.value })}
            />
          )}
          <Input
            label="Usage limit"
            type="number"
            helperText="Optional"
            value={form.usageLimit}
            onChange={(e) => update({ usageLimit: e.target.value })}
          />
          <Input label="Start date" type="date" value={form.startDate} onChange={(e) => update({ startDate: e.target.value })} />
          <Input label="End date" type="date" value={form.endDate} onChange={(e) => update({ endDate: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update({ isActive: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Active
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save coupon
          </Button>
        </div>
      </form>
    </Modal>
  );
}
