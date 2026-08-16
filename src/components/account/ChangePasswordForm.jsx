import { useState } from 'react';
import PasswordInput from '../common/PasswordInput.jsx';
import Button from '../common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as authService from '../../services/authService.js';

const INITIAL_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePasswordForm() {
  const toast = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      toast.success('Password changed');
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordInput
        label="Current password"
        name="currentPassword"
        autoComplete="current-password"
        required
        value={form.currentPassword}
        onChange={handleChange}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PasswordInput
          label="New password"
          name="newPassword"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.newPassword}
          onChange={handleChange}
        />
        <PasswordInput
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Update password
        </Button>
      </div>
    </form>
  );
}
