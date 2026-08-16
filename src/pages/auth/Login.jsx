import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Input from '../../components/common/Input.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';
import Button from '../../components/common/Button.jsx';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as authService from '../../services/authService.js';
import { cn } from '../../utils/cn.js';

const MODE_TAB_CLASSES =
  'flex-1 rounded-lg py-2 text-sm font-medium transition-colors';

export default function Login() {
  const { user, isAuthenticated, isLoading, login, loginWithOtp, googleSignIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? '/account';

  // Already signed in (e.g. bookmarked /login) — bounce straight to where
  // this user belongs instead of showing the form again.
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(user.role === 'admin' ? '/admin' : redirectTo, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  const [mode, setMode] = useState('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // Admins land in the admin dashboard, not the customer account page —
  // unless they were sent to /login from a specific admin page already.
  const redirectFor = (loggedInUser) => {
    if (loggedInUser.role === 'admin') {
      return redirectTo.startsWith('/admin') ? redirectTo : '/admin';
    }
    return redirectTo;
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setIsCodeSent(false);
    setCode('');
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const loggedInUser = await login({ identifier, password });
      toast.success('Welcome back');
      navigate(redirectFor(loggedInUser), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendCode = async (event) => {
    event.preventDefault();
    setError('');
    setIsSendingCode(true);
    try {
      await authService.requestOtp(identifier, 'login');
      setIsCodeSent(true);
      toast.success('Code sent', 'Check your email or phone for the 6-digit code.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const loggedInUser = await loginWithOtp(identifier, code);
      toast.success('Welcome back');
      navigate(redirectFor(loggedInUser), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError('');
    try {
      const loggedInUser = await googleSignIn(credential);
      toast.success('Welcome back');
      navigate(redirectFor(loggedInUser), { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout title="Log in to your account" subtitle="Welcome back — enter your details below.">
      <div className="flex justify-center">
        <GoogleSignInButton onCredential={handleGoogleCredential} />
      </div>

      <Button to="/register" variant="outline" className="mt-3 w-full">
        Create an account
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Or</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => switchMode('password')}
          className={cn(
            MODE_TAB_CLASSES,
            mode === 'password'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          )}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => switchMode('otp')}
          className={cn(
            MODE_TAB_CLASSES,
            mode === 'otp'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          )}
        >
          One-time code
        </button>
      </div>

      {mode === 'password' ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
          <Input
            label="Email or phone number"
            name="identifier"
            autoComplete="username"
            required
            leftIcon={<ShieldCheck className="h-4 w-4" />}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            required
            leftIcon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Log in
          </Button>
        </form>
      ) : (
        <form onSubmit={isCodeSent ? handleVerifyCode : handleSendCode} className="space-y-4" noValidate>
          <Input
            label="Email or phone number"
            name="identifier"
            autoComplete="username"
            required
            disabled={isCodeSent}
            leftIcon={<ShieldCheck className="h-4 w-4" />}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          {isCodeSent && (
            <Input
              label="6-digit code"
              name="code"
              autoComplete="one-time-code"
              required
              maxLength={6}
              leftIcon={<KeyRound className="h-4 w-4" />}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          )}

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          {isCodeSent ? (
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Verify &amp; log in
            </Button>
          ) : (
            <Button type="submit" className="w-full" isLoading={isSendingCode}>
              Send code
            </Button>
          )}

          {isCodeSent && (
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
          )}
        </form>
      )}
    </AuthLayout>
  );
}
