'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Store, 
  Percent, 
  Truck, 
  CreditCard, 
  Save, 
  CheckCircle2,
  Building,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'Maza Printwala',
    tagline: 'Enterprise Commercial Printing & Merchandising',
    supportEmail: 'support@maazaprintwala.in',
    supportPhone: '1800-PRINT-NOW',
    dispatchCity: 'Mumbai, Maharashtra',
    gstRate: 18,
    freeShippingThreshold: 999,
    standardShippingFee: 99,
    minOrderValue: 199,
    razorpayKeyId: 'rzp_test_sample_key',
    razorpayWebhookActive: true,
    autoApproveProof: false,
    defaultDpiCheck: 300
  });

  useEffect(() => {
    axiosInstance.get('/admin/settings')
      .then(res => {
        const s = res?.data?.settings || res?.settings;
        if (s) {
          setSettings(prev => ({ ...prev, ...s }));
        }
      })
      .catch(() => {
        toast.error('Could not load current settings');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put('/admin/settings', settings);
      toast.success('Store settings saved successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--hover)] flex items-center justify-center text-[var(--text-main)]">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">System & Store Settings</h1>
            <p className="text-sm text-[var(--text-muted)]">Configure business policies, taxation, fulfillment fees, and payment integrations.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0082CA] hover:bg-[#006ca8] text-white rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <Store className="w-5 h-5 text-[#0082CA]" />
            <h2 className="text-base font-bold text-[var(--text-main)]">Brand & Support Contacts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-main)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-main)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Customer Support Email</label>
              <input
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-main)] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Support Toll-Free Phone</label>
              <input
                type="text"
                value={settings.supportPhone || ''}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-main)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Taxation & Pricing Rules */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <Percent className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-[var(--text-main)]">Taxes & Shipping Rules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Standard GST Rate (%)</label>
              <input
                type="number"
                value={settings.gstRate ?? 18}
                onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--text-main)] outline-none"
              />
              <p className="text-[11px] text-[var(--text-faint)] mt-1">Applied uniformly on checkout cart total.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Free Shipping Min. (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold ?? 999}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--text-main)] outline-none"
              />
              <p className="text-[11px] text-[var(--text-faint)] mt-1">Orders above this qualify for free delivery.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Standard Courier Fee (₹)</label>
              <input
                type="number"
                value={settings.standardShippingFee ?? 99}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--text-main)] outline-none"
              />
              <p className="text-[11px] text-[var(--text-faint)] mt-1">Charged on sub-threshold orders.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={settings.minOrderValue ?? 199}
                onChange={(e) => setSettings({ ...settings, minOrderValue: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--text-main)] outline-none"
              />
              <p className="text-[11px] text-[var(--text-faint)] mt-1">Minimum cart subtotal to checkout.</p>
            </div>
          </div>
        </div>

        {/* Production & QC Standards */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-[var(--text-main)]">Production & Quality Control</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Minimum Artwork Resolution (DPI)</label>
              <input
                type="number"
                value={settings.defaultDpiCheck ?? 300}
                onChange={(e) => setSettings({ ...settings, defaultDpiCheck: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm font-bold text-[var(--text-main)] outline-none"
              />
              <p className="text-[11px] text-[var(--text-faint)] mt-1">Uploaded images below this trigger low-resolution warning in Studio.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Central Print Hub</label>
              <input
                type="text"
                value={settings.dispatchCity || ''}
                onChange={(e) => setSettings({ ...settings, dispatchCity: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-main)] outline-none"
              />
              <p className="text-[11px] text-[var(--text-faint)] mt-1">Origin hub used for ETA tracking calculation.</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-[var(--text-main)] block">Auto-Approve Print Proofs</span>
              <span className="text-xs text-[var(--text-muted)]">Automatically approve customer uploaded artworks without requiring manual staff review.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!settings.autoApproveProof} 
                onChange={(e) => setSettings({ ...settings, autoApproveProof: e.target.checked })}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0082CA]"></div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
