import { useRef, useState } from 'react';
import { Upload, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card.jsx';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as productImportService from '../../services/productImportService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const EXPECTED_COLUMNS = [
  'SKU', 'Name', 'Category', 'Brand', 'Condition', 'ConditionGrade',
  'CPU', 'RAM', 'Storage', 'StorageType', 'GPU', 'ScreenSize',
  'Price', 'CostPrice', 'Stock', 'Warranty', 'Description',
];

export default function ImportProducts() {
  const inputRef = useRef(null);
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = (event) => {
    const selected = event.target.files?.[0];
    setFile(selected ?? null);
    setPreview(null);
    setResult(null);
  };

  const handlePreview = async () => {
    if (!file) return;
    setIsPreviewing(true);
    try {
      const response = await productImportService.previewImport(file);
      setPreview(response.data);
    } catch (err) {
      toast.error('Could not read file', err.message);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setIsImporting(true);
    try {
      const response = await productImportService.commitImport(file);
      setResult(response.data);
      toast.success(`Imported ${response.data.summary.imported} product(s)`);
    } catch (err) {
      toast.error('Import failed', err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Import products</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload spreadsheet</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="mb-3 text-sm text-slate-500">
            Expected columns (any order, case-insensitive):
          </p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {EXPECTED_COLUMNS.map((col) => (
              <Badge key={col} variant="neutral">
                {col}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />} onClick={() => inputRef.current?.click()}>
              Choose file
            </Button>
            <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileSelect} />
            {file && <span className="text-sm text-slate-600">{file.name}</span>}
            <Button disabled={!file} isLoading={isPreviewing} onClick={handlePreview}>
              Preview
            </Button>
          </div>
        </CardBody>
      </Card>

      {preview && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Preview — {preview.summary.valid} valid, {preview.summary.invalid} invalid of {preview.summary.total} rows
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Table>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Row</Th>
                  <Th>SKU</Th>
                  <Th>Name</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Issues</Th>
                </Tr>
              </Thead>
              <Tbody>
                {preview.rows.map((row) => (
                  <Tr key={row.rowNumber}>
                    <Td>
                      {row.valid ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </Td>
                    <Td>{row.rowNumber}</Td>
                    <Td>{row.sku || '—'}</Td>
                    <Td>{row.name || '—'}</Td>
                    <Td>{row.category || '—'}</Td>
                    <Td>{row.price ? formatCurrency(row.price) : '—'}</Td>
                    <Td className="text-red-600">{row.errors.join('; ')}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {preview.summary.invalid > 0 && (
              <p className="mt-3 text-xs text-slate-500">
                Fix invalid rows in the spreadsheet and re-upload, or continue to import only the valid rows.
              </p>
            )}

            <div className="mt-4 flex justify-end">
              <Button disabled={preview.summary.valid === 0} isLoading={isImporting} onClick={handleImport}>
                Import {preview.summary.valid} valid product(s)
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Import summary</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-slate-700">
              Imported <strong>{result.summary.imported}</strong> of {result.summary.total} rows.
              {result.summary.skipped > 0 && ` ${result.summary.skipped} skipped.`}
            </p>
            {result.errors.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-red-600">
                {result.errors.map((error) => (
                  <li key={error.row}>
                    Row {error.row} ({error.sku || 'no SKU'}): {error.reason}
                  </li>
                ))}
              </ul>
            )}
            <Button to="/admin/products" variant="outline" className="mt-4">
              View products
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
