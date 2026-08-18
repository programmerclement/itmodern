import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, ShieldQuestion, Search } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { Card, CardBody } from '../../components/common/Card.jsx';
import * as receiptService from '../../services/receiptService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function VerifyReceipt() {
  const { receiptNumber: receiptNumberParam } = useParams();
  const [receiptNumber, setReceiptNumber] = useState(receiptNumberParam ?? '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const runCheck = async (value) => {
    if (!value.trim()) return;
    setIsChecking(true);
    setError('');
    setResult(null);
    try {
      const response = await receiptService.verifyReceipt(value.trim());
      setResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (receiptNumberParam) runCheck(receiptNumberParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiptNumberParam]);

  const handleSubmit = (event) => {
    event.preventDefault();
    runCheck(receiptNumber);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-brand-600 dark:text-brand-400" />
        <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">Verify a receipt</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Enter the receipt number printed on your ITMODERN receipt to confirm it's genuine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
        <Input
          placeholder="Receipt number (e.g. RCT-20260818-0001)"
          value={receiptNumber}
          onChange={(e) => setReceiptNumber(e.target.value.toUpperCase())}
          className="flex-1"
        />
        <Button type="submit" isLoading={isChecking} leftIcon={<Search className="h-4 w-4" />}>
          Check
        </Button>
      </form>

      {error && (
        <Card className="mt-6">
          <CardBody className="flex flex-col items-center gap-2 py-8 text-center">
            <ShieldQuestion className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">{error}</p>
          </CardBody>
        </Card>
      )}

      {result && (
        <Card className="mt-6">
          <CardBody className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              This is a genuine ITMODERN receipt.
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Receipt #</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{result.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Issued to</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{result.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Date</span>
                <span className="text-slate-700 dark:text-slate-300">{formatDate(result.issuedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(result.total)}</span>
              </div>
            </div>

            {result.items?.length > 0 && (
              <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Items
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  {result.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-slate-400 dark:text-slate-500">&times; {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
