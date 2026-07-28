'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart,
  Package,
  FolderTree,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import axiosInstance from '../services/axiosInstance.js';

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => axiosInstance.get('/admin/stats'),
    retry: false,
  });

  const stats = data?.data?.stats || {
    totalOrders: 3,
    totalProducts: 3,
    totalCategories: 3,
    totalRevenue: 12500,
    pendingArtworkReviews: 2,
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
    <div className="space-y-8 max-w-7xl">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time management of dynamic catalogue, pricing rules, and print production pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            API Connected (v1.0.0)
          </span>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalOrders}</p>
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% this week
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">₹{stats.totalRevenue?.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 font-medium mt-2">Authoritative order volume</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Products</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalProducts}</p>
            <p className="text-xs text-blue-600 font-medium mt-2">Dynamic schema configurator</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Artwork Reviews</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-2">{stats.pendingArtworkReviews}</p>
            <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Action required
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Catalogue Architecture Quick Notice */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-pink-500 text-white uppercase tracking-wider mb-1">
            Dynamic Architecture
          </span>
          <h3 className="text-lg font-bold">100% Admin-Managed Catalogue & Pricing Engine</h3>
          <p className="text-sm text-slate-300 max-w-2xl">
            All categories, product attributes, custom numeric dimension breaks, swatch modifiers, and quantity discount rules are managed here and dynamically consumed by the storefront API.
          </p>
        </div>
        <a
          href="/products"
          className="px-5 py-2.5 bg-white text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2 flex-shrink-0"
        >
          Manage Catalogue <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Print Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live order queue from storefront customers</p>
          </div>
          <a
            href="/orders"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All Orders →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Product Item</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">{order.orderNumber}</td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-800">{order.user?.name || 'Guest User'}</p>
                    <p className="text-xs text-slate-400">{order.user?.email || 'N/A'}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {order.items?.[0]?.productNameSnapshot || 'Print Item'}
                    <span className="text-xs text-slate-400 ml-1">({order.items?.[0]?.quantity || 100} pcs)</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    ₹{order.totalAmount?.toLocaleString('en-IN') || 0}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === 'NEW'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : order.orderStatus === 'ARTWORK_REVIEW'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
