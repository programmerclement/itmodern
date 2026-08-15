import { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, Search } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { Card, CardBody } from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import ProductImagePlaceholder from '../../components/product/ProductImagePlaceholder.jsx';
import * as serialNumberService from '../../services/serialNumberService.js';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function WarrantyCheck() {
  const [serialNumber, setSerialNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async (event) => {
    event.preventDefault();
    if (!serialNumber.trim()) return;

    setIsChecking(true);
    setError('');
    setResult(null);
    try {
      const response = await serialNumberService.checkWarranty(serialNumber.trim());
      setResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-brand-600 dark:text-brand-400" />
        <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">Check warranty status</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Enter the serial number printed on your device to check its warranty.
        </p>
      </div>

      <form onSubmit={handleCheck} className="mt-8 flex gap-2">
        <Input
          placeholder="Serial number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
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
          <CardBody className="flex gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800">
              {result.product?.images?.[0] ? (
                <img src={result.product.images[0].url} alt="" className="h-full w-full object-cover" />
              ) : (
                <ProductImagePlaceholder className="h-full w-full" />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{result.product?.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">S/N: {result.serialNumber}</p>
              <div className="mt-2 flex items-center gap-2">
                {result.status === 'ACTIVE' ? (
                  <Badge variant="success">
                    <ShieldCheck className="h-3 w-3" /> Under warranty
                  </Badge>
                ) : result.status === 'EXPIRED' ? (
                  <Badge variant="danger">
                    <ShieldAlert className="h-3 w-3" /> Warranty expired
                  </Badge>
                ) : (
                  <Badge variant="neutral">No warranty on record</Badge>
                )}
              </div>
              {result.warrantyEnd && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {result.status === 'ACTIVE'
                    ? `Valid until ${formatDate(result.warrantyEnd)} (${result.daysRemaining} days left)`
                    : `Expired on ${formatDate(result.warrantyEnd)}`}
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
