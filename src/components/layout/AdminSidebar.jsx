'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  FileText,
  Users,
  Settings,
  LogOut,
  Layers,
  Ticket,
  Headphones,
  Star,
  BarChart3,
  Truck,
  Search,
  X,
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore.js';
import { useAdminUIStore } from '../../store/adminUIStore.js';

const navGroups = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Reports & Sales', href: '/reports', icon: BarChart3 },
      { name: 'Orders & QC', href: '/orders', icon: ShoppingCart },
    ],
  },
  {
    title: 'Store Catalogue',
    items: [
      { name: 'Products', href: '/products', icon: Package },
      { name: 'Categories', href: '/categories', icon: FolderTree },
      { name: 'Coupons & Promo', href: '/coupons', icon: Ticket },
      { name: 'Delivery Rules', href: '/delivery-rules', icon: Truck },
    ],
  },
  {
    title: 'Customer & Content',
    items: [
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Reviews', href: '/reviews', icon: Star },
      { name: 'Support & Leads', href: '/support', icon: Headphones },
      { name: 'Content (CMS)', href: '/cms', icon: Layers },
      { name: 'Templates', href: '/templates', icon: FileText },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAdminAuthStore();
  const { isMobileSidebarOpen, closeMobileSidebar, isSidebarCollapsed } = useAdminUIStore();
  const [navSearch, setNavSearch] = useState('');

  // Close mobile sidebar on navigation
  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  // Shared Navigation Content Component
  const renderSidebarContent = (isMobile = false) => {
    const isCompact = !isMobile && isSidebarCollapsed;

    return (
      <div className="flex flex-col h-full bg-[var(--sidebar-bg)] text-[var(--text-main)] select-none transition-colors">
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] shrink-0">
          {!isCompact ? (
            <Link href="/" className="flex items-center gap-2 group overflow-hidden">
              <img
                src="/logo-maaza.png"
                alt="Maaza Printwala"
                className="h-8 w-auto max-w-[145px] object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-muted)] shrink-0">
                Admin
              </span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center w-full group overflow-hidden">
              <img
                src="/icon.png"
                alt="Maaza Printwala"
                className="w-8 h-8 rounded-lg object-contain transition-transform group-hover:scale-105"
              />
            </Link>
          )}

          {isMobile && (
            <button
              onClick={closeMobileSidebar}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] rounded-lg transition-colors"
              title="Close Menu"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Search (Only if not compact) */}
        {!isCompact && (
          <div className="px-4 pt-4 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--text-main)] focus:bg-[var(--bg-card)] transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto no-scrollbar">
          {navGroups.map((group) => {
            const filteredItems = group.items.filter((item) =>
              item.name.toLowerCase().includes(navSearch.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                {!isCompact && (
                  <div className="px-3 text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                    {group.title}
                  </div>
                )}
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={isCompact ? item.name : undefined}
                      className={`flex items-center ${
                        isCompact ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
                      } rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[var(--text-main)] text-[var(--bg-card)] font-semibold shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--bg-card)]' : 'text-[var(--text-muted)]'}`} />
                      {!isCompact && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-3.5 border-t border-[var(--border)] bg-[var(--bg-subtle)] shrink-0 transition-colors">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isCompact ? 'justify-center' : 'gap-2.5'} min-w-0`}>
              <div className="w-8 h-8 rounded-full bg-[var(--text-main)] text-[var(--bg-card)] flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              {!isCompact && (
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--text-main)] truncate">
                    {user?.name || 'Administrator'}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {user?.email || 'admin@maazaprintwala.com'}
                  </p>
                </div>
              )}
            </div>
            {!isCompact && (
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen border-r border-[var(--border)] shrink-0 transition-all duration-200 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile Slide-in Drawer (P1 Fix) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={closeMobileSidebar}
          />
          {/* Slide-in Menu */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
