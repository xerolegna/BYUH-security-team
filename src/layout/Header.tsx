import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/tasks': 'Tasks',
  '/incidents': 'Incidents',
  '/cameras': 'Cameras',
  '/work-orders': 'Work Orders',
  '/shifts': 'Shift Schedule',
};

interface HeaderProps {
  onHamburgerClick: () => void;
}

export default function Header({ onHamburgerClick }: HeaderProps) {
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const title = PAGE_TITLES[pathname] ?? 'IT Operations';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — visible only on mobile */}
        <button
          onClick={onHamburgerClick}
          className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">
            {title}
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 hidden sm:block">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Dark / light toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="text-gray-400 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors p-1"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {currentUser && (
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
            {currentUser}
          </span>
        )}

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold uppercase shrink-0">
          {currentUser ? currentUser[0] : 'U'}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
