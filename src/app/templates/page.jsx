'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'react-hot-toast';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axiosInstance.get('/templates');
      setTemplates(res.data?.data?.templates || res.data?.templates || []);
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await axiosInstance.delete(`/templates/${id}`);
      toast.success('Template deleted');
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Templates</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage design templates for products.</p>
        </div>
        <Link href="/templates/add" className="bg-[#0082CA] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Template
        </Link>
      </div>

      <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)] overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-[var(--text-muted)]">
          <thead className="bg-[var(--bg-subtle)] text-[var(--text-muted)] text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4 border-b border-[var(--border)]">Name</th>
              <th className="px-6 py-4 border-b border-[var(--border)]">Product</th>
              <th className="px-6 py-4 border-b border-[var(--border)]">Status</th>
              <th className="px-6 py-4 border-b border-[var(--border)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr><td colSpan="4" className="text-center p-6 text-[var(--text-muted)]">Loading...</td></tr>
            ) : templates.length === 0 ? (
              <tr><td colSpan="4" className="text-center p-6 text-[var(--text-muted)]">No templates found</td></tr>
            ) : (
              templates.map(template => (
                <tr key={template._id} className="hover:bg-[var(--bg-subtle)]">
                  <td className="px-6 py-4 font-medium text-[var(--text-main)]">{template.name}</td>
                  <td className="px-6 py-4">{template.product?.name || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${template.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/templates/edit/${template._id}`} className="text-blue-500 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(template._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
