import { NavLink } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={2}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={2}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <HomeIcon /> },
  { path: '/expenses', label: 'Expenses', icon: <ListIcon /> },
  { path: '/analytics', label: 'Analytics', icon: <BarChartIcon /> },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] bg-white border-r border-[#e5e7eb] flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#f3f4f6]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4f6ef7] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827] leading-none">Smart Expense</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Main navigation">
        <ul className="space-y-1" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-[#4f6ef7] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151]',
                  ].join(' ')
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile */}
      <div className="px-4 py-4 border-t border-[#f3f4f6]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#4f6ef7] flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-white">AR</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#111827] truncate">Arjun Rao</p>
            <p className="text-xs text-[#9ca3af] truncate">arjun@acme.dev</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
