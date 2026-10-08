'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './layout/AdminSidebar.jsx';
import AdminHeader from './layout/AdminHeader.jsx';
import { useAdminAuthStore } from '../store/adminAuthStore.js';

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAdminAuthStore();
  const isLogin = pathname === '/login';

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    if (!isLogin && !isLoading && !isAuthenticated) router.replace('/login');
  }, [isLogin, isLoading, isAuthenticated, router]);

  if (isLogin) return <>{children}</>;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Checking access…</div>;
  if (!isAuthenticated) return null;

  return (
    <>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </>
  );
}
