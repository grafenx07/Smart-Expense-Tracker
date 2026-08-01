import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { CATEGORIES } from '@/types';
import type { Category } from '@/types';
import { useCreateExpense } from '@/hooks/useExpenses';
import { todayIso } from '@/utils/formatters';

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(40, 'Title must be 40 characters or fewer.'),
  amount: z
    .string()
    .min(1, 'Amount is required.')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be greater than zero.'),
  category: z.enum(CATEGORIES, { required_error: 'Please select a category.' }),
  date: z
    .string()
    .min(1, 'Date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date.'),
  note: z.string().trim().max(165, 'Note must be 165 characters or fewer.').optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ExpenseModal({ open, onClose }: ExpenseModalProps) {
  const { mutate: createExpense, isPending } = useCreateExpense();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      amount: '',
      category: '' as Category,
      date: todayIso(),
      note: '',
    },
  });

  const titleValue = watch('title') ?? '';
  const noteValue = watch('note') ?? '';

  useEffect(() => {
    if (!open) {
      reset({
        title: '',
        amount: '',
        category: '' as Category,
        date: todayIso(),
        note: '',
      });
    }
  }, [open, reset]);

  function onSubmit(values: FormValues) {
    createExpense(
      {
        title: values.title,
        amount: Number(values.amount),
        category: values.category,
        date: values.date,
        note: values.note || undefined,
      },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add expense"
      description="Record a new transaction in your ledger."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="expense-title" className="text-sm font-medium text-[#374151]">
                Expense title <span className="text-[#dc2626]">*</span>
              </label>
              <span className="text-xs text-[#9ca3af]">{titleValue.length}/40</span>
            </div>
            <input
              id="expense-title"
              type="text"
              placeholder="e.g. Coffee at Blue Tokai"
              maxLength={40}
              autoComplete="off"
              className={[
                'w-full h-10 px-3 rounded-lg border text-sm text-[#111827] bg-white',
                'placeholder:text-[#9ca3af] transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-[#4f6ef7] focus:border-transparent',
                errors.title ? 'border-[#f87171] bg-[#fef2f2]' : 'border-[#e5e7eb] hover:border-[#d1d5db]',
              ].join(' ')}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-[#dc2626]" role="alert">{errors.title.message}</p>
            )}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="expense-amount" className="text-sm font-medium text-[#374151]">
                Amount <span className="text-[#dc2626]">*</span>
              </label>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={[
                  'w-full h-10 px-3 rounded-lg border text-sm text-[#111827] bg-white',
                  'placeholder:text-[#9ca3af] transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-[#4f6ef7] focus:border-transparent',
                  errors.amount ? 'border-[#f87171] bg-[#fef2f2]' : 'border-[#e5e7eb] hover:border-[#d1d5db]',
                ].join(' ')}
                {...register('amount')}
              />
              {errors.amount && (
                <p className="text-xs text-[#dc2626]" role="alert">{errors.amount.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="expense-date" className="text-sm font-medium text-[#374151]">
                Date <span className="text-[#dc2626]">*</span>
              </label>
              <input
                id="expense-date"
                type="date"
                className={[
                  'w-full h-10 px-3 rounded-lg border text-sm text-[#111827] bg-white',
                  'transition-colors duration-150 cursor-pointer',
                  'focus:outline-none focus:ring-2 focus:ring-[#4f6ef7] focus:border-transparent',
                  errors.date ? 'border-[#f87171] bg-[#fef2f2]' : 'border-[#e5e7eb] hover:border-[#d1d5db]',
                ].join(' ')}
                {...register('date')}
              />
              {errors.date && (
                <p className="text-xs text-[#dc2626]" role="alert">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="expense-category" className="text-sm font-medium text-[#374151]">
                  Category <span className="text-[#dc2626]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="expense-category"
                    className={[
                      'w-full h-10 pl-3 pr-9 rounded-lg border text-sm bg-white',
                      'appearance-none transition-colors duration-150 cursor-pointer',
                      'focus:outline-none focus:ring-2 focus:ring-[#4f6ef7] focus:border-transparent',
                      !field.value ? 'text-[#9ca3af]' : 'text-[#111827]',
                      errors.category
                        ? 'border-[#f87171]'
                        : 'border-[#e5e7eb] hover:border-[#d1d5db]',
                    ].join(' ')}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  >
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.category && (
                  <p className="text-xs text-[#dc2626]" role="alert">{errors.category.message}</p>
                )}
              </div>
            )}
          />

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="expense-note" className="text-sm font-medium text-[#374151]">
                Note
              </label>
              <span className="text-xs text-[#9ca3af]">{noteValue.length}/165</span>
            </div>
            <textarea
              id="expense-note"
              placeholder="Add any relevant details..."
              rows={3}
              maxLength={165}
              className={[
                'w-full px-3 py-2.5 rounded-lg border text-sm text-[#111827] bg-white resize-none',
                'placeholder:text-[#9ca3af] transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-[#4f6ef7] focus:border-transparent',
                errors.note ? 'border-[#f87171] bg-[#fef2f2]' : 'border-[#e5e7eb] hover:border-[#d1d5db]',
              ].join(' ')}
              {...register('note')}
            />
            {errors.note ? (
              <p className="text-xs text-[#dc2626]" role="alert">{errors.note.message}</p>
            ) : (
              <p className="text-xs text-[#9ca3af]">Optional — a short reminder of what this was for.</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-[#f3f4f6]">
            <p className="text-xs text-[#dc2626]">* required</p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isPending}>
                Save expense
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
