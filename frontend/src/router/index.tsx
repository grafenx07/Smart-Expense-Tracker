import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Spinner from '@/components/ui/Spinner';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Expenses = lazy(() => import('@/pages/Expenses'));
const Analytics = lazy(() => import('@/pages/Analytics'));

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#eef0fb]">
      <Spinner size="lg" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
