import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/common/Input.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';
import Button from '../../components/common/Button.jsx';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export default function Register() {
  const { register, googleSignIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    setIsSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone,
        password: form.password,
      });
      toast.success('Account created', 'Welcome to ITMODERN.');
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError('');
    try {
      await googleSignIn(credential);
      toast.success('Account created');
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join ITMODERN to track orders, save favorites, and check out faster."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          required
          leftIcon={<User className="h-4 w-4" />}
          value={form.name}
          onChange={handleChange}
        />
        <Input
          label="Phone number"
          type="tel"
          name="phone"
          autoComplete="tel"
          required
          helperText="Used to sign in and for delivery updates."
          leftIcon={<Phone className="h-4 w-4" />}
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          helperText="Optional — used for order receipts."
          leftIcon={<Mail className="h-4 w-4" />}
          value={form.email}
          onChange={handleChange}
        />
        <PasswordInput
          label="Password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          helperText="At least 8 characters."
          leftIcon={<Lock className="h-4 w-4" />}
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Or</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="flex justify-center">
        <GoogleSignInButton onCredential={handleGoogleCredential} />
      </div>
    </AuthLayout>
  );
}
