'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import axiosInstance from '../../../../services/axiosInstance.js';
import OptionsEditor from '../../../../components/OptionsEditor.jsx';
import PricingEditor from '../../../../components/PricingEditor.jsx';

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Core product fields
  const [form, setForm] = useState({ name:'', slug:'', category:'', basePrice:'', mrp:'', shortDescription:'', description:'', isActive:true, isFeatured:false, artworkRequirements: '' });
  const [categories, setCategories] = useState([]);
  // Options + pricing
  const [attributes, setAttributes] = useState([]);         
  const [quantityTiers, setQuantityTiers] = useState([100,250,500,1000]);
  const [pricing, setPricing] = useState({ basePrice:'', quantityBreaks:[], attributeModifiers:[] });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [full, cats] = await Promise.all([
          axiosInstance.get(`/products/${id}/full`),
          axiosInstance.get('/categories'),
        ]);
        if (full.success) {
          const { product, schema, pricingRule } = full.data;
          setForm({ 
            name: product.name||'', 
            slug: product.slug||'', 
            category: product.category?._id||product.category||'', 
            basePrice: product.basePrice||'', 
            mrp: product.mrp||'', 
            shortDescription: product.shortDescription||'', 
            description: product.description||'', 
            isActive: product.isActive, 
            isFeatured: product.isFeatured,
            artworkRequirements: product.artworkRequirements ? JSON.stringify(product.artworkRequirements, null, 2) : ''
          });
          setAttributes(schema?.attributes || []);
          setQuantityTiers(schema?.quantityTiers || [100,250,500,1000]);
          setPricing({ basePrice: pricingRule?.basePrice ?? product.basePrice ?? '', quantityBreaks: pricingRule?.quantityBreaks || [], attributeModifiers: pricingRule?.attributeModifiers || [] });
        }
        if (cats.success) setCategories(cats.data.categories || cats.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoaded(true);
      }
    })();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (imageFile) fd.append('images', imageFile);

      await axiosInstance.put(`/products/${id}`, fd, { headers: { 'Content-Type':'multipart/form-data' } });
      await axiosInstance.put(`/products/${id}/schema`, { attributes, quantityTiers });
      await axiosInstance.put(`/products/${id}/pricing`, pricing);
      router.push('/products');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating product');
    } finally {
      setIsLoading(false);
    }
  };

  if (!loaded) return <div className="text-slate-500 min-h-[50vh] flex items-center justify-center">Loading…</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-700">Edit Product</h2>
          <p className="text-sm text-slate-600 mt-0.5">Modify catalogue details, options, and pricing.</p>
        </div>
      </div>
      
      <form onSubmit={save} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-8">
        {/* Core Details */}
        <div>
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Core Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Name <span className="text-slate-500">*</span></label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Slug <span className="text-slate-500">*</span></label>
              <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-sm font-medium font-mono text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category <span className="text-slate-500">*</span></label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-sm font-medium">
                <option value="">Select a Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Base Price (₹) <span className="text-slate-500">*</span></label>
              <input type="number" value={form.basePrice} onChange={e => setForm({...form, basePrice: Number(e.target.value)})} required min="0" step="0.01" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-sm font-medium" />
            </div>
          </div>
        </div>

        {/* Descriptive Text */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Descriptive Text</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="4" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
            </div>
          </div>
        </div>

        {/* Media & Artwork */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Media & QC Requirements</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Image Thumbnail</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Artwork Requirements (JSON)</label>
              <textarea value={form.artworkRequirements} onChange={e => setForm({...form, artworkRequirements: e.target.value})} rows="6" className="w-full px-4 py-3 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-xs font-mono" />
            </div>
          </div>
        </div>

        {/* Options & Configuration */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Options & Configuration</h3>
          <OptionsEditor attributes={attributes} setAttributes={setAttributes} />
          
          <div className="mt-6">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity Tiers (comma separated)</label>
            <input type="text" value={quantityTiers.join(', ')} onChange={e => setQuantityTiers(e.target.value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n)))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" placeholder="100, 250, 500, 1000" />
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Pricing Rules</h3>
          <PricingEditor pricing={pricing} setPricing={setPricing} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors shadow-md disabled:opacity-70">
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
