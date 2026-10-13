'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './layout/AdminSidebar.jsx';
import AdminHeader from './layout/AdminHeader.jsx';
import CommandPalette from './CommandPalette.jsx';
import { useAdminAuthStore } from '../store/adminAuthStore.js';

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAdminAuthStore();
  const isLogin = pathname === '/login';

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLogin && !isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLogin, isLoading, isAuthenticated, router]);

  if (isLogin) return <>{children}</>;

  // Wix-styled branded loader using theme tokens
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-page)] select-none transition-colors">
        <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border)] shadow-sm flex flex-col items-center text-center max-w-sm w-full mx-4 animate-in fade-in duration-200">
          <img src="/logo-maaza.png" alt="Maaza Printwala" className="h-10 w-auto mb-3 object-contain" />
          <h2 className="text-base font-bold text-[var(--text-main)]">Admin Control Panel</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1 mb-6">Checking administrator authorization...</p>
          <div className="w-6 h-6 border-2 border-[var(--border)] border-t-[var(--text-main)] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[var(--bg-page)] transition-colors">
        <AdminHeader />
        {/* Thin styled scrollbar enabled for main content area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[var(--bg-page)] transition-colors">{children}</main>
      </div>
      <CommandPalette />
    </>
  );
}
