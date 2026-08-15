import { useState } from 'react';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';

const PROVINCES = ['Kigali City', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'];

const EMPTY_FORM = {
  label: 'Home',
  recipientName: '',
  phone: '',
  province: '',
  district: '',
  street: '',
  notes: '',
};

export default function AddressForm({ initialValue, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValue });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Label" name="label" placeholder="Home, Office..." value={form.label} onChange={handleChange} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Recipient name"
          name="recipientName"
          required
          value={form.recipientName}
          onChange={handleChange}
        />
        <Input label="Phone number" name="phone" type="tel" required value={form.phone} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Province" name="province" required value={form.province} onChange={handleChange}>
          <option value="" disabled>
            Select province
          </option>
          {PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </Select>
        <Input label="District" name="district" required value={form.district} onChange={handleChange} />
      </div>
      <Input
        label="Street / detailed directions"
        name="street"
        required
        placeholder="Sector, cell, landmark..."
        value={form.street}
        onChange={handleChange}
      />
      <Input label="Delivery notes" name="notes" placeholder="Optional" value={form.notes} onChange={handleChange} />

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          Save address
        </Button>
      </div>
    </form>
  );
}
