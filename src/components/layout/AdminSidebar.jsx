'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore.js';

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
  const [navSearch, setNavSearch] = useState('');

  return (
    <aside className="w-64 bg-white text-[#111827] flex flex-col h-screen border-r border-[#E5E7EB] shrink-0 select-none">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB] shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm transition-transform group-hover:scale-105">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#111827] tracking-tight text-base leading-tight">
              Maaza Printwala
            </span>
            <span className="text-[11px] text-[#6B7280] font-medium tracking-wide">
              Admin Console
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Search menu..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#111827] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto no-scrollbar">
        {navGroups.map((group) => {
          const filteredItems = group.items.filter((item) =>
            item.name.toLowerCase().includes(navSearch.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                {group.title}
              </div>
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#111827] text-white font-semibold shadow-sm'
                        : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-3.5 border-t border-[#E5E7EB] bg-[#F9FAFB] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#111827] truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-[#6B7280] truncate">
                {user?.email || 'admin@maazaprintwala.com'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
