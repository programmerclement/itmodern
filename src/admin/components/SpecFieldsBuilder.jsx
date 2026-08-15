import { Plus, Trash2 } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';

const EMPTY_FIELD = { key: '', label: '', type: 'text', unit: '', optionsText: '', filterable: false };

export default function SpecFieldsBuilder({ fields = [], onChange }) {
  const update = (index, patch) => {
    onChange(fields.map((field, i) => (i === index ? { ...field, ...patch } : field)));
  };

  const addField = () => onChange([...fields, { ...EMPTY_FIELD }]);
  const removeField = (index) => onChange(fields.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-3">
            <Input
              label="Key"
              placeholder="ram"
              value={field.key}
              onChange={(e) => update(index, { key: e.target.value })}
            />
          </div>
          <div className="sm:col-span-3">
            <Input
              label="Label"
              placeholder="RAM"
              value={field.label}
              onChange={(e) => update(index, { label: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Select label="Type" value={field.type} onChange={(e) => update(index, { type: e.target.value })}>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
              <option value="boolean">Boolean</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Input label="Unit" placeholder="GB" value={field.unit} onChange={(e) => update(index, { unit: e.target.value })} />
          </div>
          <div className="flex items-center gap-2 sm:col-span-1">
            <label className="flex items-center gap-1.5 pb-2.5 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={field.filterable}
                onChange={(e) => update(index, { filterable: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Filter
            </label>
          </div>
          <div className="flex justify-end sm:col-span-1">
            <button
              type="button"
              onClick={() => removeField(index)}
              aria-label="Remove field"
              className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {field.type === 'select' && (
            <div className="sm:col-span-12">
              <Input
                label="Options (comma-separated)"
                placeholder="8GB, 16GB, 32GB"
                value={field.optionsText}
                onChange={(e) => update(index, { optionsText: e.target.value })}
              />
            </div>
          )}
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={addField}>
        Add spec field
      </Button>
    </div>
  );
}
