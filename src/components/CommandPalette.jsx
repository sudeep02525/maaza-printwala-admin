'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Plus,
  FolderTree,
  Ticket,
  Truck,
  Users,
  BarChart3,
  Star,
  Headphones,
  Layers,
  FileText,
  Settings,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useAdminUIStore } from '../store/adminUIStore.js';

const commands = [
  { name: 'Dashboard', href: '/', category: 'Navigation', icon: LayoutDashboard },
  { name: 'Orders & QC', href: '/orders', category: 'Navigation', icon: ShoppingCart },
  { name: 'Products Catalogue', href: '/products', category: 'Navigation', icon: Package },
  { name: 'Add New Product', href: '/products/add', category: 'Actions', icon: Plus },
  { name: 'Categories & SEO', href: '/categories', category: 'Navigation', icon: FolderTree },
  { name: 'Add Category', href: '/categories/add', category: 'Actions', icon: Plus },
  { name: 'Coupons & Promotions', href: '/coupons', category: 'Navigation', icon: Ticket },
  { name: 'Delivery Rules', href: '/delivery-rules', category: 'Navigation', icon: Truck },
  { name: 'Reports & Analytics', href: '/reports', category: 'Navigation', icon: BarChart3 },
  { name: 'Customers', href: '/customers', category: 'Navigation', icon: Users },
  { name: 'Customer Reviews', href: '/reviews', category: 'Navigation', icon: Star },
  { name: 'Support & Inquiries', href: '/support', category: 'Navigation', icon: Headphones },
  { name: 'CMS & Content', href: '/cms', category: 'Navigation', icon: Layers },
  { name: 'Design Templates', href: '/templates', category: 'Navigation', icon: FileText },
  { name: 'Settings & Config', href: '/settings', category: 'Navigation', icon: Settings },
  { name: 'Open Live Storefront', href: 'http://localhost:3000', isExternal: true, category: 'Storefront', icon: ExternalLink },
];

export default function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAdminUIStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Global Ctrl+K / Cmd+K keybinding listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Filtered commands
  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd) => {
    setCommandPaletteOpen(false);
    if (cmd.isExternal) {
      window.open(cmd.href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(cmd.href);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredCommands[selectedIndex]);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[#E5E7EB]">
          <Search className="w-5 h-5 text-[#9CA3AF] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a page, command, or action... (↑↓ to navigate, Esc to close)"
            className="w-full py-4 text-sm bg-transparent text-[#111827] placeholder-[#9CA3AF] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#F3F4F6]">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#9CA3AF]">
              No matching pages or actions found.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, index) => {
                const Icon = cmd.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={cmd.name}
                    onClick={() => handleSelect(cmd)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#111827] text-white font-medium shadow-xs'
                        : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#6B7280]'}`} />
                      <span className="font-medium">{cmd.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-[#9CA3AF]'}`}>
                        {cmd.category}
                      </span>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#9CA3AF]">
          <span>Navigate with arrows ↑↓</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
}
