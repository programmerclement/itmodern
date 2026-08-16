import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/common/Input.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';
import Button from '../../components/common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as authService from '../../services/authService.js';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();

  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendCode = async (event) => {
    event.preventDefault();
    setError('');
    setIsSendingCode(true);
    try {
      await authService.requestOtp(identifier, 'reset');
      setIsCodeSent(true);
      toast.success('Code sent', 'Check your email or phone for the 6-digit code.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await authService.resetPasswordWithOtp(identifier, code, password);
      toast.success('Password reset', 'You can now log in with your new password.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        isCodeSent
          ? 'Enter the code you received and choose a new password.'
          : "Enter your email or phone and we'll send you a verification code."
      }
      footer={
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
          Back to log in
        </Link>
      }
    >
      {isCodeSent ? (
        <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
          <Input
            label="6-digit code"
            required
            maxLength={6}
            leftIcon={<KeyRound className="h-4 w-4" />}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            required
            minLength={8}
            helperText="At least 8 characters."
            leftIcon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Reset password
          </Button>

          <button
            type="button"
            onClick={() => {
              setIsCodeSent(false);
              setCode('');
            }}
            className="w-full text-center text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Use a different email or phone
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendCode} className="space-y-4" noValidate>
          <Input
            label="Email or phone number"
            autoComplete="username"
            required
            leftIcon={<ShieldCheck className="h-4 w-4" />}
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
          />

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <Button type="submit" className="w-full" isLoading={isSendingCode}>
            Send code
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
