import { memo } from 'react';
import { formatToday } from '@/utils/formatters';
import Button from '@/components/ui/Button';

interface TopBarProps {
  title: string;
  subtitle: string;
  onAddExpense: () => void;
  showSearch?: boolean;
}

const TopBar = memo(function TopBar({ title, subtitle, onAddExpense, showSearch = false }: TopBarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-[#e5e7eb] sticky top-0 z-20">
      {/* Page title */}
      <div>
        <h1 className="text-sm font-semibold text-[#111827] leading-none">{title}</h1>
        <p className="text-xs text-[#9ca3af] mt-0.5">{subtitle}</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative hidden md:block">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9ca3af]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search expenses..."
              className="h-8 pl-8 pr-4 text-xs rounded-lg border border-[#e5e7eb] bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#4f6ef7] focus:border-transparent w-48"
              aria-label="Search expenses"
              readOnly
            />
          </div>
        )}

        <time className="text-xs text-[#6b7280] hidden sm:block" dateTime={new Date().toISOString()}>
          {formatToday()}
        </time>

        {/* Notification bell */}
        <button
          className="relative p-1.5 rounded-lg text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6] transition-colors"
          aria-label="Notifications"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ef4444] rounded-full" aria-hidden="true" />
        </button>

        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full bg-[#4f6ef7] flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-xs font-semibold text-white">AR</span>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onAddExpense}
          id="add-expense-btn"
          aria-label="Add new expense"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
          Add Expense
        </Button>
      </div>
    </header>
  );
});

export default TopBar;
