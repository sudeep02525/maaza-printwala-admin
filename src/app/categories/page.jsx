'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';
import Link from 'next/link';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosInstance.get('/categories')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      alert('Category deleted successfully');
    },
    onError: () => alert('Failed to delete category')
  });

  const categories = Array.isArray(data) ? data : (data?.data?.categories || data?.categories || []);
  const filteredCategories = categories.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Categories & SEO</h1>
          <p className="text-sm text-slate-500 mt-1">Manage product categories, subcategories, and category-level SEO.</p>
        </div>
        <Link href="/categories/add" className="px-5 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-md">
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">SEO Content</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">Loading categories...</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">No categories found.</td>
                </tr>
              ) : (
                filteredCategories.map(cat => (
                  <tr key={cat._id || cat.slug} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span className="font-bold text-slate-700">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{cat.slug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cat.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {cat.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-bold uppercase ${cat.metaTitle ? 'text-emerald-500' : 'text-slate-400'}`}>
                          Meta Data: {cat.metaTitle ? 'Yes' : 'No'}
                        </span>
                        <span className={`text-[10px] font-bold uppercase ${cat.seoContent ? 'text-emerald-500' : 'text-slate-400'}`}>
                          SEO Content: {cat.seoContent ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/categories/edit/${cat._id || cat.slug}`} className="p-2 text-slate-400 hover:text-[#0082CA] hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(cat._id || cat.slug)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
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
    </div>
  );
}
