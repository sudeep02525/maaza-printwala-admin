'use client';

import React from 'react';
import { Bell, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore.js';

export default function AdminHeader() {
  const { user } = useAdminAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const adminFirstName = user?.name ? user.name.split(' ')[0] : 'Admin';

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 z-20 shrink-0">
      {/* Left: Wix-style Personal Greeting */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <span>{getGreeting()}, {adminFirstName}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#12B76A] bg-[#ECFDF3] px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]"></span>
              Live
            </span>
          </h1>
          <p className="text-[11px] text-[#6B7280]">
            Welcome back to your printing business command center
          </p>
        </div>
      </div>

      {/* Right: Actions & Tools */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[#4B5563] text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6B7280]" />
          <span>{user?.role || 'ADMIN'}</span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F04438] ring-2 ring-white"></span>
        </button>

        {/* Primary Wix Pill Button: Open Site */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#111827] text-white hover:bg-black transition-all shadow-sm"
        >
          <span>Open Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}
