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
    name: user.name,
    email: user.email ?? '',
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
        name: form.name,
        email: form.email,
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
      <Input label="Full name" name="name" required value={form.name} onChange={handleChange} />
      <Input
        label="Email address"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        helperText="Changing this will require re-verifying your new email."
      />
      <Input
        label="Phone number"
        type="tel"
        value={user.phone ?? ''}
        disabled
        helperText="Phone number cannot be changed."
      />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
