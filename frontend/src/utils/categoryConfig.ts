import type { Category } from '@/types';

export interface CategoryConfig {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  chartColor: string;
  iconPath: string;
}

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  Food: {
    label: 'Food',
    bgClass: 'bg-[#eff6ff]',
    textClass: 'text-[#3b82f6]',
    borderClass: 'border-[#bfdbfe]',
    chartColor: '#3b82f6',
    iconPath:
      'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 4a3 3 0 110 6 3 3 0 010-6zm0 12.5c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08A7.5 7.5 0 0112 18.5z',
  },
  Transport: {
    label: 'Transport',
    bgClass: 'bg-[#f5f3ff]',
    textClass: 'text-[#7c3aed]',
    borderClass: 'border-[#ddd6fe]',
    chartColor: '#8b5cf6',
    iconPath:
      'M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4S4 2.5 4 6v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5S15.67 14 16.5 14s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z',
  },
  Shopping: {
    label: 'Shopping',
    bgClass: 'bg-[#f0fdfa]',
    textClass: 'text-[#0d9488]',
    borderClass: 'border-[#99f6e4]',
    chartColor: '#14b8a6',
    iconPath:
      'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.46 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
  },
  Utilities: {
    label: 'Utilities',
    bgClass: 'bg-[#fffbeb]',
    textClass: 'text-[#d97706]',
    borderClass: 'border-[#fde68a]',
    chartColor: '#f59e0b',
    iconPath:
      'M7 2v11h3v9l7-12h-4l4-8z',
  },
  Health: {
    label: 'Health',
    bgClass: 'bg-[#f0fdf4]',
    textClass: 'text-[#059669]',
    borderClass: 'border-[#bbf7d0]',
    chartColor: '#10b981',
    iconPath:
      'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z',
  },
  Entertainment: {
    label: 'Entertainment',
    bgClass: 'bg-[#fdf2f8]',
    textClass: 'text-[#db2777]',
    borderClass: 'border-[#f9a8d4]',
    chartColor: '#ec4899',
    iconPath:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
  },
};
