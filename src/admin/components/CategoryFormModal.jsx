import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Button from '../../components/common/Button.jsx';
import SpecFieldsBuilder from './SpecFieldsBuilder.jsx';

const EMPTY_FORM = { name: '', description: '', imageUrl: '', specFields: [], isActive: true, sortOrder: 0 };

function categoryToForm(category) {
  if (!category) return EMPTY_FORM;
  return {
    name: category.name,
    description: category.description ?? '',
    imageUrl: category.imageUrl ?? '',
    specFields: (category.specFields ?? []).map((field) => ({
      ...field,
      optionsText: (field.options ?? []).join(', '),
    })),
    isActive: category.isActive,
    sortOrder: category.sortOrder ?? 0,
  };
}

export default function CategoryFormModal({ isOpen, onClose, category, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) setForm(categoryToForm(category));
  }, [isOpen, category]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl || undefined,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
      specFields: form.specFields
        .filter((f) => f.key && f.label)
        .map((f) => ({
          key: f.key,
          label: f.label,
          type: f.type,
          unit: f.unit || null,
          filterable: Boolean(f.filterable),
          options:
            f.type === 'select'
              ? f.optionsText
                  .split(',')
                  .map((o) => o.trim())
                  .filter(Boolean)
              : [],
        })),
    };
    await onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit category' : 'Add category'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Name" required value={form.name} onChange={(e) => update({ name: e.target.value })} />
          <Input
            label="Image URL"
            placeholder="Optional"
            value={form.imageUrl}
            onChange={(e) => update({ imageUrl: e.target.value })}
          />
        </div>
        <Textarea label="Description" value={form.description} onChange={(e) => update({ description: e.target.value })} />

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Specification fields</h3>
          <p className="mb-3 text-xs text-slate-500">
            These drive both the shop filters and the admin product form for this category.
          </p>
          <SpecFieldsBuilder fields={form.specFields} onChange={(specFields) => update({ specFields })} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Sort order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => update({ sortOrder: e.target.value })}
          />
          <label className="flex items-center gap-2 pb-2.5 pt-6 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update({ isActive: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Active (visible in shop)
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save category
          </Button>
        </div>
      </form>
    </Modal>
  );
}
