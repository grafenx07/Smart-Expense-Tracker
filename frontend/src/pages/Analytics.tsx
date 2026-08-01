import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { useExpenses, useSummary } from '@/hooks/useExpenses';
import { formatCurrency } from '@/utils/formatters';
import { CATEGORY_CONFIG } from '@/utils/categoryConfig';
import type { Category } from '@/types';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  iconBg: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, sub, iconBg, icon }: StatCardProps) {
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
      <p className="mt-1.5 text-xs text-[#6b7280]">{sub}</p>
    </Card>
  );
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TooltipFormatter(value: any) {
  const numeric = typeof value === 'number' ? value : Number(value ?? 0);
  return [CURRENCY_FORMATTER.format(numeric), 'Amount'];
}

export default function Analytics() {
  const { isLoading: expensesLoading } = useExpenses();
  const { data: summary, isLoading: summaryLoading } = useSummary();

  const isLoading = expensesLoading || summaryLoading;

  const categoryChartData = useMemo(() => {
    if (!summary?.byCategory) return [];
    return Object.entries(summary.byCategory)
      .map(([name, total]) => ({
        name: name as Category,
        total: total ?? 0,
        color: CATEGORY_CONFIG[name as Category].chartColor,
      }))
      .sort((a, b) => b.total - a.total);
  }, [summary]);

  const monthlyData = summary?.monthlyTrend ?? [];

  if (isLoading) {
    return (
      <Layout title="Analytics" subtitle="Visual breakdown of your spending costs.">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Analytics" subtitle="Visual breakdown of your spending costs.">
      {/* Stat cards */}
      <div className="flex gap-5 mb-5">
        <StatCard
          label="Total Expenses"
          value={formatCurrency(summary?.total ?? 0)}
          sub={`across ${summary?.count ?? 0} transactions`}
          iconBg="#eff1fe"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#4f6ef7" className="w-4 h-4" strokeWidth={2}>
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          }
        />
        <StatCard
          label="Average Expense"
          value={formatCurrency(summary?.average ?? 0)}
          sub={`mean across ${summary?.count ?? 0} records`}
          iconBg="#f5f3ff"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" className="w-4 h-4" strokeWidth={2}>
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          }
        />
        <StatCard
          label="Highest Expense"
          value={formatCurrency(summary?.highest?.amount ?? 0)}
          sub={summary?.highest?.title ?? 'N/A'}
          iconBg="#fffbeb"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" className="w-4 h-4" strokeWidth={2}>
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          }
        />
        <StatCard
          label="Total Categories"
          value={String(Object.keys(summary?.byCategory ?? {}).length)}
          sub="active categories"
          iconBg="#f0fdf4"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" className="w-4 h-4" strokeWidth={2}>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          }
        />
      </div>

      {/* Charts row 1 */}
      <div className="flex gap-5 mb-5">
        {/* Monthly trend */}
        <Card padding="md" className="flex-1">
          <h3 className="text-sm font-semibold text-[#111827] mb-0.5">Monthly expense trend</h3>
          <p className="text-xs text-[#9ca3af] mb-4">Last 12 months of spending</p>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-[#9ca3af]">
              No data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f6ef7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={TooltipFormatter}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4f6ef7"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#4f6ef7', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#4f6ef7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Category breakdown donut */}
        <Card padding="md" className="w-72 shrink-0">
          <h3 className="text-sm font-semibold text-[#111827] mb-0.5">Category breakdown</h3>
          <p className="text-xs text-[#9ca3af] mb-4">Share of total spending</p>
          {categoryChartData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-[#9ca3af]">
              No data available.
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <PieChart width={140} height={140}>
                  <Pie
                    data={categoryChartData}
                    cx={65}
                    cy={65}
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="total"
                  >
                    {categoryChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={TooltipFormatter}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '11px' }}
                  />
                </PieChart>
              </div>
              <ul className="mt-2 space-y-1.5" role="list">
                {categoryChartData.map((entry) => (
                  <li key={entry.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                        aria-hidden="true"
                      />
                      <span className="text-[#374151]">{entry.name}</span>
                    </span>
                    <span className="text-[#6b7280] font-medium">{formatCurrency(entry.total)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="flex gap-5">
        {/* Spend by category bar chart */}
        <Card padding="md" className="flex-1">
          <h3 className="text-sm font-semibold text-[#111827] mb-0.5">Spend by category</h3>
          <p className="text-xs text-[#9ca3af] mb-4">Absolute amounts</p>
          {categoryChartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-[#9ca3af]">
              No data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={TooltipFormatter}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {categoryChartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Most expensive categories horizontal bar */}
        <Card padding="md" className="flex-1">
          <h3 className="text-sm font-semibold text-[#111827] mb-0.5">Most expensive categories</h3>
          <p className="text-xs text-[#9ca3af] mb-5">Ranked by total spend</p>
          {categoryChartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-[#9ca3af]">
              No data available.
            </div>
          ) : (
            <div className="space-y-4" role="list">
              {categoryChartData.map((entry) => {
                const max = categoryChartData[0].total;
                const pct = max > 0 ? (entry.total / max) * 100 : 0;
                return (
                  <div key={entry.name} role="listitem">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-[#374151]">{entry.name}</span>
                      <span className="text-xs font-semibold text-[#111827]">
                        {formatCurrency(entry.total)}
                      </span>
                    </div>
                    <div className="h-2 bg-[#f3f4f6] rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: entry.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
