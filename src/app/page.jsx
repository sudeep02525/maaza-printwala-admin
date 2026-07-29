'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Clock,
  CheckCircle,
  Printer,
  Truck,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import axiosInstance from '../services/axiosInstance.js';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => axiosInstance.get('/admin/stats'),
    retry: false,
  });

  const stats = data?.data?.stats || {
    totalOrders: 12,
    totalProducts: 6,
    totalUsers: 8,
    totalCategories: 4,
    totalRevenue: 145000,
    pendingArtworkReviews: 4,
  };

  const recentOrders = data?.data?.recentOrders || [
    {
      _id: '1',
      orderNumber: 'MZ-202607-8492',
      user: { name: 'Raj Mehta', email: 'raj.mehta@corporatesolutions.in' },
      totalAmount: 4500,
      orderStatus: 'NEW',
      createdAt: '2026-07-27T12:00:00.000Z',
      items: [{ productNameSnapshot: 'Standard Visiting Cards (300 GSM Matte)', quantity: 1000 }],
    },
    {
      _id: '2',
      orderNumber: 'MZ-202607-3910',
      user: { name: 'Rajesh Sharma', email: 'rajesh.sharma@sharmatech.com' },
      totalAmount: 5200,
      orderStatus: 'ARTWORK_REVIEW',
      createdAt: '2026-07-27T11:00:00.000Z',
      items: [{ productNameSnapshot: 'Custom Flex Banners (340 GSM Standard Flex)', quantity: 5 }],
    },
    {
      _id: '3',
      orderNumber: 'MZ-202607-1102',
      user: { name: 'Ankita Verma', email: 'ankita@creativestudio.in' },
      totalAmount: 2800,
      orderStatus: 'PRODUCTION',
      createdAt: '2026-07-26T10:00:00.000Z',
      items: [{ productNameSnapshot: 'Personalized Cotton T-Shirts (100% Combed Cotton)', quantity: 10 }],
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl select-none">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Printing Business Control Center</h1>
          <p className="text-sm text-slate-600 mt-1 font-normal">
            Monitor live production orders, review customer print artwork, and manage daily dispatch schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Live Press Active (v1.0.0)
          </span>
        </div>
      </div>

      {/* 5 Operational KPIs for Printing Business Owner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* KPI 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900 mt-2">₹{stats.totalRevenue?.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Authoritative volume
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Today's Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Today&apos;s Orders</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalOrders}</p>
            <p className="text-[11px] text-blue-600 font-bold mt-1.5 flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" /> +14.2% daily growth
            </p>
          </div>
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Pending Artwork Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Pending Artwork</p>
            <p className="text-2xl font-black text-amber-600 mt-2">{stats.pendingArtworkReviews}</p>
            <p className="text-[11px] text-amber-600 font-bold mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Pre-press check needed
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: In Production Queue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Printing Queue</p>
            <p className="text-2xl font-black text-purple-600 mt-2">{Math.round((stats.totalOrders || 12) * 0.6)}</p>
            <p className="text-[11px] text-purple-600 font-bold mt-1.5 flex items-center gap-1">
              <Printer className="w-3 h-3" /> Active on press
            </p>
          </div>
          <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
            <Printer className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 5: Ready for Dispatch */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Dispatch Ready</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{Math.round((stats.totalOrders || 12) * 0.3)}</p>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5 flex items-center gap-1">
              <Truck className="w-3 h-3" /> Packed &amp; waiting
            </p>
          </div>
          <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
            <Truck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Printing Workflow & Pre-Press Quick Center */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0F172A] to-blue-950 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-blue-500 text-white uppercase tracking-wider mb-1">
            Pre-Press Assurance Engine
          </span>
          <h3 className="text-xl font-black text-white">Live Press Production &amp; Artwork Verification Center</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Review uploaded customer print artwork boundaries, verify safe-zone alignment, approve proofs, and assign jobs to press machines for timely dispatch.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <a
            href="/orders"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <FileCheck className="w-4 h-4" /> Review Artworks (4)
          </a>
          <a
            href="/products"
            className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-all border border-white/20 flex items-center justify-center gap-2"
          >
            Manage Catalogue <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Live Production Orders Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Live Production Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">Active print queue from storefront customers</p>
          </div>
          <a
            href="/orders"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <span>View Complete Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-200">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Client / Corporate Account</th>
                <th className="py-4 px-6">Print Specification</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Production State</th>
                <th className="py-4 px-6">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentOrders.map((order) => {
                const isReview = order.orderStatus === 'ARTWORK_REVIEW';
                const isProd = order.orderStatus === 'PRODUCTION';
                
                return (
                  <tr key={order._id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{order.orderNumber}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800">{order.user?.name || 'Guest Account'}</p>
                      <p className="text-xs text-slate-400 font-normal">{order.user?.email || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-medium">
                      {order.items?.[0]?.productNameSnapshot || 'Print Item'}
                      <span className="text-xs text-slate-400 font-semibold block mt-0.5">Qty: {order.items?.[0]?.quantity || 100} units</span>
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900">
                      ₹{order.totalAmount?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isReview
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : isProd
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isReview ? 'bg-amber-500 animate-pulse' : isProd ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                        {isReview ? 'Artwork Review' : isProd ? 'In Printing' : order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={`/orders/${order._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-all"
                      >
                        <span>{isReview ? 'Verify DPI Proof' : isProd ? 'Track Press Run' : 'Manage Order'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
