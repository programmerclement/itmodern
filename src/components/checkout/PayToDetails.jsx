import { Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

function CopyRow({ label, value, detail }) {
  const toast = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
        {detail && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{detail}</p>}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        title="Copy"
        className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}

// Lists every configured pay-to account (mobile money + bank), each with a
// tap-to-copy value. `amount`, when known (checkout total / order total), is
// used to build a ready-to-dial MTN "pay by code" USSD string alongside any
// momo account that has a merchant code set.
export default function PayToDetails({ settings, amount }) {
  const momoAccounts = settings?.momoAccounts?.filter((a) => a.number) ?? [];
  const bankAccounts = settings?.bankAccounts?.filter((a) => a.accountNumber) ?? [];

  if (!momoAccounts.length && !bankAccounts.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Payment details aren&apos;t set up yet — contact us before placing this order.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {momoAccounts.map((account, index) => (
        <div key={index} className="space-y-1.5">
          <CopyRow label={account.label || 'Mobile money'} value={account.number} detail={account.name} />
          {account.merchantCode && amount != null && (
            <CopyRow
              label="Pay via USSD (dial on your phone)"
              value={`*182*8*1*${account.merchantCode}*${Math.round(amount)}#`}
            />
          )}
        </div>
      ))}
      {bankAccounts.map((account, index) => (
        <CopyRow
          key={index}
          label={account.bankName || 'Bank transfer'}
          value={account.accountNumber}
          detail={account.accountName}
        />
      ))}
    </div>
  );
}
