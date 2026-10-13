'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  Search,
  Package,
  Calendar,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'react-hot-toast';

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/reports');
      setData(res.data || res);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const summary = data?.summary || {
    totalOrders: 0,
    paidOrdersCount: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  };

  const statusBreakdown = data?.statusBreakdown || [];
  const paymentBreakdown = data?.paymentBreakdown || [];
  const dailySales = data?.dailySales || [];
  const topSearches = data?.topSearches || [];

  // Max daily revenue for relative progress bar height
  const maxDailyRevenue = Math.max(...dailySales.map((d) => d.revenue || 0), 1);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-slate-700" />
            <span>Reports & Commercial Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial performance, order status pipelines, and customer search discovery insights
          </p>
        </div>

        <button
          onClick={fetchReports}
          disabled={loading}
          className="p-2 neu-btn rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-xs font-bold">Refresh Data</span>
        </button>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neu-flat p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Paid Revenue</span>
            <div className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">
              ₹{summary.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold inline-flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> Live Verified Receipts
            </span>
          </div>
        </div>

        <div className="neu-flat p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Paid Conversions</span>
            <div className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center text-sky-600">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">{summary.paidOrdersCount}</h3>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Out of {summary.totalOrders} total orders placed
            </span>
          </div>
        </div>

        <div className="neu-flat p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">
              ₹{summary.avgOrderValue.toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Per transaction customer spend
            </span>
          </div>
        </div>

        <div className="neu-flat p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Search Demand Logs</span>
            <div className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center text-amber-600">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">
              {topSearches.reduce((acc, s) => acc + (s.count || 0), 0)}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block mt-1">
              Recorded search keyword queries
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 30-day Sales Trend & Top Searches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 30-day daily breakdown */}
        <div className="neu-flat p-6 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">30-Day Sales & Dispatch Cadence</h2>
              <p className="text-xs text-slate-400">Daily revenue captured across store</p>
            </div>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>

          {dailySales.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-xs">
              No daily sales data captured in the past 30 days yet.
            </div>
          ) : (
            <div className="space-y-2.5 pt-2 max-h-[340px] overflow-y-auto pr-1">
              {dailySales.map((day) => {
                const pct = Math.round(((day.revenue || 0) / maxDailyRevenue) * 100);
                return (
                  <div key={day._id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-600 font-medium">{day._id}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{day.orders} order(s)</span>
                        <span className="font-bold text-slate-800">₹{(day.revenue || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#0082CA] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search Analytics Discovery */}
        <div className="neu-flat p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Top Search Keywords</h2>
              <p className="text-xs text-slate-400">What shoppers look for</p>
            </div>
            <Search className="w-4 h-4 text-slate-400" />
          </div>

          {topSearches.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-xs">
              No customer search queries logged yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
              {topSearches.map((s, idx) => (
                <div key={s._id || idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{s.displayTerm || s.term}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0082CA] border border-sky-100">
                    {s.count} searches
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Grid: Order Pipeline Status & Payment Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Fulfillment Pipeline */}
        <div className="neu-flat p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Order Fulfilment Pipeline</h2>
            <Package className="w-4 h-4 text-slate-400" />
          </div>

          {statusBreakdown.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No status data yet.</div>
          ) : (
            <div className="space-y-3">
              {statusBreakdown.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 rounded-xl neu-inset text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    {item._id ? item._id.replace('_', ' ') : 'PENDING'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">{item.count} orders</span>
                    {item.revenue > 0 && (
                      <span className="text-slate-500">₹{(item.revenue || 0).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Breakdown */}
        <div className="neu-flat p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Payment Reconciliation</h2>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>

          {paymentBreakdown.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No payment records yet.</div>
          ) : (
            <div className="space-y-3">
              {paymentBreakdown.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 rounded-xl neu-inset text-xs">
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    item._id === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item._id === 'FAILED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item._id}
                  </span>
                  <span className="font-bold text-slate-800">{item.count} attempts</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
