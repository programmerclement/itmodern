import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as authService from '../../services/authService.js';

export default function ProfileForm() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await authService.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
      });
      setUser(result.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Could not update profile', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="First name" name="firstName" required value={form.firstName} onChange={handleChange} />
        <Input label="Last name" name="lastName" required value={form.lastName} onChange={handleChange} />
      </div>
      <Input label="Email address" value={user.email} disabled helperText="Email address cannot be changed." />
      <Input label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
