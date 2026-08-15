import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Button from '../../components/common/Button.jsx';

const EMPTY_FORM = { name: '', description: '', logoUrl: '', isActive: true };

export default function BrandFormModal({ isOpen, onClose, brand, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(
        brand
          ? {
              name: brand.name,
              description: brand.description ?? '',
              logoUrl: brand.logoUrl ?? '',
              isActive: brand.isActive,
            }
          : EMPTY_FORM
      );
    }
  }, [isOpen, brand]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ ...form, logoUrl: form.logoUrl || undefined });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={brand ? 'Edit brand' : 'Add brand'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" required value={form.name} onChange={(e) => update({ name: e.target.value })} />
        <Input
          label="Logo URL"
          placeholder="Optional"
          value={form.logoUrl}
          onChange={(e) => update({ logoUrl: e.target.value })}
        />
        <Textarea label="Description" value={form.description} onChange={(e) => update({ description: e.target.value })} />
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update({ isActive: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Active (visible in shop)
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save brand
          </Button>
        </div>
      </form>
    </Modal>
  );
}
