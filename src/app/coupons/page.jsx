'use client';

import React, { useEffect, useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Percent, 
  DollarSign, 
  Calendar, 
  RefreshCw, 
  Check, 
  X,
  Tag
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: 0,
    maxDiscount: '',
    validUntil: '',
    usageLimit: '',
    isActive: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/coupons/admin');
      const list = res.data?.data?.coupons || res.data?.coupons || res.coupons || [];
      setCoupons(list);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue || !formData.validUntil) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        validUntil: new Date(formData.validUntil),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        isActive: formData.isActive
      };

      await axiosInstance.post('/coupons/admin', payload);
      toast.success('Coupon created successfully!');
      setIsModalOpen(false);
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderValue: 0,
        maxDiscount: '',
        validUntil: '',
        usageLimit: '',
        isActive: true
      });
      fetchCoupons();
    } catch (error) {
      toast.error(error.message || 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      await axiosInstance.put(`/coupons/admin/${coupon._id}`, {
        isActive: !coupon.isActive
      });
      toast.success(`Coupon marked as ${!coupon.isActive ? 'Active' : 'Inactive'}`);
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    try {
      await axiosInstance.delete(`/coupons/admin/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#0082CA]">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Coupons & Promo Codes</h1>
            <p className="text-sm text-[var(--text-muted)]">Create and monitor customer discounts, minimum order thresholds, and expiry limits.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="p-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0082CA] hover:bg-[#006ca8] text-white rounded-xl text-sm font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-muted)]">
            <thead className="bg-[var(--bg-subtle)] text-[var(--text-muted)] text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-[var(--border)]">Promo Code</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Discount</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Min. Order</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Max Cap</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Redeemed</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Expiry Date</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Status</th>
                <th className="px-6 py-4 border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-[var(--text-faint)]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0082CA]" />
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-[var(--text-faint)]">
                    <Tag className="w-8 h-8 mx-auto mb-2 text-[var(--text-faint)]" />
                    No coupons found. Create your first promotional voucher above!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = new Date(coupon.validUntil) < new Date();
                  return (
                    <tr key={coupon._id} className="hover:bg-[var(--bg-subtle)]/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-black text-[var(--text-main)] bg-[var(--hover)] px-2.5 py-1 rounded-md tracking-wider border border-[var(--border)]">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[var(--text-main)]">
                        {coupon.discountType === 'PERCENTAGE' ? (
                          <span className="text-emerald-600">{coupon.discountValue}% OFF</span>
                        ) : (
                          <span className="text-emerald-600">₹{coupon.discountValue} OFF</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-muted)]">
                        ₹{coupon.minOrderValue || 0}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-muted)]">
                        {coupon.maxDiscount ? `₹${coupon.maxDiscount}` : 'No limit'}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-muted)]">
                        <span className="font-bold text-[var(--text-main)]">{coupon.usedCount || 0}</span>
                        {coupon.usageLimit && <span className="text-[var(--text-faint)]"> / {coupon.usageLimit}</span>}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium">
                        <span className={isExpired ? 'text-rose-500 font-bold' : 'text-[var(--text-muted)]'}>
                          {new Date(coupon.validUntil).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {isExpired && <span className="block text-[10px] text-rose-500 uppercase font-bold">Expired</span>}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                            coupon.isActive && !isExpired
                              ? 'bg-emerald-500/10 text-[var(--accent-green)] border border-emerald-500/20 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-[var(--hover)] text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--border)]'
                          }`}
                        >
                          {coupon.isActive && !isExpired ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-faint)]"></span> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(coupon._id, coupon.code)}
                          className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-rose-600 hover:bg-red-500/10 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2.5">
                <Ticket className="w-5 h-5 text-[#0082CA]" />
                <h2 className="text-xl font-black text-[var(--text-main)]">Create New Coupon</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--hover)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl font-mono uppercase font-bold text-[var(--text-main)] focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-[#0082CA] outline-none text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-main)] text-sm font-semibold outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Discount Value *</label>
                  <input
                    type="number"
                    placeholder={formData.discountType === 'PERCENTAGE' ? '15' : '150'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-main)] text-sm font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    placeholder="499"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-main)] text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    placeholder="Optional (e.g. 500)"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-main)] text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Valid Until *</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-main)] text-sm outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Usage Limit</label>
                  <input
                    type="number"
                    placeholder="Optional (e.g. 500)"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-[var(--text-main)] text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#0082CA] rounded border-[var(--border-strong)]"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-[var(--text-main)]">
                  Activate coupon immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] font-semibold text-sm hover:bg-[var(--bg-subtle)] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#0082CA] hover:bg-[#006ca8] text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
