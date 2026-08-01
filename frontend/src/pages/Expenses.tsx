import { useState, useMemo, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import { useExpenses, useSummary } from '@/hooks/useExpenses';
import { CATEGORIES } from '@/types';
import type { Category, SortOrder, Expense } from '@/types';
import { formatCurrency } from '@/utils/formatters';

const PAGE_SIZE = 6;

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest amount' },
  { value: 'lowest', label: 'Lowest amount' },
];

function sortExpenses(expenses: Expense[], order: SortOrder): Expense[] {
  return [...expenses].sort((a, b) => {
    switch (order) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.amount - a.amount;
      case 'lowest':
        return a.amount - b.amount;
    }
  });
}

export default function Expenses() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>('');
  const [sort, setSort] = useState<SortOrder>('newest');
  const [page, setPage] = useState(1);

  const { data: expenses, isLoading } = useExpenses();
  const { data: summary } = useSummary();

  const filtered = useMemo(() => {
    let result = expenses ?? [];
    if (categoryFilter) {
      result = result.filter((e) => e.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.note?.toLowerCase().includes(q) ?? false),
      );
    }
    return sortExpenses(result, sort);
  }, [expenses, categoryFilter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleCategory = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value as Category | '');
    setPage(1);
  }, []);

  const handleSort = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as SortOrder);
    setPage(1);
  }, []);

  return (
    <Layout
      title="Expenses"
      subtitle="Search, filter and manage every record."
    >
      {/* Search + filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search by title or note..."
            value={search}
            onChange={handleSearch}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#4f6ef7] focus:border-transparent"
            aria-label="Search expenses"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={handleCategory}
            className="h-10 pl-3 pr-8 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111827] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4f6ef7]"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={handleSort}
            className="h-10 pl-3 pr-8 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111827] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4f6ef7]"
            aria-label="Sort expenses"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-[#f3f4f6]">
          <h2 className="text-sm font-semibold text-[#111827]">All expenses</h2>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            {filtered.length} records &bull; {formatCurrency(summary?.total ?? 0)} total
          </p>
        </div>

        <ExpenseTable
          expenses={paginated}
          loading={isLoading}
          emptyMessage={search || categoryFilter ? 'No expenses match your filters.' : 'No expenses recorded yet.'}
        />

        {/* Pagination */}
        {!isLoading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#f3f4f6]">
            <p className="text-xs text-[#6b7280]">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:bg-[#f3f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={[
                    'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                    p === currentPage
                      ? 'bg-[#4f6ef7] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]',
                  ].join(' ')}
                  aria-label={`Page ${p}`}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:bg-[#f3f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </Card>
    </Layout>
  );
}
