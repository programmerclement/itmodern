import { useState } from 'react';
import { LogOut, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import ProfileForm from '../../components/account/ProfileForm.jsx';
import ChangePasswordForm from '../../components/account/ChangePasswordForm.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as authService from '../../services/authService.js';
import { getInitials } from '../../utils/name.js';

export default function Account() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await authService.resendVerification();
      toast.success('Verification email sent');
    } catch (err) {
      toast.error('Could not send email', err.message);
    } finally {
      setIsResending(false);
    }
  };

  const needsEmailVerification = Boolean(user.email) && !user.isEmailVerified;

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
            {getInitials(user.name)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{user.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">{user.email || user.phone}</span>
              {user.role === 'admin' && <Badge variant="brand">Admin</Badge>}
              {user.email &&
                (user.isEmailVerified ? (
                  <Badge variant="success">Verified</Badge>
                ) : (
                  <Badge variant="warning">Unverified</Badge>
                ))}
            </div>
          </div>
        </div>
        <Button variant="outline" leftIcon={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
          Log out
        </Button>
      </div>

      {needsEmailVerification && (
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Please verify your email address to unlock all account features.
            </p>
          </div>
          <Button size="sm" variant="outline" isLoading={isResending} onClick={handleResendVerification}>
            Resend email
          </Button>
        </div>
      )}

      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile information</CardTitle>
          </CardHeader>
          <CardBody>
            <ProfileForm />
          </CardBody>
        </Card>

        {user.authProvider === 'local' && (
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardBody>
              <ChangePasswordForm />
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
