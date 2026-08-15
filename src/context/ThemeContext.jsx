import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'itmodern_theme';

function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? 'system';
  } catch {
    return 'system';
  }
}

function getSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark);
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setSystemPrefersDark(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const prefersDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
  // The admin panel is always light, regardless of the visitor's theme —
  // it simply never receives the `.dark` class its shared components key off.
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDark = prefersDark && !isAdminRoute;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const setTheme = (nextTheme) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // localStorage unavailable — preference just won't persist
    }
  };

  const toggleTheme = () => setTheme(prefersDark ? 'light' : 'dark');

  const value = useMemo(
    () => ({ theme, isDark: prefersDark, toggleTheme, setTheme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, prefersDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
