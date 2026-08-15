import { Mail, MapPin, Phone } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';

export default function TopBar() {
  const { data: settings } = useSiteSettings();

  const hasContactInfo = settings?.contactPhone || settings?.contactEmail || settings?.contactAddress;
  if (!hasContactInfo) return null;

  return (
    <div className="hidden border-b border-brand-100 bg-brand-50 text-brand-800 sm:block dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1.5 text-xs font-medium sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {settings.contactPhone && (
            <a
              href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 transition-colors hover:text-brand-900 dark:hover:text-white"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
              {settings.contactPhone}
            </a>
          )}
          {settings.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-1.5 transition-colors hover:text-brand-900 dark:hover:text-white"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
              {settings.contactEmail}
            </a>
          )}
        </div>

        {settings.contactAddress && (
          <span className="hidden items-center gap-1.5 lg:flex">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
            {settings.contactAddress}
          </span>
        )}
      </div>
    </div>
  );
}
