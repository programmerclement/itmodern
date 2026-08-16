import { useState } from 'react';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';

const EMPTY_FORM = { name: '', email: '', phone: '', role: 'customer' };

export default function AddUserFormModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ok = await onSubmit({ ...form, email: form.email || undefined });
    if (ok) setForm(EMPTY_FORM);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add customer"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-user-form" isLoading={isSubmitting}>
            Create customer
          </Button>
        </>
      }
    >
      <form id="add-user-form" onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" required value={form.name} onChange={(e) => update({ name: e.target.value })} />
        <Input
          label="Phone number"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => update({ phone: e.target.value })}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="Optional"
          value={form.email}
          onChange={(e) => update({ email: e.target.value })}
        />
        <Select label="Role" value={form.role} onChange={(e) => update({ role: e.target.value })}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </Select>
        <p className="text-xs text-slate-500">
          They&apos;ll receive a code by email or SMS to set their password.
        </p>
      </form>
    </Modal>
  );
}
