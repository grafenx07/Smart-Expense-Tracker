import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import { useExpenses, useSummary } from '@/hooks/useExpenses';
import { formatCurrency } from '@/utils/formatters';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  iconBg: string;
  icon: React.ReactNode;
  accentColor?: string;
}

function StatCard({ label, value, sub, iconBg, icon, accentColor }: StatCardProps) {
  return (
    <Card padding="md" className="flex-1 min-w-0">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">{label}</p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-[#111827] leading-none">{value}</p>
      <p className="mt-1.5 text-xs" style={{ color: accentColor ?? '#6b7280' }}>{sub}</p>
    </Card>
  );
}

export default function Dashboard() {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: summary, isLoading: summaryLoading } = useSummary();

  const recentExpenses = useMemo(
    () => (expenses ?? []).slice(0, 5),
    [expenses],
  );

  const isLoading = expensesLoading || summaryLoading;

  return (
    <Layout
      title="Smart Expense Tracker"
      subtitle="Trace and manage your personal expenses."
      showSearch
    >
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">Welcome back, Grafenberg</h2>
        <p className="text-sm text-[#6b7280] mt-0.5">Here is how your spending looks this month.</p>
      </div>


      {/* Stat cards */}
      {isLoading ? (
        <div className="flex gap-5 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} padding="md" className="flex-1 min-w-0 h-24 animate-pulse bg-[#f3f4f6]" />
          ))}
        </div>
      ) : (
        <div className="flex gap-5 mb-6">
          <StatCard
            label="Total Expenses"
            value={formatCurrency(summary?.total ?? 0)}
            sub="+8.2% all time"
            iconBg="#eff1fe"
            accentColor="#10b981"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#4f6ef7" className="w-4 h-4" strokeWidth={2}>
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            }
          />
          <StatCard
            label="Total Transactions"
            value={String(summary?.count ?? 0)}
            sub="records stored"
            iconBg="#f5f3ff"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" className="w-4 h-4" strokeWidth={2}>
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            }
          />
          <StatCard
            label="Highest Category"
            value={summary?.highestCategory?.name ?? 'N/A'}
            sub={summary?.highestCategory ? formatCurrency(summary.highestCategory.total) : '—'}
            iconBg="#fffbeb"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" className="w-4 h-4" strokeWidth={2}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            }
          />
          <StatCard
            label="Current Month"
            value={formatCurrency(summary?.total ?? 0)}
            sub="-2.4% this period"
            iconBg="#f0fdf4"
            accentColor="#ef4444"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" className="w-4 h-4" strokeWidth={2}>
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            }
          />
        </div>
      )}

      {/* Recent expenses */}
      <Card padding="none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
          <div>
            <h3 className="text-sm font-semibold text-[#111827]">Recent expenses</h3>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              {expenses?.length ?? 0} records &bull; newest first
            </p>
          </div>
          <Link
            to="/expenses"
            className="text-xs font-medium text-[#4f6ef7] hover:text-[#3b5bf5] flex items-center gap-1 transition-colors"
          >
            View all
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
        <ExpenseTable
          expenses={recentExpenses}
          loading={expensesLoading}
          emptyMessage="No expenses recorded yet."
        />
      </Card>
    </Layout>
  );
}
