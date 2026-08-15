import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import * as authService from '../../services/authService.js';

export default function VerifyEmail() {
  const { token } = useParams();
  const { refetchUser } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    authService
      .verifyEmail(token)
      .then(() => {
        if (cancelled) return;
        setStatus('success');
        refetchUser();
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setMessage(err.message);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthLayout title="Email verification">
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        {status === 'loading' && (
          <>
            <Loader size="lg" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Verifying your email address...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Your email has been verified.</p>
            <Button to="/account" className="mt-2">
              Go to my account
            </Button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
            <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
            <Button to="/login" variant="outline" className="mt-2">
              Back to log in
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
