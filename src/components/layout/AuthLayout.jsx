import { Link } from 'react-router-dom';
import { APP_NAME, COMPANY_SLOGAN, LOGO_URL } from '../../constants/config.js';
import ThemeToggle from '../common/ThemeToggle.jsx';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <ThemeToggle className="absolute right-4 top-4" />
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex flex-col items-center gap-2">
          <img src={LOGO_URL} alt={APP_NAME} className="h-14 w-14 object-contain" />
          <span className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {COMPANY_SLOGAN}
          </span>
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-800">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">{footer}</div>
        )}
      </div>
    </div>
  );
}
