'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/services/axiosInstance';
import { toast } from 'react-hot-toast';

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    product: '',
    thumbnail: '',
    previewFront: '',
    previewBack: '',
    canvasJson: '',
    editableFields: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, tempRes] = await Promise.all([
          axiosInstance.get('/products?limit=100'),
          axiosInstance.get(`/templates/${params.id}`)
        ]);
        setProducts(prodRes.data?.data?.products || prodRes.data?.products || []);
        
        const template = tempRes.data?.data?.template || tempRes.data?.template;
        if (template) {
          setFormData({
            name: template.name || '',
            product: template.product?._id || template.product || '',
            thumbnail: template.thumbnail || '',
            previewFront: template.previewFront || '',
            previewBack: template.previewBack || '',
            canvasJson: template.canvasJson ? JSON.stringify(template.canvasJson, null, 2) : '',
            editableFields: template.editableFields ? JSON.stringify(template.editableFields, null, 2) : '',
            isActive: template.isActive ?? true
          });
        }
      } catch (error) {
        toast.error('Failed to load template data');
      } finally {
        setInitialLoad(false);
      }
    };
    if (params.id) loadData();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let parsedCanvas = undefined;
      let parsedFields = undefined;

      if (formData.canvasJson?.trim()) {
        try {
          parsedCanvas = JSON.parse(formData.canvasJson);
        } catch {
          toast.error('Invalid Canvas JSON syntax');
          setLoading(false);
          return;
        }
      }

      if (formData.editableFields?.trim()) {
        try {
          parsedFields = JSON.parse(formData.editableFields);
        } catch {
          toast.error('Invalid Editable Fields JSON syntax');
          setLoading(false);
          return;
        }
      }

      const payload = {
        ...formData,
        canvasJson: parsedCanvas,
        editableFields: parsedFields
      };

      await axiosInstance.put(`/templates/${params.id}`, payload);
      toast.success('Template updated successfully');
      router.push('/templates');
    } catch (error) {
      toast.error('Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--text-main)] mb-6">Edit Template</h1>
      <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--border)] shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Name</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Product</label>
          <select required value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full px-3 py-2 border rounded-md">
            <option value="">Select a product...</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Thumbnail URL</label>
          <input type="text" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Preview Front URL</label>
          <input type="text" value={formData.previewFront} onChange={e => setFormData({...formData, previewFront: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Preview Back URL</label>
          <input type="text" value={formData.previewBack} onChange={e => setFormData({...formData, previewBack: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Canvas JSON (Fabric v7 format)</label>
          <textarea
            rows={5}
            value={formData.canvasJson}
            onChange={e => setFormData({...formData, canvasJson: e.target.value})}
            placeholder='{"version": "7.4.0", "width": 600, "height": 350, "objects": [...]}'
            className="w-full px-3 py-2 border rounded-md font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-1">Editable Fields JSON</label>
          <textarea
            rows={4}
            value={formData.editableFields}
            onChange={e => setFormData({...formData, editableFields: e.target.value})}
            placeholder='[{"key": "company_name", "label": "Company Name", "type": "TEXT", "defaultValue": "Acme"}]'
            className="w-full px-3 py-2 border rounded-md font-mono text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4" />
          <label htmlFor="isActive" className="text-sm font-semibold text-[var(--text-main)]">Active</label>
        </div>
        <div className="pt-4 flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-[var(--border-strong)] rounded-md text-[var(--text-muted)] font-medium">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-[#0082CA] text-white rounded-md font-medium disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
