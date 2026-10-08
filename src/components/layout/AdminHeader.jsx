'use client';

import { Bell, Search, ShieldCheck } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore.js';

export default function AdminHeader() {
  const { user } = useAdminAuthStore();

  return (
    <header className="h-16 neu-flat   flex items-center justify-between px-8 sticky top-0 z-30 shadow-xs">
      {/* Search & Breadcrumbs */}
      <div className="flex items-center gap-6 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, products, customers... (Ctrl+K)"
            className="w-full pl-9 pr-4 py-1.5 neu-flat   rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all neu-input"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Environment Badge */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold neu-flat text-slate-700  ">
          <span className="w-1.5 h-1.5 rounded-full neu-flat0"></span>
          Live Production
        </span>

        {/* Security Role Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md neu-flat text-slate-700 text-xs font-medium  ">
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <span>{user?.role || 'ADMIN'}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:neu-flat transition-colors neu-btn">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full neu-flat0 ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
}
