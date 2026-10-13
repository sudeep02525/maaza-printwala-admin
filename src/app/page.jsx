'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Clock,
  CheckCircle2,
  Printer,
  Truck,
  FileCheck,
  ArrowRight,
  ArrowUpRight,
  Users,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Plus,
} from 'lucide-react';
import axiosInstance from '../services/axiosInstance.js';
import { useAdminAuthStore } from '../store/adminAuthStore.js';

// Format currency in Indian Rupees
const formatCurrency = (amount = 0) => {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
};

// Relative time formatting
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

// Generate complete 30-day continuous timeline from dailySales
const build30DaysTimeline = (dailySales = []) => {
  const map = {};
  if (Array.isArray(dailySales)) {
    dailySales.forEach((item) => {
      if (item && item._id) {
        map[item._id] = {
          orders: item.orders || 0,
          revenue: item.revenue || 0,
        };
      }
    });
  }

  const timeline = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const entry = map[dateStr] || { orders: 0, revenue: 0 };
    timeline.push({
      date: dateStr,
      label,
      orders: entry.orders,
      revenue: entry.revenue,
    });
  }
  return timeline;
};

export default function AdminDashboardPage() {
  const { user } = useAdminAuthStore();
  const [timeFilter, setTimeFilter] = useState('Month'); // 'Day' | 'Week' | 'Month'
  const [activeChartPoint, setActiveChartPoint] = useState(null);

  // Real API query for admin dashboard statistics
  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
    refetch,
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => axiosInstance.get('/admin/stats'),
    staleTime: 30000,
    retry: 1,
  });

  // Extract authoritative data without any fake mock fallback
  const rawStats = statsResponse?.data?.stats || statsResponse?.stats;
  const recentOrders = statsResponse?.data?.recentOrders || statsResponse?.recentOrders || [];
  const rawDailySales = statsResponse?.data?.dailySales || statsResponse?.dailySales || [];

  // Build 30-day time-series array
  const timelineData = useMemo(() => build30DaysTimeline(rawDailySales), [rawDailySales]);

  // Max value calculation for SVG chart scaling
  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(...timelineData.map((d) => d.revenue), 0);
    return maxVal > 0 ? maxVal : 10000;
  }, [timelineData]);

  // Loading skeleton
  if (isStatsLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-[#E5E7EB]">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-[#F3F4F6] rounded"></div>
            <div className="h-4 w-72 bg-[#F3F4F6] rounded"></div>
          </div>
          <div className="h-9 w-32 bg-[#F3F4F6] rounded-full"></div>
        </div>

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-[12px] border border-[#E5E7EB] space-y-3">
              <div className="h-4 w-20 bg-[#F3F4F6] rounded"></div>
              <div className="h-8 w-28 bg-[#F3F4F6] rounded"></div>
              <div className="h-4 w-32 bg-[#F3F4F6] rounded"></div>
            </div>
          ))}
        </div>

        {/* 2 Columns Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[12px] border border-[#E5E7EB] h-72"></div>
            <div className="bg-white p-6 rounded-[12px] border border-[#E5E7EB] h-80"></div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[12px] border border-[#E5E7EB] h-32"></div>
            <div className="bg-white p-6 rounded-[12px] border border-[#E5E7EB] h-48"></div>
            <div className="bg-white p-6 rounded-[12px] border border-[#E5E7EB] h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isStatsError) {
    return (
      <div className="max-w-xl mx-auto mt-16 bg-white p-8 rounded-[12px] border border-[#E5E7EB] text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#FEF3F2] text-[#F04438] flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#111827]">Failed to load dashboard data</h2>
        <p className="text-xs text-[#6B7280] mt-1 mb-6">
          {statsError?.message || 'Could not connect to the administration server. Please verify backend connectivity.'}
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-[#111827] text-white hover:bg-black transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  // Authoritative real fields
  const stats = {
    totalOrders: rawStats?.totalOrders ?? 0,
    totalProducts: rawStats?.totalProducts ?? 0,
    totalUsers: rawStats?.totalUsers ?? 0,
    totalCategories: rawStats?.totalCategories ?? 0,
    totalRevenue: rawStats?.totalRevenue ?? 0,
    pendingArtworkReviews: rawStats?.pendingArtworkReviews ?? 0,
    todayOrders: rawStats?.todayOrders ?? 0,
    revenueToday: rawStats?.revenueToday ?? 0,
    revenueThisMonth: rawStats?.revenueThisMonth ?? 0,
    growth: rawStats?.growth || {
      orders: 0,
      revenue: 0,
      customers: 0,
      ordersThisWeek: 0,
      ordersLastWeek: 0,
      revenueThisWeek: 0,
      revenueLastWeek: 0,
      usersThisWeek: 0,
      usersLastWeek: 0,
    },
    productStatus: rawStats?.productStatus || {
      active: rawStats?.totalProducts ?? 0,
      outOfStock: 0,
      draft: 0,
    },
    statusBreakdown: rawStats?.statusBreakdown || {
      NEW: 0,
      ARTWORK_REVIEW: 0,
      PRODUCTION: 0,
      DISPATCH_READY: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    },
  };

  const adminName = user?.name ? user.name.split(' ')[0] : 'Admin';

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* =========================================================================
          Top Header: Greeting, Overview Performance Title, and Time Filter Tabs
      ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827]">Hello, {adminName}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF3] text-[#12B76A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]"></span>
              Live Storefront Connected
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 font-normal">
            Overview performance across production queues, customer proofing, and revenue.
          </p>
        </div>

        {/* Wix-style Filter Pills: Day | Week | Month */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-[#F3F4F6] rounded-lg border border-[#E5E7EB]">
            {['Day', 'Week', 'Month'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeFilter === filter
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#111827] text-white hover:bg-black transition-all shadow-xs"
          >
            <span>Open Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* =========================================================================
          4 Overview Cards (Wix-Style): Orders | Revenue | Customers | Artwork
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Orders */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Orders</span>
            <span className="p-2 rounded-lg bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB]">
              <ShoppingCart className="w-4 h-4 text-[#4B5563]" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#111827] tracking-tight">
              {timeFilter === 'Day'
                ? stats.todayOrders
                : timeFilter === 'Week'
                ? stats.growth.ordersThisWeek || stats.totalOrders
                : stats.totalOrders}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${
                  stats.growth.orders > 0
                    ? 'bg-[#ECFDF3] text-[#12B76A]'
                    : stats.growth.orders < 0
                    ? 'bg-[#FEF3F2] text-[#F04438]'
                    : 'bg-[#F3F4F6] text-[#6B7280]'
                }`}
              >
                {stats.growth.orders > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : stats.growth.orders < 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : null}
                {stats.growth.orders > 0 ? `+${stats.growth.orders}%` : `${stats.growth.orders}%`}
              </span>
              <span className="text-[11px] text-[#6B7280]">from last 7 days</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1.5 font-medium">
              {stats.todayOrders} new order{stats.todayOrders !== 1 ? 's' : ''} today
            </p>
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Revenue</span>
            <span className="p-2 rounded-lg bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB]">
              <DollarSign className="w-4 h-4 text-[#4B5563]" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#111827] tracking-tight">
              {timeFilter === 'Day'
                ? formatCurrency(stats.revenueToday)
                : timeFilter === 'Week'
                ? formatCurrency(stats.growth.revenueThisWeek || stats.totalRevenue)
                : formatCurrency(stats.totalRevenue)}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${
                  stats.growth.revenue > 0
                    ? 'bg-[#ECFDF3] text-[#12B76A]'
                    : stats.growth.revenue < 0
                    ? 'bg-[#FEF3F2] text-[#F04438]'
                    : 'bg-[#F3F4F6] text-[#6B7280]'
                }`}
              >
                {stats.growth.revenue > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : stats.growth.revenue < 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : null}
                {stats.growth.revenue > 0 ? `+${stats.growth.revenue}%` : `${stats.growth.revenue}%`}
              </span>
              <span className="text-[11px] text-[#6B7280]">from last 7 days</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1.5 font-medium">
              {formatCurrency(stats.revenueToday)} gained today
            </p>
          </div>
        </div>

        {/* Card 3: Customers */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Customers</span>
            <span className="p-2 rounded-lg bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB]">
              <Users className="w-4 h-4 text-[#4B5563]" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#111827] tracking-tight">
              {stats.totalUsers}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${
                  stats.growth.customers > 0
                    ? 'bg-[#ECFDF3] text-[#12B76A]'
                    : stats.growth.customers < 0
                    ? 'bg-[#FEF3F2] text-[#F04438]'
                    : 'bg-[#F3F4F6] text-[#6B7280]'
                }`}
              >
                {stats.growth.customers > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : stats.growth.customers < 0 ? (
                  <TrendingDown className="w-3 h-3" />
                ) : null}
                {stats.growth.customers > 0 ? `+${stats.growth.customers}%` : `${stats.growth.customers}%`}
              </span>
              <span className="text-[11px] text-[#6B7280]">from last 7 days</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1.5 font-medium">
              {stats.growth.usersThisWeek > 0 ? `+${stats.growth.usersThisWeek} new this week` : 'Authoritative registered base'}
            </p>
          </div>
        </div>

        {/* Card 4: Pending Artwork */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">Pending Artwork</span>
            <span className="p-2 rounded-lg bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB]">
              <FileCheck className="w-4 h-4 text-[#4B5563]" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
              <span>{stats.pendingArtworkReviews}</span>
              {stats.pendingArtworkReviews > 0 ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]">
                  ⚠ {stats.pendingArtworkReviews} new
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF3] text-[#12B76A]">
                  All clear
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[11px] text-[#6B7280]">Pre-press check required</span>
            </div>
            <div className="mt-1.5">
              <Link
                href="/orders"
                className="text-[11px] font-semibold text-[#111827] hover:underline inline-flex items-center gap-1"
              >
                <span>Review files now</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Two Columns: Wide Left (Revenue + Chart + Orders) and Narrow Right (Advisor, Products, Activities)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ==================== WIDE LEFT COLUMN (2 Cols) ==================== */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Card + 30-Day Time-Series Chart */}
          <div className="bg-white p-6 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F3F4F6]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#111827]">Revenue</h2>
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-[#F3F4F6] text-[#4B5563]">
                    Last 30d
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">Authoritative volume across storefront orders</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-2xl font-black text-[#111827]">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <div className="text-xs text-[#12B76A] font-semibold mt-0.5">
                  You gained {formatCurrency(stats.revenueThisMonth)} this month
                </div>
              </div>
            </div>

            {/* Interactive SVG Chart (Line + Bar Time-Series) */}
            <div className="mt-6">
              <div className="h-56 w-full relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 600 180"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#111827" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#111827" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 45, 90, 135].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="600"
                      y2={y}
                      stroke="#F3F4F6"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Daily Bars */}
                  {timelineData.map((d, index) => {
                    const barWidth = 14;
                    const x = index * 20 + 4;
                    const barHeight = maxRevenue > 0 ? (d.revenue / maxRevenue) * 120 : 0;
                    const y = 160 - barHeight;
                    const isHovered = activeChartPoint?.date === d.date;

                    return (
                      <g key={d.date}>
                        <rect
                          x={x}
                          y={Math.min(y, 156)}
                          width={barWidth}
                          height={Math.max(barHeight, 4)}
                          rx="3"
                          fill={isHovered ? '#111827' : d.revenue > 0 ? '#E0E7FF' : '#F3F4F6'}
                          className="transition-colors cursor-pointer"
                          onMouseEnter={() => setActiveChartPoint(d)}
                        />
                      </g>
                    );
                  })}

                  {/* Line Graph over the points */}
                  {(() => {
                    const points = timelineData.map((d, index) => {
                      const x = index * 20 + 11;
                      const y = 160 - (maxRevenue > 0 ? (d.revenue / maxRevenue) * 120 : 0);
                      return `${x},${y}`;
                    });

                    const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';
                    const areaD =
                      points.length > 0
                        ? `M ${points.join(' L ')} L ${591},160 L 11,160 Z`
                        : '';

                    return (
                      <>
                        <path d={areaD} fill="url(#revenueGradient)" />
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#111827"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {timelineData.map((d, index) => {
                          if (d.revenue === 0) return null;
                          const x = index * 20 + 11;
                          const y = 160 - (d.revenue / maxRevenue) * 120;
                          const isHovered = activeChartPoint?.date === d.date;
                          return (
                            <circle
                              key={d.date}
                              cx={x}
                              cy={y}
                              r={isHovered ? '5' : '3.5'}
                              fill="#FFFFFF"
                              stroke="#111827"
                              strokeWidth="2"
                              className="cursor-pointer transition-all"
                              onMouseEnter={() => setActiveChartPoint(d)}
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>

                {/* Hover Tooltip */}
                {activeChartPoint && (
                  <div
                    className="absolute top-2 right-4 bg-[#111827] text-white px-3 py-1.5 rounded-lg text-xs shadow-md pointer-events-none"
                  >
                    <p className="font-bold">{activeChartPoint.label}</p>
                    <p className="text-[11px] text-gray-300">
                      Revenue: {formatCurrency(activeChartPoint.revenue)} ({activeChartPoint.orders} order{activeChartPoint.orders !== 1 ? 's' : ''})
                    </p>
                  </div>
                )}
              </div>

              {/* Chart Date Range Labels */}
              <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] font-medium pt-3 border-t border-[#F3F4F6] mt-2">
                <span>{timelineData[0]?.label || '30 days ago'}</span>
                <span>{timelineData[15]?.label || '15 days ago'}</span>
                <span>Today ({timelineData[29]?.label || 'Latest'})</span>
              </div>
            </div>
          </div>

          {/* Operational Workflow Status Pipeline */}
          <div className="bg-white p-6 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#111827]">Order Fulfillment Pipeline</h3>
                <p className="text-xs text-[#6B7280]">Live status breakdown from database records</p>
              </div>
              <Link
                href="/orders"
                className="text-xs font-semibold text-[#111827] hover:underline inline-flex items-center gap-1"
              >
                <span>Manage Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Step 1: New Orders */}
              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#6B7280]">New</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <p className="text-lg font-black text-[#111827] mt-1">{stats.statusBreakdown.NEW}</p>
                <p className="text-[10px] text-[#9CA3AF]">Order received</p>
              </div>

              {/* Step 2: Artwork Review */}
              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#6B7280]">Artwork QC</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <p className="text-lg font-black text-[#111827] mt-1">{stats.statusBreakdown.ARTWORK_REVIEW}</p>
                <p className="text-[10px] text-[#9CA3AF]">Pre-press proofing</p>
              </div>

              {/* Step 3: In Production */}
              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#6B7280]">Production</span>
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                </div>
                <p className="text-lg font-black text-[#111827] mt-1">{stats.statusBreakdown.PRODUCTION}</p>
                <p className="text-[10px] text-[#9CA3AF]">On printing press</p>
              </div>

              {/* Step 4: Dispatch Ready */}
              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#6B7280]">Dispatch</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                </div>
                <p className="text-lg font-black text-[#111827] mt-1">{stats.statusBreakdown.DISPATCH_READY}</p>
                <p className="text-[10px] text-[#9CA3AF]">Packed & ready</p>
              </div>

              {/* Step 5: Delivered */}
              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#6B7280]">Delivered</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-lg font-black text-[#111827] mt-1">{stats.statusBreakdown.DELIVERED}</p>
                <p className="text-[10px] text-[#9CA3AF]">Completed</p>
              </div>
            </div>
          </div>

          {/* Recent Orders Table (Authoritative Real Records) */}
          <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-sm font-bold text-[#111827]">Recent Production Orders</h3>
                <p className="text-xs text-[#6B7280]">Latest orders received from storefront customers</p>
              </div>
              <Link
                href="/orders"
                className="text-xs font-semibold text-[#111827] hover:underline inline-flex items-center gap-1"
              >
                <span>View Complete Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-[#F3F4F6] text-[#9CA3AF] flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-[#111827]">No customer orders placed yet</p>
                <p className="text-xs text-[#6B7280] mt-1">
                  Once customers place orders on your storefront, they will immediately appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] uppercase font-bold text-[#6B7280] tracking-wider">
                      <th className="py-3 px-5">Order #</th>
                      <th className="py-3 px-5">Client / Account</th>
                      <th className="py-3 px-5">Specification</th>
                      <th className="py-3 px-5">Amount</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] text-xs">
                    {recentOrders.map((order) => {
                      const clientName =
                        order.user?.name ||
                        order.contactDetails?.fullName ||
                        order.deliveryAddress?.fullName ||
                        'Guest Client';
                      const clientEmail =
                        order.user?.email ||
                        order.contactDetails?.email ||
                        'Direct order';
                      const firstItem = order.items?.[0];
                      const totalAmt = order.finalPayableAmount || order.totalAmount || 0;
                      const status = order.fulfilmentStatus || order.orderStatus || 'ORDER_RECEIVED';

                      const isReview = status === 'ARTWORK_REVIEW' || status === 'ARTWORK_CHANGES_REQUIRED';
                      const isProd = status === 'PRINTING' || status === 'PRODUCTION' || status === 'QUEUED_FOR_PRINTING';
                      const isDelivered = status === 'DELIVERED';

                      return (
                        <tr key={order._id} className="hover:bg-[#F9FAFB] transition-colors">
                          <td className="py-3.5 px-5 font-bold text-[#111827]">
                            {order.orderNumber}
                          </td>
                          <td className="py-3.5 px-5">
                            <p className="font-semibold text-[#111827]">{clientName}</p>
                            <p className="text-[11px] text-[#9CA3AF] truncate max-w-[140px]">
                              {clientEmail}
                            </p>
                          </td>
                          <td className="py-3.5 px-5 text-[#4B5563]">
                            <p className="font-medium text-[#111827] truncate max-w-[180px]">
                              {firstItem?.productNameSnapshot || 'Custom Print Job'}
                            </p>
                            <span className="text-[11px] text-[#9CA3AF]">
                              Qty: {firstItem?.quantity || 1} units
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-bold text-[#111827]">
                            {formatCurrency(totalAmt)}
                          </td>
                          <td className="py-3.5 px-5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                isReview
                                  ? 'bg-[#FFFAEB] text-[#B54708]'
                                  : isProd
                                  ? 'bg-[#F9F5FF] text-[#6941C6]'
                                  : isDelivered
                                  ? 'bg-[#ECFDF3] text-[#12B76A]'
                                  : 'bg-[#F3F4F6] text-[#4B5563]'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isReview
                                    ? 'bg-[#B54708] animate-pulse'
                                    : isProd
                                    ? 'bg-[#6941C6]'
                                    : isDelivered
                                    ? 'bg-[#12B76A]'
                                    : 'bg-[#6B7280]'
                                }`}
                              ></span>
                              {status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <Link
                              href={`/orders/${order._id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#111827] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-md transition-colors"
                            >
                              <span>Manage</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ==================== NARROW RIGHT COLUMN (1 Col) ==================== */}
        <div className="space-y-6">
          
          {/* 1. Shop Advisor (Real Data Driven Alert) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider px-1">
              Shop Advisor
            </h3>

            {stats.pendingArtworkReviews > 0 ? (
              <div className="bg-[#FFFCF5] p-5 rounded-[12px] border border-[#FEDF89] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FEF0C7] text-[#B54708] shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#B54708]">
                      {stats.pendingArtworkReviews} order{stats.pendingArtworkReviews > 1 ? 's' : ''} need artwork review
                    </h4>
                    <p className="text-[11px] text-[#7A271A] mt-0.5 leading-relaxed">
                      Customer upload files are awaiting DPI resolution &amp; bleed proofing before pressing.
                    </p>
                  </div>
                </div>
                <Link
                  href="/orders"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold bg-[#B54708] text-white rounded-lg hover:bg-[#93370D] transition-colors shadow-xs"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Review Proofs Now</span>
                </Link>
              </div>
            ) : stats.statusBreakdown.PRODUCTION > 0 ? (
              <div className="bg-[#F8F9FC] p-5 rounded-[12px] border border-[#D9D6FE] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#ECE9FE] text-[#5925DC] shrink-0">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#5925DC]">
                      {stats.statusBreakdown.PRODUCTION} job{stats.statusBreakdown.PRODUCTION > 1 ? 's' : ''} on printing press
                    </h4>
                    <p className="text-[11px] text-[#42307D] mt-0.5 leading-relaxed">
                      Jobs are printing on schedule. Prepare packaging for dispatch.
                    </p>
                  </div>
                </div>
                <Link
                  href="/orders"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold bg-[#5925DC] text-white rounded-lg hover:bg-[#4a1fb8] transition-colors shadow-xs"
                >
                  <span>Track Press Run</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="bg-[#F6FEF9] p-5 rounded-[12px] border border-[#A6F4C5] shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#D1FADF] text-[#039855] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#027A48]">
                      All queues running smoothly
                    </h4>
                    <p className="text-[11px] text-[#054F31] mt-0.5 leading-relaxed">
                      No artwork bottlenecks. Storefront catalogue is active and accepting new orders.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Products Breakdown Widget (Active / Out of Stock / Draft) */}
          <div className="bg-white p-5 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-sm font-bold text-[#111827]">Products</h3>
                <p className="text-[11px] text-[#6B7280]">Catalogue availability status</p>
              </div>
              <Link
                href="/products"
                className="text-xs font-semibold text-[#111827] hover:underline inline-flex items-center gap-1"
              >
                <span>See All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Active */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#12B76A]"></span>
                  <span className="font-medium text-[#4B5563]">Active</span>
                </div>
                <span className="font-bold text-[#111827]">
                  {stats.productStatus.active}
                </span>
              </div>

              {/* Out of Stock */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F04438]"></span>
                  <span className="font-medium text-[#4B5563]">Out of stock</span>
                </div>
                <span className="font-bold text-[#111827]">
                  {stats.productStatus.outOfStock}
                </span>
              </div>

              {/* Draft */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
                  <span className="font-medium text-[#4B5563]">Draft</span>
                </div>
                <span className="font-bold text-[#111827]">
                  {stats.productStatus.draft}
                </span>
              </div>
            </div>

            <Link
              href="/products/add"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </Link>
          </div>

          {/* 3. Recent Activities Widget */}
          <div className="bg-white p-5 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-sm font-bold text-[#111827]">Recent Activities</h3>
                <p className="text-[11px] text-[#6B7280]">Live storefront order events</p>
              </div>
              <Link
                href="/orders"
                className="text-xs font-semibold text-[#111827] hover:underline inline-flex items-center gap-1"
              >
                <span>All Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] text-center py-4">No recent activity recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => {
                  const clientName =
                    order.user?.name ||
                    order.contactDetails?.fullName ||
                    order.deliveryAddress?.fullName ||
                    'Customer';
                  const productName = order.items?.[0]?.productNameSnapshot || 'Print Items';
                  const timeAgo = formatTimeAgo(order.createdAt);

                  return (
                    <div key={order._id} className="flex items-start gap-2.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#111827] mt-1.5 shrink-0"></span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#111827] leading-snug">
                          <span className="font-semibold">{clientName}</span> ordered{' '}
                          <span className="text-[#4B5563]">{productName}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#9CA3AF]">
                          <span>{timeAgo}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#111827]">
                            {formatCurrency(order.finalPayableAmount || order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
