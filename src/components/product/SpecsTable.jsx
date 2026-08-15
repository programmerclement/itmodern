export default function SpecsTable({ specifications = {}, specFields = [] }) {
  const entries =
    specFields.length > 0
      ? specFields
          .filter((field) => specifications[field.key] !== undefined && specifications[field.key] !== '')
          .map((field) => ({
            label: field.label,
            value: specifications[field.key],
            unit: field.unit,
          }))
      : Object.entries(specifications).map(([key, value]) => ({ label: key, value, unit: null }));

  if (!entries.length) return null;

  return (
    <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
      {entries.map((entry) => (
        <div key={entry.label} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
          <dt className="text-slate-500 dark:text-slate-400">{entry.label}</dt>
          <dd className="font-medium text-slate-900 dark:text-slate-100">
            {entry.value}
            {entry.unit ? ` ${entry.unit}` : ''}
          </dd>
        </div>
      ))}
    </dl>
  );
}
