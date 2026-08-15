import { useEffect, useState } from 'react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const EMPTY_FORM = { contactPhone: '', contactEmail: '', contactAddress: '' };

export default function ContactInfoForm({ settings, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (settings) {
      setForm({
        contactPhone: settings.contactPhone ?? '',
        contactEmail: settings.contactEmail ?? '',
        contactAddress: settings.contactAddress ?? '',
      });
    }
  }, [settings]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Phone number"
        placeholder="+250 7XX XXX XXX"
        value={form.contactPhone}
        onChange={(e) => update({ contactPhone: e.target.value })}
      />
      <Input
        label="Email address"
        type="email"
        placeholder="support@itmodern.rw"
        value={form.contactEmail}
        onChange={(e) => update({ contactEmail: e.target.value })}
      />
      <Input
        label="Address"
        placeholder="e.g. KG 11 Ave, Kigali, Rwanda"
        value={form.contactAddress}
        onChange={(e) => update({ contactAddress: e.target.value })}
      />
      <p className="text-xs text-slate-400">Shown in the highlighted bar above the site navbar.</p>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Save contact info
        </Button>
      </div>
    </form>
  );
}
