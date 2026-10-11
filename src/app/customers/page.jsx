'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  Building2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Calendar,
  FileCheck
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'react-hot-toast';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/users');
      const list = res.data?.data?.users || res.data?.users || res.users || [];
      setUsers(list);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const q = searchTerm.toLowerCase();
    return users.filter(u => 
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.companyName?.toLowerCase().includes(q) ||
      u.gstin?.toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Customer Directory</h1>
            <p className="text-sm text-slate-500">Manage registered corporate accounts, individual buyers, and GSTIN profiles.</p>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers by name, email, phone, company, or GSTIN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm outline-none text-slate-800 placeholder-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200">Customer Name</th>
                <th className="px-6 py-4 border-b border-slate-200">Contact Information</th>
                <th className="px-6 py-4 border-b border-slate-200">Company & GSTIN</th>
                <th className="px-6 py-4 border-b border-slate-200">Role</th>
                <th className="px-6 py-4 border-b border-slate-200">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0082CA]" />
                    Loading customers...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">ID: {user._id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.companyName ? (
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#0082CA]" />
                            {user.companyName}
                          </div>
                          {user.gstin && (
                            <div className="text-xs font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                              <FileCheck className="w-3 h-3 text-emerald-600" />
                              GST: {user.gstin}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Individual Account</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {user.createdAt ? (
                        new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      ) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
