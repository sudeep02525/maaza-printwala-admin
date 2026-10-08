'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import axiosInstance from '../../../../services/axiosInstance.js';

export default function AdminEditCategory() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    seoContent: ''
  });

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => axiosInstance.get(`/categories/${slug}`),
    enabled: !!slug
  });

  useEffect(() => {
    const category = data?.data?.category || data?.category;
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        isActive: category.isActive !== false,
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
        seoContent: category.seoContent || ''
      });
      setFaqs(category.faqs || []);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleRemoveFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const categoryId = data?.data?.category?._id || data?.category?._id;
      if (!categoryId) throw new Error("Category ID not found");
      await axiosInstance.put(`/categories/${categoryId}`, { ...formData, faqs });
      alert('Category updated successfully');
      router.push('/categories');
    } catch (error) {
      alert('Failed to update category');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="p-8 text-center text-slate-500">Loading category...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Edit Category</h1>
          <p className="text-sm text-slate-500 mt-0.5">Update category configuration and SEO details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Core Settings */}
        <div>
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Core Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Slug *</label>
              <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm transition-all"></textarea>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                <span className="text-sm font-bold text-slate-700">Active Category</span>
              </label>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">SEO & Content</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Meta Title</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Meta Description</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">SEO Content (Rich HTML)</label>
              <textarea name="seoContent" value={formData.seoContent} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm font-mono"></textarea>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Frequently Asked Questions</h3>
            <button type="button" onClick={handleAddFaq} className="text-xs font-bold text-[#0082CA] hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add FAQ
            </button>
          </div>
          
          <div className="space-y-4">
            {faqs.length === 0 && <p className="text-sm text-slate-500">No FAQs added.</p>}
            {faqs.map((faq, index) => (
              <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex-1 space-y-3">
                  <input type="text" placeholder="Question" value={faq.question} onChange={e => handleFaqChange(index, 'question', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none" required />
                  <textarea placeholder="Answer" value={faq.answer} onChange={e => handleFaqChange(index, 'answer', e.target.value)} rows="2" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none" required></textarea>
                </div>
                <button type="button" onClick={() => handleRemoveFaq(index)} className="p-2 text-slate-400 hover:text-rose-600 bg-white rounded-lg border border-slate-200 shadow-sm mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-md disabled:opacity-70">
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
