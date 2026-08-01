import { memo, useState } from 'react';
import { Expense } from '@/types';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useDeleteExpense } from '@/hooks/useExpenses';

interface ExpenseRowProps {
  expense: Expense;
}

const ExpenseRow = memo(function ExpenseRow({ expense }: ExpenseRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: deleteExpense, isPending } = useDeleteExpense();

  function handleDelete() {
    deleteExpense(expense.id, {
      onSuccess: () => setConfirmOpen(false),
    });
  }

  return (
    <>
      <tr className="border-b border-[#f3f4f6] hover:bg-[#fafafa] transition-colors group">
        {/* Title */}
        <td className="py-3.5 pl-5 pr-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white"
              style={{ backgroundColor: '#4f6ef7' }}
              aria-hidden="true"
            >
              {expense.title.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-[#111827]">{expense.title}</p>
              {expense.note && (
                <p className="text-xs text-[#9ca3af] mt-0.5 max-w-xs truncate">{expense.note}</p>
              )}
            </div>
          </div>
        </td>

        {/* Category */}
        <td className="py-3.5 px-4">
          <Badge category={expense.category} />
        </td>

        {/* Amount */}
        <td className="py-3.5 px-4">
          <span className="text-sm font-semibold text-[#111827]">
            {formatCurrency(expense.amount)}
          </span>
        </td>

        {/* Date */}
        <td className="py-3.5 px-4">
          <span className="text-sm text-[#6b7280]">{formatDate(expense.date)}</span>
        </td>

        {/* Actions */}
        <td className="py-3.5 pr-5 pl-4">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1.5 rounded-md text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              aria-label={`View details for ${expense.title}`}
              title="View details"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              className="p-1.5 rounded-md text-[#9ca3af] hover:text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              aria-label={`Copy ${expense.title}`}
              title="Copy"
              onClick={() => navigator.clipboard.writeText(`${expense.title}: ${formatCurrency(expense.amount)}`)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="p-1.5 rounded-md text-[#9ca3af] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
              aria-label={`Delete ${expense.title}`}
              title="Delete"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5" strokeWidth={2}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete expense"
        description={`Delete "${expense.title}" (${formatCurrency(expense.amount)})? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
});

export default ExpenseRow;
