'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';
import { getImageUrl } from '@/utils/getImageUrl.js';

const EMPTY_SLIDE = { image: '', title: '', subtitle: '', ctaText: '', ctaLink: '' };
const EMPTY_BANNER = { image: '', badge: '', title: '', subtitle: '', ctaText: '', ctaLink: '' };
const EMPTY_COLUMN = { title: '', links: [{ label: '', href: '' }] };

const DEFAULT_FOOTER = {
  tagline: '',
  supportPhone: '',
  supportEmail: '',
  social: { facebook: '', instagram: '', twitter: '', linkedin: '' },
  columns: [],
};

const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm"
    />
  </div>
);

export default function CMSPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('hero');

  const [heroSlides, setHeroSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [footer, setFooter] = useState(DEFAULT_FOOTER);

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['cms-homepage'],
    queryFn: () => axiosInstance.get('/cms/homepage'),
  });

  useEffect(() => {
    const content = data?.data?.content || [];

    const heroContent = content.find((c) => c.key === 'homepage_hero');
    if (heroContent?.content?.slides?.length) {
      setHeroSlides(heroContent.content.slides);
    } else {
      setHeroSlides((prev) => (prev.length ? prev : [EMPTY_SLIDE]));
    }

    const bannersContent = content.find((c) => c.key === 'homepage_banners');
    if (bannersContent?.content?.banners?.length) {
      setBanners(bannersContent.content.banners);
    }

    const footerContent = content.find((c) => c.key === 'footer_links');
    if (footerContent?.content) {
      setFooter({ ...DEFAULT_FOOTER, ...footerContent.content });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload) => axiosInstance.put('/cms/homepage', payload),
    onSuccess: (_res, payload) => {
      queryClient.invalidateQueries({ queryKey: ['cms-homepage'] });
      alert(`${payload.title} saved successfully!`);
    },
    onError: () => alert('Failed to save CMS content'),
  });

  const saveHero = () =>
    saveMutation.mutate({
      key: 'homepage_hero',
      section: 'HERO',
      title: 'Hero Slider',
      content: { slides: heroSlides },
      isActive: true,
      sortOrder: 1,
    });

  const saveBanners = () =>
    saveMutation.mutate({
      key: 'homepage_banners',
      section: 'BANNERS',
      title: 'Promotional Banners',
      content: { banners },
      isActive: true,
      sortOrder: 2,
    });

  const saveFooter = () =>
    saveMutation.mutate({
      key: 'footer_links',
      section: 'FOOTER',
      title: 'Footer Links & Policies',
      content: footer,
      isActive: true,
      sortOrder: 3,
    });

  // ---------- hero helpers ----------
  const updateSlide = (index, field, value) => {
    const next = [...heroSlides];
    next[index] = { ...next[index], [field]: value };
    setHeroSlides(next);
  };
  const addSlide = () => setHeroSlides([...heroSlides, { ...EMPTY_SLIDE }]);
  const removeSlide = (index) => setHeroSlides(heroSlides.filter((_, i) => i !== index));

  // ---------- banner helpers ----------
  const updateBanner = (index, field, value) => {
    const next = [...banners];
    next[index] = { ...next[index], [field]: value };
    setBanners(next);
  };
  const addBanner = () => setBanners([...banners, { ...EMPTY_BANNER }]);
  const removeBanner = (index) => setBanners(banners.filter((_, i) => i !== index));

  // ---------- footer helpers ----------
  const setFooterField = (field, value) => setFooter({ ...footer, [field]: value });
  const setSocial = (network, value) =>
    setFooter({ ...footer, social: { ...(footer.social || {}), [network]: value } });

  const updateColumn = (ci, field, value) => {
    const next = [...footer.columns];
    next[ci] = { ...next[ci], [field]: value };
    setFooter({ ...footer, columns: next });
  };
  const addColumn = () => setFooter({ ...footer, columns: [...footer.columns, { ...EMPTY_COLUMN }] });
  const removeColumn = (ci) =>
    setFooter({ ...footer, columns: footer.columns.filter((_, i) => i !== ci) });

  const updateLink = (ci, li, field, value) => {
    const next = [...footer.columns];
    const links = [...next[ci].links];
    links[li] = { ...links[li], [field]: value };
    next[ci] = { ...next[ci], links };
    setFooter({ ...footer, columns: next });
  };
  const addLink = (ci) => {
    const next = [...footer.columns];
    next[ci] = { ...next[ci], links: [...next[ci].links, { label: '', href: '' }] };
    setFooter({ ...footer, columns: next });
  };
  const removeLink = (ci, li) => {
    const next = [...footer.columns];
    next[ci] = { ...next[ci], links: next[ci].links.filter((_, i) => i !== li) };
    setFooter({ ...footer, columns: next });
  };

  const SaveButton = ({ onClick, label }) => (
    <div className="pt-6 flex justify-end">
      <button
        onClick={onClick}
        disabled={saveMutation.isPending}
        className="px-6 py-2.5 neu-btn text-[var(--text-main)] font-bold text-sm rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : label}
      </button>
    </div>
  );

  const tabClass = (tab) =>
    `w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-between ${
      activeTab === tab
        ? 'neu-flat text-[#0082CA]'
        : 'text-[var(--text-muted)] hover:neu-flat/50 border-transparent'
    }`;

  const LivePill = () => (
    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
      Live
    </span>
  );

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Content Management (CMS)</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage the homepage hero slider, promotional banners and the site footer. Everything saved
          here is picked up by the storefront automatically.
        </p>
      </div>

      <div className="neu-flat rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 neu-flat p-4 space-y-2">
          <button onClick={() => setActiveTab('hero')} className={tabClass('hero')}>
            <span>Hero Slider</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('banners')} className={tabClass('banners')}>
            <span>Promotional Banners</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('footer')} className={tabClass('footer')}>
            <span>Footer Links & Policies</span>
            <LivePill />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {isFetching ? (
            <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
              Loading CMS Data...
            </div>
          ) : activeTab === 'hero' ? (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--text-main)]">Hero Slider</h2>
                <button
                  onClick={addSlide}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Slide
                </button>
              </div>

              <p className="text-xs text-[var(--text-muted)]">
                The first slide with both an image and a title replaces the default homepage banner.
              </p>

              <div className="space-y-4">
                {heroSlides.map((slide, index) => (
                  <div key={index} className="neu-flat rounded-xl p-4 flex gap-4 group">
                    <div className="cursor-move pt-2 text-[var(--text-faint)]">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-32 h-24 neu-flat rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative">
                          {slide.image ? (
                            <img src={getImageUrl(slide.image)} className="w-full h-full object-cover" alt="slide" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-[var(--text-faint)]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Field
                            label="Image URL"
                            value={slide.image}
                            onChange={(v) => updateSlide(index, 'image', v)}
                            placeholder="https://res.cloudinary.com/..."
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Title" value={slide.title} onChange={(v) => updateSlide(index, 'title', v)} />
                        <Field label="Subtitle" value={slide.subtitle} onChange={(v) => updateSlide(index, 'subtitle', v)} />
                        <Field label="CTA Text" value={slide.ctaText} onChange={(v) => updateSlide(index, 'ctaText', v)} />
                        <Field label="CTA Link" value={slide.ctaLink} onChange={(v) => updateSlide(index, 'ctaLink', v)} placeholder="/products" />
                      </div>
                    </div>
                    <button
                      onClick={() => removeSlide(index)}
                      className="p-2 h-fit text-[var(--text-faint)] hover:text-rose-600 neu-flat rounded-lg transition-colors mt-1 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <SaveButton onClick={saveHero} label="Save Hero Slider" />
            </div>
          ) : activeTab === 'banners' ? (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--text-main)]">Promotional Banners</h2>
                <button
                  onClick={addBanner}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Banner
                </button>
              </div>

              <p className="text-xs text-[var(--text-muted)]">
                These appear on the storefront homepage, directly under the hero, in the order shown
                here. Leave the list empty to hide the section completely.
              </p>

              {banners.length === 0 ? (
                <div className="neu-flat rounded-xl p-10 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-3 text-[var(--text-faint)]" />
                  <p className="text-sm font-bold text-[var(--text-main)]">No banners yet</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Add a banner to show a promotional card on the homepage.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {banners.map((banner, index) => (
                    <div key={index} className="neu-flat rounded-xl p-4 flex gap-4 group">
                      <div className="cursor-move pt-2 text-[var(--text-faint)]">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex gap-4">
                          <div className="w-32 h-20 neu-flat rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative">
                            {banner.image ? (
                              <img src={getImageUrl(banner.image)} className="w-full h-full object-cover" alt="banner" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-[var(--text-faint)]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Field
                              label="Background Image URL"
                              value={banner.image}
                              onChange={(v) => updateBanner(index, 'image', v)}
                              placeholder="https://res.cloudinary.com/..."
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Badge" value={banner.badge} onChange={(v) => updateBanner(index, 'badge', v)} placeholder="Limited Offer" />
                          <Field label="Title" value={banner.title} onChange={(v) => updateBanner(index, 'title', v)} placeholder="Flat 40% OFF on Bulk Orders" />
                          <Field label="Subtitle" value={banner.subtitle} onChange={(v) => updateBanner(index, 'subtitle', v)} />
                          <Field label="CTA Text" value={banner.ctaText} onChange={(v) => updateBanner(index, 'ctaText', v)} placeholder="Claim Offer" />
                          <Field label="CTA Link" value={banner.ctaLink} onChange={(v) => updateBanner(index, 'ctaLink', v)} placeholder="/products" />
                        </div>
                      </div>
                      <button
                        onClick={() => removeBanner(index)}
                        className="p-2 h-fit text-[var(--text-faint)] hover:text-rose-600 neu-flat rounded-lg transition-colors mt-1 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <SaveButton onClick={saveBanners} label="Save Banners" />
            </div>
          ) : (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Footer Links & Policies</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Anything left blank falls back to the built-in storefront text, so you can change
                  one line without rewriting the whole footer.
                </p>
              </div>

              {/* Brand + contact */}
              <div className="neu-flat rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-main)]">Brand & Support</h3>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">Tagline</label>
                  <textarea
                    value={footer.tagline || ''}
                    onChange={(e) => setFooterField('tagline', e.target.value)}
                    rows={3}
                    placeholder="Premium commercial printing for growing businesses."
                    className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Support Phone" value={footer.supportPhone} onChange={(v) => setFooterField('supportPhone', v)} placeholder="+91 7700054984" />
                  <Field label="Support Email" value={footer.supportEmail} onChange={(v) => setFooterField('supportEmail', v)} placeholder="support@mazaprintwala.com" />
                </div>
              </div>

              {/* Social */}
              <div className="neu-flat rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-main)]">Social Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Facebook" value={footer.social?.facebook} onChange={(v) => setSocial('facebook', v)} placeholder="https://facebook.com/..." />
                  <Field label="Instagram" value={footer.social?.instagram} onChange={(v) => setSocial('instagram', v)} placeholder="https://instagram.com/..." />
                  <Field label="X / Twitter" value={footer.social?.twitter} onChange={(v) => setSocial('twitter', v)} placeholder="https://x.com/..." />
                  <Field label="LinkedIn" value={footer.social?.linkedin} onChange={(v) => setSocial('linkedin', v)} placeholder="https://linkedin.com/company/..." />
                </div>
              </div>

              {/* Link columns */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[var(--text-main)]">Custom Link Columns</h3>
                  <button
                    onClick={addColumn}
                    className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Column
                  </button>
                </div>

                {footer.columns.length === 0 ? (
                  <div className="neu-flat rounded-xl p-8 text-center">
                    <p className="text-sm font-bold text-[var(--text-main)]">Using the default footer links</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Add a column here to replace the built-in Resources and Support link lists.
                    </p>
                  </div>
                ) : (
                  footer.columns.map((column, ci) => (
                    <div key={ci} className="neu-flat rounded-xl p-4 space-y-4">
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <Field
                            label={`Column ${ci + 1} Title`}
                            value={column.title}
                            onChange={(v) => updateColumn(ci, 'title', v)}
                            placeholder="Resources"
                          />
                        </div>
                        <button
                          onClick={() => removeColumn(ci)}
                          className="p-2 mb-0.5 text-[var(--text-faint)] hover:text-rose-600 neu-flat rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {column.links.map((link, li) => (
                          <div key={li} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={link.label || ''}
                              onChange={(e) => updateLink(ci, li, 'label', e.target.value)}
                              placeholder="Label"
                              className="flex-1 px-3 py-2 neu-flat rounded-lg outline-none text-sm"
                            />
                            <input
                              type="text"
                              value={link.href || ''}
                              onChange={(e) => updateLink(ci, li, 'href', e.target.value)}
                              placeholder="/support"
                              className="flex-1 px-3 py-2 neu-flat rounded-lg outline-none text-sm"
                            />
                            <button
                              onClick={() => removeLink(ci, li)}
                              className="p-2 text-[var(--text-faint)] hover:text-rose-600 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addLink(ci)}
                          className="text-xs font-bold text-[#0082CA] hover:underline flex items-center gap-1 pt-1"
                        >
                          <Plus className="w-3 h-3" /> Add link
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <SaveButton onClick={saveFooter} label="Save Footer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
