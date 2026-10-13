'use client';

import React from 'react';
import {
  Bell,
  ExternalLink,
  ShieldCheck,
  Menu,
  Search,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore.js';
import { useAdminUIStore } from '../../store/adminUIStore.js';

export default function AdminHeader() {
  const { user } = useAdminAuthStore();
  const {
    toggleMobileSidebar,
    toggleSidebarCollapsed,
    isSidebarCollapsed,
    setCommandPaletteOpen,
  } = useAdminUIStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const adminFirstName = user?.name ? user.name.split(' ')[0] : 'Admin';

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 md:px-8 z-20 shrink-0 select-none">
      {/* Left: Mobile Hamburger & Desktop Toggle + Greeting */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Trigger (P1 Fix) */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 -ml-1 text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          className="hidden md:flex p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-[#111827] flex items-center gap-2">
            <span>{getGreeting()}, {adminFirstName}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#12B76A] bg-[#ECFDF3] px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]"></span>
              Live
            </span>
          </h1>
          <p className="text-[11px] text-[#6B7280] hidden sm:block">
            Welcome back to your printing business command center
          </p>
        </div>
      </div>

      {/* Middle: Quick Search / Command Palette Trigger */}
      <div className="hidden lg:flex items-center max-w-xs w-full mx-4">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-lg text-[#9CA3AF] transition-all"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Search or jump to...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-[#6B7280] bg-white border border-[#E5E7EB] rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions & Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search icon for tablet/mobile */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="lg:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          title="Search (Ctrl+K)"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[#4B5563] text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#6B7280]" />
          <span>{user?.role || 'ADMIN'}</span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F04438] ring-2 ring-white"></span>
        </button>

        {/* Primary Wix Pill Button: Open Site */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold bg-[#111827] text-white hover:bg-black transition-all shadow-sm"
        >
          <span>Open Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}
