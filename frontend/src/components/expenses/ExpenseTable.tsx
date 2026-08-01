import { Expense } from '@/types';
import ExpenseRow from './ExpenseRow';
import Spinner from '@/components/ui/Spinner';

interface ExpenseTableProps {
  expenses: Expense[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function ExpenseTable({
  expenses,
  loading = false,
  emptyMessage = 'No expenses found.',
}: ExpenseTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-10 h-10 text-[#d1d5db] mb-3"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
        <p className="text-sm font-medium text-[#374151]">{emptyMessage}</p>
        <p className="text-xs text-[#9ca3af] mt-1">Add an expense to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-[#e5e7eb]">
            {(['TITLE', 'CATEGORY', 'AMOUNT', 'DATE', 'ACTIONS'] as const).map((col) => (
              <th
                key={col}
                scope="col"
                className={[
                  'pb-3 text-xs font-semibold text-[#9ca3af] tracking-wider uppercase',
                  col === 'TITLE' ? 'pl-5 pr-4 text-left' : 'px-4 text-left',
                  col === 'ACTIONS' ? 'pr-5 pl-4' : '',
                ].join(' ')}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <ExpenseRow key={expense.id} expense={expense} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
