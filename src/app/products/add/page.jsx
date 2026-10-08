'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import axiosInstance from '../../../services/axiosInstance.js';
import OptionsEditor from '../../../components/OptionsEditor.jsx';
import PricingEditor from '../../../components/PricingEditor.jsx';

export default function AdminAddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    basePrice: '',
    shortDescription: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    artworkRequirements: JSON.stringify({
      allowedFormats: ['PDF', 'PNG', 'JPG'],
      minDpi: 300,
      requiresManualReview: true,
      safeZoneMm: 3,
      bleedMm: 3
    }, null, 2)
  });
  const [attributes, setAttributes] = useState([]);
  const [quantityTiers, setQuantityTiers] = useState([100, 250, 500, 1000]);
  const [pricing, setPricing] = useState({ basePrice: '', quantityBreaks: [], attributeModifiers: [] });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('/categories')
      .then(res => {
        if (res.success) {
          setCategories(res.data.categories || res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (imageFile) {
      data.append('images', imageFile);
    }
    
    data.append('attributes', JSON.stringify(attributes));
    data.append('quantityTiers', JSON.stringify(quantityTiers));
    data.append('pricingRule', JSON.stringify(pricing));

    try {
      // In the admin app, axiosInstance automatically handles tokens via interceptors
      const response = await axiosInstance.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.success) {
        alert('Product created successfully!');
        router.push('/products');
      } else {
        alert(response.message || 'Failed to create product');
      }
    } catch (err) {
      alert('Error creating product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 neu-flat rounded-xl  /80  text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-700">Add New Product</h2>
          <p className="text-sm text-slate-600 mt-0.5">Create a new item for your storefront catalogue.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="neu-flat p-8 rounded-2xl  /80  space-y-8">
        
        {/* Core Details */}
        <div>
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Core Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Name <span className="text-slate-500">*</span></label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-sm font-medium neu-input"
                placeholder="e.g. Premium Business Cards"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Slug <span className="text-slate-500">*</span></label>
              <input 
                type="text" name="slug" value={formData.slug} onChange={handleChange} required
                className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-sm font-medium font-mono text-slate-600 neu-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category <span className="text-slate-500">*</span></label>
              <select 
                name="category" value={formData.category} onChange={handleChange} required
                className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-sm font-medium"
              >
                <option value="">Select a Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Base Price (₹) <span className="text-slate-500">*</span></label>
              <input 
                type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required min="0" step="0.01"
                className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-sm font-medium neu-input"
              />
            </div>
          </div>
        </div>

        {/* Descriptive Text */}
        <div className="pt-6  ">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Descriptive Text</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Description</label>
              <input 
                type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange}
                className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium neu-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} rows="4"
                className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium neu-input"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Media & Artwork */}
        <div className="pt-6  ">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Media & QC Requirements</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Product Image Thumbnail</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl neu-flat   flex items-center justify-center text-slate-400 shrink-0">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <input 
                  type="file" accept="image/*" onChange={handleImageChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:neu-flat file:text-slate-700 hover:file:neu-flat transition-colors neu-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Artwork Requirements (JSON)</label>
              <textarea 
                name="artworkRequirements" value={formData.artworkRequirements} onChange={handleChange} rows="6"
                className="w-full px-4 py-3 neu-flat text-slate-600   rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all text-xs font-mono neu-input"
              ></textarea>
              <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Used by the Pre-Press engine to validate customer uploads.</p>
            </div>
          </div>
        </div>

        {/* Options & Configuration */}
        <div className="pt-6  ">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Options & Configuration</h3>
          <OptionsEditor attributes={attributes} setAttributes={setAttributes} />
          
          <div className="mt-6">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity Tiers (comma separated)</label>
            <input 
              type="text" 
              value={quantityTiers.join(', ')} 
              onChange={e => setQuantityTiers(e.target.value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n)))}
              className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm"
              placeholder="100, 250, 500, 1000"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-6  ">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Pricing Rules</h3>
          <PricingEditor pricing={pricing} setPricing={setPricing} />
        </div>

        {/* SEO (Search Engine Optimization) */}
        <div className="pt-6  ">
          <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">SEO</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Meta Title</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm neu-input" placeholder="Title for search engines" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Meta Description</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm neu-input" placeholder="Description for search engines" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Keywords</label>
              <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} className="w-full px-4 py-2.5 neu-flat   rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm neu-input" placeholder="Comma separated, e.g. business cards, cheap printing" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6  ">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5   rounded-xl text-slate-600 font-bold text-sm hover:neu-flat transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 neu-flat text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors  disabled:opacity-70 neu-btn">
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
