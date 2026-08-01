import { useState, useCallback, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ExpenseModal from '@/components/expenses/ExpenseModal';

interface LayoutProps {
  title: string;
  subtitle: string;
  showSearch?: boolean;
  children: ReactNode;
}

export default function Layout({ title, subtitle, showSearch, children }: LayoutProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className="min-h-screen bg-[#eef0fb] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-[220px] min-h-screen">
        <TopBar
          title={title}
          subtitle={subtitle}
          showSearch={showSearch}
          onAddExpense={openModal}
        />

        <main className="flex-1 p-6">{children}</main>
      </div>

      <ExpenseModal open={modalOpen} onClose={closeModal} />
    </div>
  );
}
