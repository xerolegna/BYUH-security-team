import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  AlertTriangle,
  Camera,
  Wrench,
  CalendarDays,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { to: '/cameras', label: 'Cameras', icon: Camera },
  { to: '/work-orders', label: 'Work Orders', icon: Wrench },
  { to: '/shifts', label: 'Shift Schedule', icon: CalendarDays },
];

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <div className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col">
      {/* Logo + close button */}
      <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-sm leading-tight">BYUH Security IT Team</p>
          <p className="text-slate-400 text-xs mt-0.5">Operations Dashboard</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav links — clicking any link closes sidebar on mobile */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white border-r-2 border-blue-500'
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">v1.0.0 — Portfolio Demo</p>
      </div>
    </div>
  );
}
