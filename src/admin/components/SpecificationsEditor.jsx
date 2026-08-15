import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';

export default function SpecificationsEditor({ specFields = [], value = {}, onChange }) {
  if (specFields.length === 0) {
    return <p className="text-sm text-slate-400">Select a category to see its specification fields.</p>;
  }

  const handleFieldChange = (key, fieldValue) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {specFields.map((field) => {
        const currentValue = value[field.key] ?? '';

        if (field.type === 'select' && field.options?.length > 0) {
          return (
            <Select
              key={field.key}
              label={field.label}
              value={currentValue}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            >
              <option value="">Not specified</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          );
        }

        if (field.type === 'boolean') {
          return (
            <label key={field.key} className="flex items-center gap-2 pt-6 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={currentValue === true || currentValue === 'true'}
                onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              {field.label}
            </label>
          );
        }

        return (
          <Input
            key={field.key}
            label={field.unit ? `${field.label} (${field.unit})` : field.label}
            type={field.type === 'number' ? 'number' : 'text'}
            value={currentValue}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );
      })}
    </div>
  );
}
