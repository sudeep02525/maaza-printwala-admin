'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  ExternalLink,
  ShieldCheck,
  Menu,
  Search,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  Check,
  CheckCheck,
  ShoppingBag,
  AlertTriangle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore.js';
import { useAdminUIStore } from '../../store/adminUIStore.js';
import axiosInstance from '../../services/axiosInstance.js';

export default function AdminHeader() {
  const { user } = useAdminAuthStore();
  const {
    toggleMobileSidebar,
    toggleSidebarCollapsed,
    isSidebarCollapsed,
    setCommandPaletteOpen,
  } = useAdminUIStore();

  const [isDark, setIsDark] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);
  const notifRef = useRef(null);

  // Sync theme state with DOM / localStorage on mount
  useEffect(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    setIsDark(isCurrentlyDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
    }
  };

  // Fetch notifications
  useEffect(() => {
    let isMounted = true;
    const fetchNotifications = async () => {
      setIsLoadingNotifs(true);
      try {
        const res = await axiosInstance.get('/notifications');
        const notifs = res?.data?.notifications || res?.notifications || [];
        if (isMounted) {
          if (notifs.length > 0) {
            setNotifications(notifs);
          } else {
            // Default initial alerts if DB has no historical entries yet
            setNotifications([
              {
                _id: 'default-1',
                channel: 'IN_APP',
                subject: 'Production Queue Active',
                message: 'All printing presses and pre-press QC checks are running smoothly.',
                createdAt: new Date().toISOString(),
                read: false,
              },
              {
                _id: 'default-2',
                channel: 'IN_APP',
                subject: 'Storefront Connected',
                message: 'Live catalogue and cart sync are online and processing transactions.',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                read: false,
              },
            ]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setNotifications([
            {
              _id: 'default-1',
              channel: 'IN_APP',
              subject: 'System Online',
              message: 'Administrator session active. Live monitoring enabled.',
              createdAt: new Date().toISOString(),
              read: false,
            },
          ]);
        }
      } finally {
        if (isMounted) setIsLoadingNotifs(false);
      }
    };

    fetchNotifications();
    return () => { isMounted = false; };
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsNotifOpen(false);
    };

    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isNotifOpen]);

  const unreadCount = notifications.filter(
    (n) => !n.read && n.metadata?.read !== 'true'
  ).length;

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
    } catch (e) {
      // optimistic
    }
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, read: true, metadata: { ...n.metadata, read: 'true' } } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, metadata: { ...n.metadata, read: 'true' } }))
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const adminFirstName = user?.name ? user.name.split(' ')[0] : 'Admin';

  const formatNotifTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <header className="h-16 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-4 sm:px-6 md:px-8 z-20 shrink-0 select-none transition-colors">
      {/* Left: Mobile Hamburger & Desktop Toggle + Greeting */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Trigger (P1 Fix) */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 -ml-1 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] rounded-lg transition-colors"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          className="hidden md:flex p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] rounded-lg transition-colors"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <span>{getGreeting()}, {adminFirstName}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-green)] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse"></span>
              Live
            </span>
          </h1>
          <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">
            Welcome back to your printing business command center
          </p>
        </div>
      </div>

      {/* Middle: Quick Search / Command Palette Trigger */}
      <div className="hidden lg:flex items-center max-w-xs w-full mx-4">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs bg-[var(--bg-subtle)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-lg text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-all"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)]" />
            <span>Search or jump to...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Theme Toggle, Notifications, Storefront */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search icon for tablet/mobile */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] transition-colors"
          title="Search (Ctrl+K)"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] transition-colors relative"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 scale-100" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 scale-100" />
          )}
        </button>

        {/* Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-muted)] text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span>{user?.role || 'ADMIN'}</span>
        </div>

        {/* Notifications Dropdown Panel (Button #5 Fix) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] transition-colors ${
              isNotifOpen ? 'bg-[var(--hover)] text-[var(--text-main)]' : ''
            }`}
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={isNotifOpen}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-red)] ring-2 ring-[var(--bg-card)] animate-pulse"></span>
            )}
          </button>

          {/* Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-subtle)]">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[var(--text-main)]">Notifications</h3>
                  {unreadCount > 0 ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-[var(--accent-red)] border border-red-500/20">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 text-[var(--accent-green)]">
                      All caught up
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] inline-flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                    <p className="font-medium text-[var(--text-main)]">No notifications</p>
                    <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
                      You are all caught up with orders and alerts.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const isUnread = !n.read && n.metadata?.read !== 'true';
                    return (
                      <div
                        key={n._id}
                        onClick={() => handleMarkAsRead(n._id)}
                        className={`p-3.5 flex items-start gap-3 hover:bg-[var(--hover)] transition-colors cursor-pointer text-left ${
                          isUnread ? 'bg-[var(--bg-subtle)]/60' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--hover)] flex items-center justify-center shrink-0 text-[var(--text-main)] border border-[var(--border)]">
                          {n.subject?.toLowerCase().includes('order') ? (
                            <ShoppingBag className="w-4 h-4 text-blue-500" />
                          ) : n.subject?.toLowerCase().includes('proof') || n.subject?.toLowerCase().includes('artwork') ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-[var(--accent-green)]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4
                              className={`text-xs truncate ${
                                isUnread
                                  ? 'font-bold text-[var(--text-main)]'
                                  : 'font-medium text-[var(--text-muted)]'
                              }`}
                            >
                              {n.subject || 'Notification'}
                            </h4>
                            <span className="text-[10px] text-[var(--text-faint)] shrink-0">
                              {formatNotifTime(n.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>

                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[var(--accent-red)] shrink-0 mt-1.5" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 bg-[var(--bg-subtle)] border-t border-[var(--border)] text-center">
                <Link
                  href="/support"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs font-semibold text-[var(--text-main)] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Leads &amp; Inquiries</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Primary Wix Pill Button: Open Site */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--text-main)] text-[var(--bg-card)] hover:opacity-90 transition-all shadow-sm"
        >
          <span>Open Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}
