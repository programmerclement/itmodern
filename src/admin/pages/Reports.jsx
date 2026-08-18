import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as reportService from '../../services/reportService.js';
import { ORDER_STATUSES } from '../../constants/orderStatuses.js';

export default function Reports() {
  const toast = useToast();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const filters = {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status || undefined,
  };

  const handleExportCsv = async () => {
    setIsExportingCsv(true);
    try {
      await reportService.downloadOrdersCsv(filters);
    } catch (err) {
      toast.error('Could not export report', err.message);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await reportService.downloadOrdersPdf(filters);
    } catch (err) {
      toast.error('Could not export report', err.message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Orders export</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-sm text-slate-500">
            Download orders as CSV or PDF, optionally filtered by date range and status. Leave dates blank to export
            all orders.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="From" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="To" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button leftIcon={<Download className="h-4 w-4" />} isLoading={isExportingCsv} onClick={handleExportCsv}>
              Download CSV
            </Button>
            <Button
              variant="outline"
              leftIcon={<FileText className="h-4 w-4" />}
              isLoading={isExportingPdf}
              onClick={handleExportPdf}
            >
              Download PDF
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
