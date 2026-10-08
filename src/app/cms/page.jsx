'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';

export default function CMSPage() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  
  // Local state for form edits
  const [heroSlides, setHeroSlides] = useState([]);
  const [banners, setBanners] = useState([]);

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['cms-homepage'],
    queryFn: () => axiosInstance.get('/cms/homepage')
  });

  useEffect(() => {
    const content = data?.data?.content || [];
    
    // Parse Hero
    const heroContent = content.find(c => c.key === 'homepage_hero');
    if (heroContent?.content?.slides) {
      setHeroSlides(heroContent.content.slides);
    } else if (heroSlides.length === 0) {
      setHeroSlides([{ image: '', title: '', subtitle: '', ctaText: '', ctaLink: '' }]);
    }
    
    // Parse Banners (assuming we use this structure later)
    const bannersContent = content.find(c => c.key === 'homepage_banners');
    if (bannersContent?.content?.banners) {
      setBanners(bannersContent.content.banners);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload) => axiosInstance.put('/cms/homepage', payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['cms-homepage']);
      alert('CMS content saved successfully!');
    },
    onError: () => alert('Failed to save CMS content')
  });

  const handleSaveHero = () => {
    saveMutation.mutate({
      key: 'homepage_hero',
      section: 'HERO',
      title: 'Homepage Hero Slider',
      content: { slides: heroSlides },
      isActive: true,
      sortOrder: 1
    });
  };

  const updateSlide = (index, field, value) => {
    const newSlides = [...heroSlides];
    newSlides[index][field] = value;
    setHeroSlides(newSlides);
  };

  const addSlide = () => {
    setHeroSlides([...heroSlides, { image: '', title: '', subtitle: '', ctaText: '', ctaLink: '' }]);
  };

  const removeSlide = (index) => {
    setHeroSlides(heroSlides.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Content Management (CMS)</h1>
        <p className="text-sm text-slate-500 mt-1">Manage homepage sliders, banners, and dynamic content.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('hero')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'hero' ? 'bg-white shadow-sm border border-slate-200 text-[#0082CA]' : 'text-slate-600 hover:bg-slate-200/50 border border-transparent'}`}
          >
            Hero Slider
          </button>
          <button 
            onClick={() => setActiveTab('banners')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'banners' ? 'bg-white shadow-sm border border-slate-200 text-[#0082CA]' : 'text-slate-600 hover:bg-slate-200/50 border border-transparent'}`}
          >
            Promotional Banners
          </button>
          <button 
            onClick={() => setActiveTab('footer')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'footer' ? 'bg-white shadow-sm border border-slate-200 text-[#0082CA]' : 'text-slate-600 hover:bg-slate-200/50 border border-transparent'}`}
          >
            Footer Links & Policies
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {isFetching ? (
            <div className="flex items-center justify-center h-full text-slate-500">Loading CMS Data...</div>
          ) : activeTab === 'hero' ? (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Hero Slider</h2>
                <button onClick={addSlide} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5" /> Add Slide
                </button>
              </div>

              <div className="space-y-4">
                {heroSlides.map((slide, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 group">
                    <div className="cursor-move pt-2 text-slate-300 hover:text-slate-500">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-32 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                          {slide.image ? (
                            <img src={slide.image} className="w-full h-full object-cover" alt="slide" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Image URL</label>
                          <input type="text" value={slide.image} onChange={e => updateSlide(index, 'image', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" placeholder="https://..." />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Title</label>
                          <input type="text" value={slide.title} onChange={e => updateSlide(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Subtitle</label>
                          <input type="text" value={slide.subtitle} onChange={e => updateSlide(index, 'subtitle', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">CTA Text</label>
                          <input type="text" value={slide.ctaText} onChange={e => updateSlide(index, 'ctaText', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">CTA Link</label>
                          <input type="text" value={slide.ctaLink} onChange={e => updateSlide(index, 'ctaLink', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-sm" />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeSlide(index)} className="p-2 h-fit text-slate-400 hover:text-rose-600 bg-white rounded-lg transition-colors mt-1 opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button onClick={handleSaveHero} disabled={saveMutation.isPending} className="px-6 py-2.5 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center gap-2 disabled:opacity-70">
                  <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Hero Slider'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full flex-col">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 mb-4">
                <ImageIcon className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Module Coming Soon</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">This CMS section is under development. It will be available in the next sprint.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
