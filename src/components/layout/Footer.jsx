import { Link } from 'react-router-dom';
import { APP_NAME, COMPANY_LEGAL_NAME, COMPANY_SLOGAN, LOGO_URL } from '../../constants/config.js';

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/cart', label: 'Cart' },
  { to: '/account/wishlist', label: 'Wishlist' },
  { to: '/account', label: 'My account' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
          <div className="flex justify-center sm:justify-start">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={LOGO_URL} alt={APP_NAME} className="h-8 w-8 object-contain" />
              <div className="text-left leading-tight">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{APP_NAME}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{COMPANY_SLOGAN}</p>
              </div>
            </Link>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            {QUICK_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-brand-700 dark:hover:text-brand-400">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex justify-center sm:justify-end">
            <Link
              to="/warranty-check"
              className="text-sm font-medium text-slate-600 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-400"
            >
              Check warranty status
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 items-center gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:grid-cols-3">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {COMPANY_LEGAL_NAME}. All rights reserved.
          </p>
          <p className="text-center">
            Developed by{' '}
            <a
              href="https://programmerclement.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 underline decoration-brand-300 underline-offset-2 transition-colors hover:text-brand-700 dark:text-brand-400 dark:decoration-brand-700 dark:hover:text-brand-300"
            >
              Clement TECH Ltd
            </a>
          </p>
          <div className="hidden sm:block" />
        </div>
      </div>
    </footer>
  );
}
