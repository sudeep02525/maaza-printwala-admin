'use client';

import React, { useEffect, useState } from 'react';
import { 
  Headphones, 
  Building2, 
  MessageSquare, 
  RefreshCw, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  DollarSign,
  Phone,
  Mail,
  User,
  X
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'react-hot-toast';

export default function AdminSupportInquiries() {
  const [activeTab, setActiveTab] = useState('bulk'); // 'bulk' or 'tickets'
  const [bulkLeads, setBulkLeads] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Selected for edit
  const [selectedBulk, setSelectedBulk] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bulk') {
        const res = await axiosInstance.get('/inquiries/bulk/admin');
        const list = res.data?.data?.inquiries || res.data?.inquiries || res.inquiries || [];
        setBulkLeads(list);
      } else {
        const res = await axiosInstance.get('/inquiries/support/admin');
        const list = res.data?.data?.requests || res.data?.requests || res.requests || [];
        setTickets(list);
      }
    } catch (error) {
      toast.error('Failed to load inquiry data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleUpdateBulk = async (e) => {
    e.preventDefault();
    if (!selectedBulk) return;
    setUpdating(true);
    try {
      await axiosInstance.patch(`/inquiries/bulk/admin/${selectedBulk._id}/status`, {
        status: selectedBulk.status,
        quoteAmount: selectedBulk.quoteAmount ? Number(selectedBulk.quoteAmount) : undefined,
        adminNotes: selectedBulk.adminNotes
      });
      toast.success('B2B Lead status updated!');
      setSelectedBulk(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update lead');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setUpdating(true);
    try {
      await axiosInstance.patch(`/inquiries/support/admin/${selectedTicket._id}/status`, {
        status: selectedTicket.status,
        priority: selectedTicket.priority,
        adminNotes: selectedTicket.adminNotes
      });
      toast.success('Support ticket updated!');
      setSelectedTicket(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update ticket');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#0082CA]">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Support Desk & B2B Leads</h1>
            <p className="text-sm text-slate-500">Track enterprise bulk requests, customer support tickets, and quotations.</p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            activeTab === 'bulk'
              ? 'bg-[#0082CA] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          B2B Bulk Enquiries ({bulkLeads.length})
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            activeTab === 'tickets'
              ? 'bg-[#0082CA] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Customer Support Tickets ({tickets.length})
        </button>
      </div>

      {/* Bulk Enquiries Tab */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-200">Company & Contact</th>
                  <th className="px-6 py-4 border-b border-slate-200">Category</th>
                  <th className="px-6 py-4 border-b border-slate-200">Est. Quantity</th>
                  <th className="px-6 py-4 border-b border-slate-200">Quote</th>
                  <th className="px-6 py-4 border-b border-slate-200">Status</th>
                  <th className="px-6 py-4 border-b border-slate-200">Created</th>
                  <th className="px-6 py-4 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0082CA]" />
                      Loading enquiries...
                    </td>
                  </tr>
                ) : bulkLeads.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400">
                      <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No bulk enquiries submitted yet.
                    </td>
                  </tr>
                ) : (
                  bulkLeads.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{item.companyName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{item.contactPerson}</span>
                          <span>&bull;</span>
                          <span>{item.phone}</span>
                        </div>
                        <div className="text-xs text-slate-400">{item.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {item.productCategory}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {item.estimatedQuantity?.toLocaleString('en-IN')} units
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        {item.quoteAmount ? `₹${item.quoteAmount.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === 'NEW' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                          item.status === 'CONTACTED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          item.status === 'QUOTED' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          item.status === 'WON' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedBulk(item)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0082CA] hover:text-white text-xs font-bold text-slate-700 transition"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-200">Ticket ID</th>
                  <th className="px-6 py-4 border-b border-slate-200">User / Contact</th>
                  <th className="px-6 py-4 border-b border-slate-200">Subject & Order</th>
                  <th className="px-6 py-4 border-b border-slate-200">Priority</th>
                  <th className="px-6 py-4 border-b border-slate-200">Status</th>
                  <th className="px-6 py-4 border-b border-slate-200">Created</th>
                  <th className="px-6 py-4 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0082CA]" />
                      Loading support tickets...
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No support tickets opened yet.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-slate-900">
                        {ticket.ticketId || ticket._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{ticket.user?.name || 'Customer'}</div>
                        <div className="text-xs text-slate-400">{ticket.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 line-clamp-1">{ticket.subject}</div>
                        {ticket.orderNumber && (
                          <div className="text-xs text-[#0082CA] font-medium">Order: #{ticket.orderNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          ticket.priority === 'URGENT' ? 'bg-rose-100 text-rose-800' :
                          ticket.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          ticket.status === 'OPEN' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0082CA] hover:text-white text-xs font-bold text-slate-700 transition"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Bulk Lead Modal */}
      {selectedBulk && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0082CA]" />
                <h2 className="text-lg font-black text-slate-800">{selectedBulk.companyName}</h2>
              </div>
              <button onClick={() => setSelectedBulk(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4">
              <div><strong className="text-slate-700">Contact:</strong> {selectedBulk.contactPerson} ({selectedBulk.phone})</div>
              <div><strong className="text-slate-700">Email:</strong> {selectedBulk.email}</div>
              <div><strong className="text-slate-700">Category:</strong> {selectedBulk.productCategory}</div>
              <div><strong className="text-slate-700">Quantity:</strong> {selectedBulk.estimatedQuantity} units</div>
              {selectedBulk.specifications && (
                <div><strong className="text-slate-700">Specs:</strong> {selectedBulk.specifications}</div>
              )}
            </div>

            <form onSubmit={handleUpdateBulk} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                <select
                  value={selectedBulk.status}
                  onChange={(e) => setSelectedBulk({ ...selectedBulk, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUOTED">QUOTED</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Quotation Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={selectedBulk.quoteAmount || ''}
                  onChange={(e) => setSelectedBulk({ ...selectedBulk, quoteAmount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Internal Admin Notes</label>
                <textarea
                  rows={3}
                  placeholder="Notes from call or email follow-up..."
                  value={selectedBulk.adminNotes || ''}
                  onChange={(e) => setSelectedBulk({ ...selectedBulk, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBulk(null)}
                  className="px-4 py-2 border rounded-xl text-sm text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-[#0082CA] text-white rounded-xl text-sm font-bold shadow disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Update Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#0082CA]" />
                <h2 className="text-lg font-black text-slate-800">Ticket #{selectedTicket.ticketId || selectedTicket._id.slice(-6)}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4">
              <div><strong className="text-slate-700">Subject:</strong> {selectedTicket.subject}</div>
              <div><strong className="text-slate-700">User:</strong> {selectedTicket.user?.name} ({selectedTicket.user?.email})</div>
              {selectedTicket.orderNumber && (
                <div><strong className="text-slate-700">Order Ref:</strong> #{selectedTicket.orderNumber}</div>
              )}
              <div className="pt-2 text-slate-600 border-t border-slate-200/60 mt-2 font-normal leading-relaxed">
                {selectedTicket.description}
              </div>
            </div>

            <form onSubmit={handleUpdateTicket} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => setSelectedTicket({ ...selectedTicket, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Priority</label>
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => setSelectedTicket({ ...selectedTicket, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Admin Resolution / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Notes or response sent to customer..."
                  value={selectedTicket.adminNotes || ''}
                  onChange={(e) => setSelectedTicket({ ...selectedTicket, adminNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 border rounded-xl text-sm text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-[#0082CA] text-white rounded-xl text-sm font-bold shadow disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Update Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
