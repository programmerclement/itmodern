import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  Users,
  Boxes,
  CreditCard,
  Star,
  FileText,
  Ticket,
  Receipt,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { APP_NAME, LOGO_URL } from '../../constants/config.js';
import { cn } from '../../utils/cn.js';
import AccountMenu from '../components/AccountMenu.jsx';

const NAV_GROUPS = [
  {
    heading: 'Quick access',
    // Products, Receipts, and Customers are the most-used pages — always
    // shown flat, never tucked behind a dropdown/accordion, even collapsed.
    alwaysExpanded: true,
    items: [
      { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/products', icon: Package, label: 'Products' },
      { to: '/admin/receipts', icon: Receipt, label: 'Receipts' },
      { to: '/admin/customers', icon: Users, label: 'Customers' },
    ],
  },
  {
    heading: 'Catalog',
    items: [
      { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
      { to: '/admin/brands', icon: Tag, label: 'Brands' },
      { to: '/admin/inventory', icon: Boxes, label: 'Inventory' },
    ],
  },
  {
    heading: 'Sales',
    items: [
      { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
      { to: '/admin/quotations', icon: FileText, label: 'Quotations' },
      { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
      { to: '/admin/coupons', icon: Ticket, label: 'Coupons' },
    ],
  },
  {
    heading: 'Engagement',
    items: [{ to: '/admin/reviews', icon: Star, label: 'Reviews' }],
  },
  {
    heading: 'Insights',
    items: [{ to: '/admin/reports', icon: BarChart3, label: 'Reports' }],
  },
  {
    heading: 'General',
    items: [{ to: '/admin/settings', icon: Settings, label: 'Settings' }],
  },
];

const SIDEBAR_COLLAPSED_KEY = 'itmodern_admin_sidebar_collapsed';

function getStoredCollapsed() {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

function isItemActive(item, pathname) {
  return item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
}

function NavItemLink({ item, isCollapsed }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium',
          isCollapsed && 'justify-center px-0',
          isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
        )
      }
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && item.label}
    </NavLink>
  );
}

// Collapsed sidebar rail: a multi-item group becomes a single icon button
// that opens a flyout (portaled to body so it isn't clipped by the
// scrollable, fixed-width rail) listing the group's items.
function CollapsedNavGroup({ group }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const GroupIcon = group.items[0].icon;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (buttonRef.current?.contains(event.target) || panelRef.current?.contains(event.target)) {
        return;
      }
      setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen) setRect(buttonRef.current?.getBoundingClientRect() ?? null);
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        title={group.heading}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={cn(
          'flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium',
          isOpen ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
        )}
      >
        <GroupIcon className="h-4 w-4 shrink-0" />
      </button>

      {isOpen &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            style={{ position: 'fixed', top: rect.top, left: rect.right + 8 }}
            className="z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg"
          >
            <p className="px-3.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {group.heading}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3.5 py-2 text-sm',
                    isActive ? 'font-medium text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

function MobileNavDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/50 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl animate-slide-in-left">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt={APP_NAME} className="h-7 w-7 object-contain" />
            <span className="text-sm font-semibold text-slate-900">{APP_NAME} Admin</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {group.heading}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium',
                        isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>,
    document.body
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(getStoredCollapsed);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const map = {};
    for (const group of NAV_GROUPS) {
      map[group.heading] = group.items.some((item) => isItemActive(item, location.pathname));
    }
    return map;
  });

  // Whichever group holds the current page is always opened (without
  // forcing other groups the user opened themselves to close).
  useEffect(() => {
    const activeGroup = NAV_GROUPS.find((group) => group.items.some((item) => isItemActive(item, location.pathname)));
    if (activeGroup) {
      setExpandedGroups((prev) => (prev[activeGroup.heading] ? prev : { ...prev, [activeGroup.heading]: true }));
    }
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        // localStorage unavailable — preference just won't persist
      }
      return next;
    });
  };

  const toggleGroup = (heading) => {
    setExpandedGroups((prev) => ({ ...prev, [heading]: !prev[heading] }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={cn(
          'hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-150 lg:flex',
          isCollapsed ? 'w-16' : 'w-60'
        )}
      >
        <div className="border-b border-slate-100 px-3 py-4">
          <div className={cn('flex items-center gap-2', isCollapsed ? 'flex-col' : 'justify-between')}>
            <div className={cn('flex min-w-0 items-center gap-2', isCollapsed && 'flex-col')}>
              <img src={LOGO_URL} alt={APP_NAME} className="h-8 w-8 shrink-0 object-contain" />
              {!isCollapsed && (
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-semibold text-slate-900">{APP_NAME}</p>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Admin</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={toggleCollapsed}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            >
              {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => {
            if (isCollapsed && group.items.length > 1 && !group.alwaysExpanded) {
              return <CollapsedNavGroup key={group.heading} group={group} />;
            }

            const isMultiItem = group.items.length > 1 && !group.alwaysExpanded;
            const isExpanded = isCollapsed || !isMultiItem || Boolean(expandedGroups[group.heading]);

            return (
              <div key={group.heading}>
                {!isCollapsed && isMultiItem && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.heading)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-600"
                  >
                    {group.heading}
                    <ChevronDown className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-180')} />
                  </button>
                )}
                {!isCollapsed && !isMultiItem && (
                  <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {group.heading}
                  </p>
                )}
                {isExpanded && (
                  <div className="space-y-0.5 py-0.5">
                    {group.items.map((item) => (
                      <NavItemLink key={item.to} item={item} isCollapsed={isCollapsed} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            <img src={LOGO_URL} alt={APP_NAME} className="h-7 w-7 object-contain" />
            <span className="text-sm font-semibold text-slate-900">{APP_NAME} Admin</span>
          </div>
          <div className="flex items-center gap-1">
            <NavLink
              to="/"
              aria-label="View store"
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Store className="h-4 w-4" />
            </NavLink>
            <AccountMenu compact />
          </div>
        </header>

        <MobileNavDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

        <div className="hidden items-center justify-end gap-3 border-b border-slate-200 bg-white px-6 py-2.5 lg:flex">
          <NavLink
            to="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Store className="h-4 w-4" /> View store
          </NavLink>
          <AccountMenu />
        </div>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
