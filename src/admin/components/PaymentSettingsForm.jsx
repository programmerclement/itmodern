import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { cn } from '../../utils/cn.js';

const EMPTY_MOMO_ACCOUNT = { label: '', number: '', name: '', merchantCode: '' };
const EMPTY_BANK_ACCOUNT = { bankName: '', accountName: '', accountNumber: '' };
const EMPTY_FORM = { onlinePaymentEnabled: true, momoAccounts: [], bankAccounts: [] };

export default function PaymentSettingsForm({ settings, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (settings) {
      setForm({
        onlinePaymentEnabled: settings.onlinePaymentEnabled ?? true,
        momoAccounts: settings.momoAccounts?.length ? settings.momoAccounts : [],
        bankAccounts: settings.bankAccounts?.length ? settings.bankAccounts : [],
      });
    }
  }, [settings]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const updateMomo = (index, patch) => {
    update({ momoAccounts: form.momoAccounts.map((a, i) => (i === index ? { ...a, ...patch } : a)) });
  };
  const addMomo = () => update({ momoAccounts: [...form.momoAccounts, { ...EMPTY_MOMO_ACCOUNT }] });
  const removeMomo = (index) => update({ momoAccounts: form.momoAccounts.filter((_, i) => i !== index) });

  const updateBank = (index, patch) => {
    update({ bankAccounts: form.bankAccounts.map((a, i) => (i === index ? { ...a, ...patch } : a)) });
  };
  const addBank = () => update({ bankAccounts: [...form.bankAccounts, { ...EMPTY_BANK_ACCOUNT }] });
  const removeBank = (index) => update({ bankAccounts: form.bankAccounts.filter((_, i) => i !== index) });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
        <div>
          <p className="text-sm font-medium text-slate-900">Online payment (ITECPAY)</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {form.onlinePaymentEnabled
              ? 'Customers pay by mobile money through the ITECPAY gateway at checkout.'
              : 'Checkout instead shows the pay-to accounts below for customers to pay manually. You confirm receipt from the order page.'}
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

      <div>
        <p className="mb-1 text-sm font-medium text-slate-900">Mobile money accounts</p>
        <p className="mb-3 text-xs text-slate-500">
          Add one per network (MTN, Airtel, ...). Set a merchant code to also show a ready-to-dial{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">*182*8*1*code*amount#</code> payment code.
        </p>
        <div className="space-y-3">
          {form.momoAccounts.map((account, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-12 sm:items-end">
              <div className="sm:col-span-3">
                <Input
                  label="Label"
                  placeholder="MTN MoMo"
                  value={account.label}
                  onChange={(e) => updateMomo(index, { label: e.target.value })}
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  label="Phone number"
                  placeholder="07XX XXX XXX"
                  value={account.number}
                  onChange={(e) => updateMomo(index, { number: e.target.value })}
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  label="Account name"
                  placeholder="e.g. ITMODERN LTD"
                  value={account.name}
                  onChange={(e) => updateMomo(index, { name: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Merchant code"
                  placeholder="Optional"
                  value={account.merchantCode}
                  onChange={(e) => updateMomo(index, { merchantCode: e.target.value })}
                />
              </div>
              <div className="flex justify-end sm:col-span-1">
                <button
                  type="button"
                  onClick={() => removeMomo(index)}
                  aria-label="Remove mobile money account"
                  className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={addMomo}>
            Add mobile money account
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-900">Bank accounts</p>
        <div className="space-y-3">
          {form.bankAccounts.map((account, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-12 sm:items-end">
              <div className="sm:col-span-3">
                <Input
                  label="Bank name"
                  placeholder="e.g. Bank of Kigali"
                  value={account.bankName}
                  onChange={(e) => updateBank(index, { bankName: e.target.value })}
                />
              </div>
              <div className="sm:col-span-4">
                <Input
                  label="Account name"
                  value={account.accountName}
                  onChange={(e) => updateBank(index, { accountName: e.target.value })}
                />
              </div>
              <div className="sm:col-span-4">
                <Input
                  label="Account number"
                  value={account.accountNumber}
                  onChange={(e) => updateBank(index, { accountNumber: e.target.value })}
                />
              </div>
              <div className="flex justify-end sm:col-span-1">
                <button
                  type="button"
                  onClick={() => removeBank(index)}
                  aria-label="Remove bank account"
                  className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={addBank}>
            Add bank account
          </Button>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        All accounts are shown to customers at checkout, with tap-to-copy, only when online payment is switched off
        above.
      </p>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Save payment settings
        </Button>
      </div>
    </form>
  );
}
