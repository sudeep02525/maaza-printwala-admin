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

  // P3: Wix-styled branded loader
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F5F7F9] select-none">
        <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center max-w-sm w-full mx-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold text-lg tracking-wider mb-4 shadow-sm">
            M
          </div>
          <h2 className="text-base font-bold text-[#111827]">Maaza Printwala</h2>
          <p className="text-xs text-[#6B7280] mt-1 mb-6">Checking administrator authorization...</p>
          <div className="w-6 h-6 border-2 border-[#E5E7EB] border-t-[#111827] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#F5F7F9]">
        <AdminHeader />
        {/* P2: Thin styled scrollbar enabled for main content area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#F5F7F9]">{children}</main>
      </div>
      <CommandPalette />
    </>
  );
}
