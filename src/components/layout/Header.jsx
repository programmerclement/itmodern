import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, LayoutDashboard, LogOut, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { APP_NAME, LOGO_URL } from '../../constants/config.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useCategories } from '../../hooks/useCategories.js';
import { useWishlist } from '../../hooks/useWishlist.js';
import Drawer from '../common/Drawer.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';
import { cn } from '../../utils/cn.js';
import { getInitials } from '../../utils/name.js';

const NAV_BUTTON_CLASSES =
  'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100';

function NavIconLink({ to, ariaLabel, label, icon, badge }) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className="group relative flex items-center overflow-hidden rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      <span className="flex shrink-0 items-center justify-center">{icon}</span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:ml-2 group-hover:max-w-[6rem]">
        {label}
      </span>
      {badge > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-semibold text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}

function SearchForm({ value, onChange, onSubmit, autoFocus = false, className }) {
  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="flex w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-inner transition-all focus-within:border-brand-500 focus-within:bg-white focus-within:shadow-none focus-within:ring-2 focus-within:ring-brand-500/40 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:bg-slate-900">
        <input
          type="search"
          autoFocus={autoFocus}
          value={value}
          onChange={onChange}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full bg-transparent py-2.5 pl-4 pr-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          aria-label="Search"
          className="flex shrink-0 items-center justify-center bg-brand-600 px-4 text-white transition-colors hover:bg-brand-700"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function CategoriesMenu() {
  const { data: categories } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={NAV_BUTTON_CLASSES}
      >
        Categories
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          <Link
            to="/shop"
            onClick={() => setIsOpen(false)}
            className="block px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            All products
          </Link>
          <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
          {categories?.map((category) => (
            <Link
              key={category._id}
              to={`/shop/${category.slug}`}
              onClick={() => setIsOpen(false)}
              className="block px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { products: wishlistProducts } = useWishlist();
  const { data: categories } = useCategories();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate('/');
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : '/shop');
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-3 sm:gap-5 sm:px-6 lg:gap-8 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="shrink-0 rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img src={LOGO_URL} alt={APP_NAME} className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
            <span className="hidden text-lg font-semibold tracking-tight text-slate-900 sm:inline dark:text-slate-100">
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <CategoriesMenu />
            <Link to="/shop" className={NAV_BUTTON_CLASSES}>
              Shop
            </Link>
          </nav>
        </div>

        <SearchForm
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          onSubmit={submitSearch}
          className="hidden w-full max-w-md md:mx-auto md:block"
        />

        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            aria-label="Search products"
            aria-expanded={isMobileSearchOpen}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <ThemeToggle />
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              aria-label="Admin dashboard"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50 sm:flex dark:text-brand-400 dark:hover:bg-brand-500/10"
            >
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Link>
          )}
          <NavIconLink
            to="/account"
            ariaLabel={isAuthenticated ? 'My account' : 'Log in'}
            label={isAuthenticated ? 'Account' : 'Login'}
            icon={
              isAuthenticated ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                  {getInitials(user.name)}
                </span>
              ) : (
                <User className="h-5 w-5" />
              )
            }
          />
          <NavIconLink
            to="/account/wishlist"
            ariaLabel="Wishlist"
            label="Wishlist"
            icon={<Heart className="h-5 w-5" />}
            badge={wishlistProducts.length}
          />
          <NavIconLink
            to="/cart"
            ariaLabel="Cart"
            label="Cart"
            icon={<ShoppingCart className="h-5 w-5" />}
            badge={itemCount}
          />
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="border-t border-slate-100 px-4 py-3 md:hidden dark:border-slate-800">
          <SearchForm
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onSubmit={submitSearch}
            autoFocus
          />
        </div>
      )}

      <Drawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Menu" side="left">
        <nav className="flex flex-col gap-1">
          <Link
            to="/shop"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Shop
          </Link>

          <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Categories
          </p>
          <Link
            to="/shop"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            All products
          </Link>
          {categories?.map((category) => (
            <Link
              key={category._id}
              to={`/shop/${category.slug}`}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {category.name}
            </Link>
          ))}

          <div className="my-2 border-t border-slate-100 dark:border-slate-700" />

          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                My account
              </Link>
              <Link
                to="/account/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Heart className="h-4 w-4" /> Wishlist
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <LayoutDashboard className="h-4 w-4" /> Admin dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </Drawer>
    </header>
  );
}
