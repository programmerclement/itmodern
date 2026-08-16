import { NavLink, Outlet } from 'react-router-dom';
import { User, Package, Heart, MapPin, FileText, ShieldCheck, Bell } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { cn } from '../../utils/cn.js';
import { getInitials } from '../../utils/name.js';

const NAV_ITEMS = [
  { to: '/account', end: true, icon: User, label: 'Profile' },
  { to: '/account/orders', icon: Package, label: 'Orders' },
  { to: '/account/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/account/addresses', icon: MapPin, label: 'Addresses' },
  { to: '/account/quotations', icon: FileText, label: 'Quotations' },
  { to: '/account/warranty', icon: ShieldCheck, label: 'Warranty' },
];

const COMING_SOON_ITEMS = [{ icon: Bell, label: 'Notifications', phase: 'Soon' }];

export default function AccountLayout() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="overflow-hidden">
            <div className="hidden items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 lg:flex dark:border-slate-700 dark:bg-slate-900">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                {getInitials(user.name)}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email || user.phone}</p>
              </div>
            </div>

            <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}

              <div className="my-1 hidden border-t border-slate-100 lg:block dark:border-slate-800" />

              {COMING_SOON_ITEMS.map((item) => (
                <span
                  key={item.label}
                  className="hidden shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-400 lg:flex dark:text-slate-500"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  <Badge variant="neutral" className="ml-auto">
                    {item.phase}
                  </Badge>
                </span>
              ))}
            </nav>
          </Card>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
