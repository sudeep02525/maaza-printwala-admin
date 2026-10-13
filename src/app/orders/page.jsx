'use client';

import React, { useEffect, useState } from 'react';
import { Package, Truck, Printer, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/admin/orders');
      const ordersList = response?.data?.orders || response?.orders || [];
      setOrders(ordersList);
      setError('');
    } catch (err) {
      setError(err?.message || 'An error occurred while fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/admin/orders/${id}/status`, { status: newStatus });
      fetchOrders(); // Refresh list
    } catch (err) {
      alert('Error updating status: ' + (err?.message || 'Network error'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--text-muted)] text-sm animate-pulse">
        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
        <span>Loading orders and production queues...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center shadow-xs">
        <AlertCircle className="w-8 h-8 text-[var(--accent-red)] mx-auto mb-3" />
        <p className="text-sm font-semibold text-[var(--text-main)] mb-1">Failed to load orders</p>
        <p className="text-xs text-[var(--text-muted)] mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-[var(--text-main)] text-[var(--bg-card)] hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 neu-flat p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Orders &amp; Fulfillment</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-normal">
            Manage customer orders and update production status.
          </p>
        </div>
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 neu-flat text-[var(--text-main)] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[var(--hover)] transition-colors neu-btn"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="neu-flat rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-subtle)] text-[var(--text-muted)] text-[11px] uppercase font-extrabold tracking-wider border-b border-[var(--border)]">
                <th className="py-4 px-6">Order Info</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Print Specs</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Amount (₹)</th>
                <th className="py-4 px-6">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm">
              {orders.map((order) => {
                const getStatusColor = (status) => {
                  if (status === 'DELIVERED') return 'bg-emerald-500/10 text-[var(--accent-green)] border border-emerald-500/20';
                  if (status === 'SHIPPED') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                  if (status === 'PRINTING') return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
                  return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                };
                
                return (
                  <tr key={order._id} className="hover:bg-[var(--hover)] transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-bold text-[var(--text-main)] bg-[var(--bg-subtle)] border border-[var(--border)] px-2 py-1 rounded-md">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-[var(--text-main)]">
                        {order.contactDetails?.fullName || order.user?.name || 'Guest'}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-normal">
                        {order.contactDetails?.phone || order.user?.phone || 'N/A'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-[var(--text-main)]">
                        {order.items?.[0]?.productNameSnapshot || 'Custom Print'}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
                        Qty: {order.items?.[0]?.quantity || '-'}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-[var(--text-muted)] text-xs font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-6 font-black text-[var(--text-main)]">
                      ₹{order.finalPayableAmount?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.fulfilmentStatus)}`}>
                          {order.fulfilmentStatus}
                        </span>
                        <select
                          value={order.fulfilmentStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="text-[11px] font-bold rounded-lg px-2.5 py-1.5 outline-none bg-[var(--bg-card)] border border-[var(--border)] focus:border-[var(--text-main)] cursor-pointer text-[var(--text-main)]"
                        >
                          <option value="ORDER_RECEIVED">Pending Receipt</option>
                          <option value="PRINTING">Send to Printing</option>
                          <option value="SHIPPED">Mark as Shipped</option>
                          <option value="DELIVERED">Mark as Delivered</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                    No active orders in the queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
