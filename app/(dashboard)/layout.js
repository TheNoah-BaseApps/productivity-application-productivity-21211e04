import AuthGuard from '@/components/auth/AuthGuard';
import Sidebar from '@/components/layout/Sidebar';
import AppBar from '@/components/layout/AppBar';

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <AppBar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 mt-16 lg:ml-64">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}