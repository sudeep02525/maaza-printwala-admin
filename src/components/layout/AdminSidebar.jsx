'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  DollarSign,
  ShoppingCart,
  FileText,
  Users,
  Settings,
  LogOut,
  Layers,
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore.js';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders & QC', href: '/orders', icon: ShoppingCart },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories & SEO', href: '/categories', icon: FolderTree },
  { name: 'Content (CMS)', href: '/cms', icon: Layers },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAdminAuthStore();

  return (
    <aside className="w-64 bg-white text-slate-600 flex flex-col min-h-screen border-r border-slate-200 shadow-sm">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 bg-white border-b border-slate-200">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700 tracking-tight text-lg leading-tight">MAAZA</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold -mt-1">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-200 text-slate-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@maazaprintwala.com'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
