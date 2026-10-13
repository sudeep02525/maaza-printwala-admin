'use client';

import React, { useEffect, useState } from 'react';
import {
  Truck,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  Clock,
  IndianRupee,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'react-hot-toast';

export default function AdminDeliveryRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    pinCodePrefixes: '',
    deliveryMethod: 'STANDARD',
    charge: 0,
    freeDeliveryThreshold: '',
    estimatedDaysMin: 3,
    estimatedDaysMax: 7,
    isActive: true,
  });

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/delivery-rules');
      const list = res.data?.rules || res.rules || [];
      setRules(list);
    } catch (error) {
      toast.error('Failed to load delivery rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const openCreateModal = () => {
    setEditingRuleId(null);
    setFormData({
      name: '',
      pinCodePrefixes: '',
      deliveryMethod: 'STANDARD',
      charge: 0,
      freeDeliveryThreshold: '',
      estimatedDaysMin: 3,
      estimatedDaysMax: 7,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (rule) => {
    setEditingRuleId(rule._id);
    setFormData({
      name: rule.name || '',
      pinCodePrefixes: Array.isArray(rule.pinCodePrefixes) ? rule.pinCodePrefixes.join(', ') : '',
      deliveryMethod: rule.deliveryMethod || 'STANDARD',
      charge: rule.charge || 0,
      freeDeliveryThreshold: rule.freeDeliveryThreshold !== undefined ? rule.freeDeliveryThreshold : '',
      estimatedDaysMin: rule.estimatedDaysMin || 3,
      estimatedDaysMax: rule.estimatedDaysMax || 7,
      isActive: rule.isActive !== undefined ? rule.isActive : true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Rule name is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        pinCodePrefixes: formData.pinCodePrefixes
          ? formData.pinCodePrefixes.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        deliveryMethod: formData.deliveryMethod,
        charge: Number(formData.charge) || 0,
        freeDeliveryThreshold: formData.freeDeliveryThreshold ? Number(formData.freeDeliveryThreshold) : null,
        estimatedDaysMin: Number(formData.estimatedDaysMin) || 1,
        estimatedDaysMax: Number(formData.estimatedDaysMax) || 7,
        isActive: Boolean(formData.isActive),
      };

      if (editingRuleId) {
        await axiosInstance.put(`/admin/delivery-rules/${editingRuleId}`, payload);
        toast.success('Delivery rule updated');
      } else {
        await axiosInstance.post('/admin/delivery-rules', payload);
        toast.success('Delivery rule created');
      }

      setModalOpen(false);
      fetchRules();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this delivery rule?')) return;
    try {
      await axiosInstance.delete(`/admin/delivery-rules/${id}`);
      toast.success('Rule deleted successfully');
      setRules((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete rule');
    }
  };

  const toggleStatus = async (rule) => {
    try {
      const updatedStatus = !rule.isActive;
      await axiosInstance.put(`/admin/delivery-rules/${rule._id}`, { isActive: updatedStatus });
      setRules((prev) =>
        prev.map((r) => (r._id === rule._id ? { ...r, isActive: updatedStatus } : r))
      );
      toast.success(`Rule ${updatedStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const activeCount = rules.filter((r) => r.isActive).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-[var(--text-main)]" />
            <span>Delivery & Shipping Rules</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Configure shipping charges, pincode routing, free delivery thresholds and dispatch estimates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRules}
            disabled={loading}
            className="p-2 neu-btn rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="neu-btn-primary px-4 py-2 rounded text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Rule</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="neu-flat p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider">Total Rules</p>
            <p className="text-2xl font-black text-[var(--text-main)] mt-1">{rules.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg neu-inset flex items-center justify-center text-[var(--text-muted)]">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="neu-flat p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider">Active Rules</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg neu-inset flex items-center justify-center text-emerald-600">
            <Check className="w-5 h-5" />
          </div>
        </div>

        <div className="neu-flat p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider">Methods Covered</p>
            <p className="text-2xl font-black text-[var(--text-main)] mt-1">Standard &bull; Express</p>
          </div>
          <div className="w-10 h-10 rounded-lg neu-inset flex items-center justify-center text-sky-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="neu-flat rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text-main)]">Configured Rules</h2>
          <span className="text-xs text-[var(--text-faint)] font-medium">{rules.length} rule(s) found</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-[var(--text-faint)] text-sm">Loading delivery rules...</div>
        ) : rules.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-faint)] text-sm">
            No delivery rules found. Click "Add Delivery Rule" above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-subtle)]/50 text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px] border-b border-[var(--border)]">
                <tr>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Charge</th>
                  <th className="py-3 px-4">Free Threshold</th>
                  <th className="py-3 px-4">Pincode Prefixes</th>
                  <th className="py-3 px-4">Turnaround</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--text-main)]">
                {rules.map((rule) => (
                  <tr key={rule._id} className="hover:bg-[var(--bg-subtle)]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">
                      {rule.name}
                      {rule.isDemoData && (
                        <span className="ml-1.5 text-[9px] bg-[var(--hover)] text-[var(--text-muted)] px-1.5 py-0.5 rounded font-normal">
                          Sample
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rule.deliveryMethod === 'EXPRESS'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 border border-amber-200'
                          : rule.deliveryMethod === 'SAME_DAY'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 border border-purple-200'
                          : 'bg-sky-500/10 text-sky-400 border border-sky-500/20 border border-sky-200'
                      }`}>
                        {rule.deliveryMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">
                      {rule.charge === 0 ? (
                        <span className="text-emerald-600 font-extrabold">FREE</span>
                      ) : (
                        `₹${rule.charge}`
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">
                      {rule.freeDeliveryThreshold ? `Above ₹${rule.freeDeliveryThreshold}` : 'None'}
                    </td>
                    <td className="py-3.5 px-4">
                      {rule.pinCodePrefixes && rule.pinCodePrefixes.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {rule.pinCodePrefixes.slice(0, 4).map((p, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-[var(--hover)] rounded text-[10px] font-mono">
                              {p}*
                            </span>
                          ))}
                          {rule.pinCodePrefixes.length > 4 && (
                            <span className="text-[10px] text-[var(--text-faint)]">
                              +{rule.pinCodePrefixes.length - 4} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[var(--text-faint)] italic">All Pincodes</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">
                      {rule.estimatedDaysMin} - {rule.estimatedDaysMax} days
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatus(rule)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          rule.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-[var(--hover)] text-[var(--text-muted)] hover:bg-[var(--border)]'
                        }`}
                      >
                        {rule.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(rule)}
                          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] rounded transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rule._id)}
                          className="p-1.5 text-[var(--text-faint)] hover:text-rose-600 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className="neu-flat bg-[var(--bg-card)] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
              <h3 className="text-base font-bold text-[var(--text-main)]">
                {editingRuleId ? 'Edit Delivery Rule' : 'Create Delivery Rule'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[var(--text-faint)] hover:text-[var(--text-muted)] text-sm font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-main)] uppercase mb-1">
                  Rule Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-main)]"
                  placeholder="e.g. Standard Pan-India Surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-main)] uppercase mb-1">
                    Delivery Method
                  </label>
                  <select
                    value={formData.deliveryMethod}
                    onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-main)]"
                  >
                    <option value="STANDARD">STANDARD</option>
                    <option value="EXPRESS">EXPRESS</option>
                    <option value="SAME_DAY">SAME_DAY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-main)] uppercase mb-1">
                    Shipping Charge (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.charge}
                    onChange={(e) => setFormData({ ...formData, charge: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-main)]"
                    placeholder="0 for free"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--text-main)] uppercase mb-1">
                  Free Delivery Threshold (₹) (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.freeDeliveryThreshold}
                  onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-main)]"
                  placeholder="e.g. 999 (Orders above this amount get free shipping)"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--text-main)] uppercase mb-1">
                  Applicable Pincode Prefixes (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.pinCodePrefixes}
                  onChange={(e) => setFormData({ ...formData, pinCodePrefixes: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-main)] font-mono"
                  placeholder="e.g. 400, 401, 411 (Leave empty for all pincodes)"
                />
                <span className="text-[10px] text-[var(--text-faint)] mt-0.5 block">
                  Leave empty to apply to all nationwide deliveries
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-main)] uppercase mb-1">
                    Min Transit Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.estimatedDaysMin}
                    onChange={(e) => setFormData({ ...formData, estimatedDaysMin: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-main)] uppercase mb-1">
                    Max Transit Days
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.estimatedDaysMax}
                    onChange={(e) => setFormData({ ...formData, estimatedDaysMax: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#0082CA] rounded border-[var(--border-strong)]"
                  />
                  <span className="text-xs text-[var(--text-main)] font-semibold">Rule is active & enabled</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--hover)] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="neu-btn-primary px-5 py-2 text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingRuleId ? 'Update Rule' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
