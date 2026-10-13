'use client';

import React, { useEffect, useState } from 'react';
import { 
  Star, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Check, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/reviews/admin');
      const list = res.data?.data?.reviews || res.data?.reviews || res.reviews || [];
      setReviews(list);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (review) => {
    try {
      await axiosInstance.patch(`/reviews/admin/${review._id}/approve`, {
        isApproved: !review.isApproved
      });
      toast.success(`Review ${!review.isApproved ? 'Approved' : 'Unapproved'}`);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axiosInstance.delete(`/reviews/admin/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Product Reviews & Moderation</h1>
            <p className="text-sm text-[var(--text-muted)]">Moderate customer ratings, verify genuine purchasers, and manage storefront feedback.</p>
          </div>
        </div>

        <button
          onClick={fetchReviews}
          className="p-2.5 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Reviews Table */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-muted)]">
            <thead className="bg-[var(--bg-subtle)] text-[var(--text-muted)] text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-[var(--border)]">Customer</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Product</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Rating</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Review & Comment</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Verified</th>
                <th className="px-6 py-4 border-b border-[var(--border)]">Status</th>
                <th className="px-6 py-4 border-b border-[var(--border)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-[var(--text-faint)]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0082CA]" />
                    Loading customer reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-[var(--text-faint)]">
                    <Star className="w-8 h-8 mx-auto mb-2 text-[var(--text-faint)]" />
                    No customer reviews yet.
                  </td>
                </tr>
              ) : (
                reviews.map((item) => (
                  <tr key={item._id} className="hover:bg-[var(--bg-subtle)]/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--text-main)]">{item.user?.name || 'Customer'}</div>
                      <div className="text-xs text-[var(--text-faint)]">{item.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text-main)] line-clamp-1">{item.product?.name || 'Product'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {item.title && <div className="font-bold text-[var(--text-main)] text-xs mb-0.5">{item.title}</div>}
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2">{item.comment}</p>
                    </td>
                    <td className="px-6 py-4">
                      {item.isVerifiedPurchase ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--text-faint)]">Public</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleApproval(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                          item.isApproved
                            ? 'bg-emerald-500/10 text-[var(--accent-green)] border border-emerald-500/20 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {item.isApproved ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Approved
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-rose-600 hover:bg-red-500/10 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
