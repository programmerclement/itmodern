import { useEffect, useState } from 'react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { cn } from '../../utils/cn.js';

const EMPTY_FORM = {
  onlinePaymentEnabled: true,
  momoNumber: '',
  momoName: '',
  bankName: '',
  bankAccountName: '',
  bankAccountNumber: '',
};

export default function PaymentSettingsForm({ settings, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (settings) {
      setForm({
        onlinePaymentEnabled: settings.onlinePaymentEnabled ?? true,
        momoNumber: settings.momoNumber ?? '',
        momoName: settings.momoName ?? '',
        bankName: settings.bankName ?? '',
        bankAccountName: settings.bankAccountName ?? '',
        bankAccountNumber: settings.bankAccountNumber ?? '',
      });
    }
  }, [settings]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
        <div>
          <p className="text-sm font-medium text-slate-900">Online payment (ITECPAY)</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {form.onlinePaymentEnabled
              ? 'Customers pay by mobile money through the ITECPAY gateway at checkout.'
              : 'Checkout instead shows the momo/bank details below for customers to pay manually. You confirm receipt from the order page.'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.onlinePaymentEnabled}
          onClick={() => update({ onlinePaymentEnabled: !form.onlinePaymentEnabled })}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
            form.onlinePaymentEnabled ? 'bg-brand-600' : 'bg-slate-300'
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              form.onlinePaymentEnabled ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Mobile money number"
          placeholder="07XX XXX XXX"
          value={form.momoNumber}
          onChange={(e) => update({ momoNumber: e.target.value })}
        />
        <Input
          label="Mobile money account name"
          placeholder="e.g. ITMODERN LTD"
          value={form.momoName}
          onChange={(e) => update({ momoName: e.target.value })}
        />
        <Input
          label="Bank name"
          placeholder="e.g. Bank of Kigali"
          value={form.bankName}
          onChange={(e) => update({ bankName: e.target.value })}
        />
        <Input
          label="Bank account name"
          value={form.bankAccountName}
          onChange={(e) => update({ bankAccountName: e.target.value })}
        />
        <Input
          label="Bank account number"
          className="sm:col-span-2"
          value={form.bankAccountNumber}
          onChange={(e) => update({ bankAccountNumber: e.target.value })}
        />
      </div>
      <p className="text-xs text-slate-400">
        Shown to customers at checkout only when online payment is switched off above.
      </p>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Save payment settings
        </Button>
      </div>
    </form>
  );
}
