import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { fetchExpenses, fetchSummary, createExpense, deleteExpense } from '@/api/expenses';
import { Category } from '@/types';

export const QUERY_KEYS = {
  expenses: (category?: Category) =>
    category ? ['expenses', category] : ['expenses'],
  summary: (category?: Category) =>
    category ? ['summary', category] : ['summary'],
} as const;

export function useExpenses(category?: Category) {
  return useQuery({
    queryKey: QUERY_KEYS.expenses(category),
    queryFn: () => fetchExpenses(category),
    staleTime: 30_000,
  });
}

export function useSummary(category?: Category) {
  return useQuery({
    queryKey: QUERY_KEYS.summary(category),
    queryFn: () => fetchSummary(category),
    staleTime: 30_000,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
      ]);
      toast.success('Expense recorded successfully.');
    },
    onError: () => {
      toast.error('Failed to record expense. Please try again.');
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] }),
      ]);
      toast.success('Expense deleted.');
    },
    onError: () => {
      toast.error('Failed to delete expense. Please try again.');
    },
  });
}
