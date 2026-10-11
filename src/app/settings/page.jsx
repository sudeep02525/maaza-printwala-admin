'use client';

import React, { useState } from 'react';
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
  Phone
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
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

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Store settings saved successfully!');
    }, 600);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">System & Store Settings</h1>
            <p className="text-sm text-slate-500">Configure business policies, taxation, fulfillment fees, and payment integrations.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0082CA] hover:bg-[#006ca8] text-white rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-5 h-5 text-[#0082CA]" />
            <h2 className="text-base font-bold text-slate-800">Brand & Support Contacts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Customer Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Support Toll-Free Phone</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Taxation & Pricing Rules */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Percent className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-800">Taxes & Shipping Rules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Standard GST Rate (%)</label>
              <input
                type="number"
                value={settings.gstRate}
                onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Applied uniformly on checkout cart total.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Free Shipping Min. (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Orders above this qualify for free delivery.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Standard Flat Courier Fee (₹)</label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Charged on sub-threshold orders.</p>
            </div>
          </div>
        </div>

        {/* Production & QC Standards */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-800">Production & Quality Control</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Minimum Artwork Resolution (DPI)</label>
              <input
                type="number"
                value={settings.defaultDpiCheck}
                onChange={(e) => setSettings({ ...settings, defaultDpiCheck: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Uploaded images below this trigger low-resolution warning in Studio.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Central Print Hub</label>
              <input
                type="text"
                value={settings.dispatchCity}
                onChange={(e) => setSettings({ ...settings, dispatchCity: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Origin hub used for ETA tracking calculation.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
