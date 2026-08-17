'use client';

import React, { useEffect, useState } from 'react';
import { Package, Truck, Printer, CheckCircle, RefreshCw } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/admin/orders');
      if (response.data.success) {
        setOrders(response.data.data.orders);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/admin/orders/${id}/status`, { status: newStatus });
      if (response.data.success) {
        fetchOrders(); // Refresh list
      } else {
        alert(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (isLoading) return <div className="text-slate-500">Loading orders...</div>;
  if (error) return <div className="text-rose-500">{error}</div>;

  return (
    <div className="space-y-6 max-w-7xl select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-700">Orders & Fulfillment</h1>
          <p className="text-sm text-slate-600 mt-1 font-normal">Manage customer orders and update production status.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-200 transition-colors border border-slate-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-200">
                <th className="py-4 px-6">Order Info</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Print Specs</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Amount (₹)</th>
                <th className="py-4 px-6">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {orders.map((order) => {
                const getStatusColor = (status) => {
                   if(status === 'DELIVERED') return 'bg-slate-100 text-slate-600 border-slate-200';
                   if(status === 'SHIPPED') return 'bg-slate-50 text-slate-600 border-slate-200';
                   if(status === 'PRINTING') return 'bg-slate-50 text-slate-600 border-slate-200';
                   return 'bg-slate-100 text-slate-700 border-slate-200';
                };
                
                return (
                <tr key={order._id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="py-4 px-6">
                     <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{order.orderNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700">{order.contactDetails?.fullName || order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-500 font-normal">{order.contactDetails?.phone || order.user?.phone || 'N/A'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-600">{order.items?.[0]?.productNameSnapshot || 'Custom Print'}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Qty: {order.items?.[0]?.quantity || '-'}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-xs font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </td>
                  <td className="py-4 px-6 font-black text-slate-700">
                    ₹{order.finalPayableAmount?.toLocaleString('en-IN') || 0}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-2 items-start">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.fulfilmentStatus)}`}>
                         {order.fulfilmentStatus}
                       </span>
                       <select
                         value={order.fulfilmentStatus}
                         onChange={(e) => handleStatusChange(order._id, e.target.value)}
                         className="text-[11px] font-bold border border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 cursor-pointer bg-slate-50 text-slate-700"
                       >
                         <option value="ORDER_RECEIVED">Pending Receipt</option>
                         <option value="PRINTING">Send to Printing</option>
                         <option value="SHIPPED">Mark as Shipped</option>
                         <option value="DELIVERED">Mark as Delivered</option>
                       </select>
                    </div>
                  </td>
                </tr>
              )})}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No active orders in the queue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
