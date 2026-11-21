'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  HelpCircle,
  ShieldCheck,
  Megaphone,
  PhoneCall,
  FileText,
  Truck,
  Sparkles,
  Headphones,
  CheckCircle,
  Clock,
  Star,
  Zap,
  CreditCard,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
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

const DEFAULT_OFFER_STRIP = {
  isActive: false,
  badge: 'SPECIAL OFFER',
  text: 'Flat 40% OFF on all Bulk & Corporate Orders | Free Pan-India Delivery',
  linkLabel: 'Order Now',
  linkTarget: '/products',
  bgStyle: 'blue',
};

const DEFAULT_TRUST_ITEMS = [
  {
    icon: 'ShieldCheck',
    title: 'Precision Colors',
    description: 'CMYK calibrated offset & digital machines',
    isActive: true,
  },
  {
    icon: 'Truck',
    title: 'Tracked Transit',
    description: 'Insured courier with real-time tracking across 25k+ pin codes',
    isActive: true,
  },
  {
    icon: 'Sparkles',
    title: '100% Compliant',
    description: 'B2B GST invoices & transparent volume pricing',
    isActive: true,
  },
  {
    icon: 'Headphones',
    title: 'Expert Help',
    description: 'Pre-flight file check before sending to print',
    isActive: true,
  },
];

const DEFAULT_FAQS = [
  {
    question: 'What services does Maza Printwala offer?',
    answer: 'We offer a wide range of services including business printing, custom apparel, packaging, corporate gifts, and personalized items.',
    isActive: true,
  },
  {
    question: 'Can I order custom printed products online?',
    answer: 'Yes, you can browse, customize, and order all our products directly through our website with easy online payment options.',
    isActive: true,
  },
  {
    question: 'Does Maza Printwala provide same-day delivery?',
    answer: 'Same-day delivery is available for select products and pin codes. Standard delivery takes 3-4 working days.',
    isActive: true,
  },
  {
    question: 'What are the most popular products on Maza Printwala?',
    answer: 'Our most popular products include Visiting Cards, Custom T-shirts, Corporate Gift Sets, and Custom Packaging.',
    isActive: true,
  },
  {
    question: 'Can I order small quantities or single-piece prints?',
    answer: 'Yes, we cater to both bulk orders and single-piece custom printing without any strict minimum order quantities.',
    isActive: true,
  },
  {
    question: 'Does Maza Printwala offer printing solutions for businesses?',
    answer: 'Absolutely! We offer dedicated B2B portal access, volume discounts, and GST invoicing for corporate clients.',
    isActive: true,
  },
  {
    question: 'How can I design my product on Maza Printwala?',
    answer: 'You can upload your own artwork, customize ready-made templates, or hire one of our professional designers.',
    isActive: true,
  },
  {
    question: 'Does Maza Printwala deliver across India?',
    answer: 'Yes, we provide fast and secure pan-India shipping covering over 25,000+ pin codes.',
    isActive: true,
  },
  {
    question: 'What types of document printing services are available?',
    answer: 'We offer colour and B&W printing, spiral binding, hardcover thesis binding, lamination, and project report printing.',
    isActive: true,
  },
  {
    question: 'How can I track my print order?',
    answer: 'Once your order is dispatched, you will receive a tracking link via SMS/WhatsApp, or track it directly from your Account.',
    isActive: true,
  },
];

const DEFAULT_CONTACT = {
  supportPhone: '+91 7700054984',
  whatsappNumber: '+91 7700054984',
  supportEmail: 'imagemazaprintwala@gmail.com',
  addressLine1: 'Shop No. 4, Commercial Print Hub',
  addressLine2: 'Market Yard Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM',
  gstin: '27AAAAA0000A1Z5',
};

const DEFAULT_POLICIES = {
  privacy: {
    title: 'Privacy & Cookie Policy',
    lastUpdated: 'November 2026',
    body: 'Maza Printwala respects your privacy. We collect only information essential to process your printing orders, ensure timely delivery, and provide customer assistance. We never sell your personal information or shared artwork files.',
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'November 2026',
    body: 'By placing an order on Maza Printwala, you agree that your submitted design files do not infringe upon any third-party copyrights or trademarks. All printed goods undergo strict quality inspection before dispatch.',
  },
  shipping: {
    title: 'Shipping & Delivery Policy',
    lastUpdated: 'November 2026',
    body: 'We deliver pan-India covering over 25,000+ pin codes via premium logistics partners. Standard delivery turnaround is 3 to 5 business days after artwork approval. Express delivery options are available for select metro locations.',
  },
  returns: {
    title: 'Return & Cancellation Policy',
    lastUpdated: 'November 2026',
    body: 'Because custom-printed goods are customized specifically to your specifications, orders cannot be cancelled once print production begins. If you receive merchandise with physical defects, printing errors, or transit damage, contact support within 48 hours for immediate replacement.',
  },
};

const Field = ({ label, value, onChange, placeholder, type = 'text', help }) => (
  <div>
    <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
    />
    {help && <p className="text-[11px] text-[var(--text-muted)] mt-1">{help}</p>}
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 4, help }) => (
  <div>
    <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">{label}</label>
    <textarea
      rows={rows}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
    />
    {help && <p className="text-[11px] text-[var(--text-muted)] mt-1">{help}</p>}
  </div>
);

const ICON_OPTIONS = [
  'ShieldCheck',
  'Truck',
  'Sparkles',
  'Headphones',
  'Clock',
  'Star',
  'Zap',
  'CreditCard',
  'CheckCircle',
];

export default function CMSPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('hero');

  // CMS States
  const [heroSlides, setHeroSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [offerStrip, setOfferStrip] = useState(DEFAULT_OFFER_STRIP);
  const [trustItems, setTrustItems] = useState(DEFAULT_TRUST_ITEMS);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);
  const [footer, setFooter] = useState(DEFAULT_FOOTER);
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [activePolicyKey, setActivePolicyKey] = useState('privacy');

  const { data, isLoading: isFetching } = useQuery({
    queryKey: ['cms-homepage'],
    queryFn: () => axiosInstance.get('/cms/homepage'),
  });

  useEffect(() => {
    const content = data?.data?.content || [];

    // 1. Hero
    const heroContent = content.find((c) => c.key === 'homepage_hero');
    if (heroContent?.content?.slides?.length) {
      setHeroSlides(heroContent.content.slides);
    } else {
      setHeroSlides((prev) => (prev.length ? prev : [EMPTY_SLIDE]));
    }

    // 2. Promotional Banners
    const bannersContent = content.find((c) => c.key === 'homepage_banners');
    if (bannersContent?.content?.banners?.length) {
      setBanners(bannersContent.content.banners);
    }

    // 3. Offer Strip
    const offerContent = content.find((c) => c.key === 'offer_strip');
    if (offerContent?.content) {
      setOfferStrip({ ...DEFAULT_OFFER_STRIP, ...offerContent.content, isActive: offerContent.isActive ?? offerContent.content.isActive });
    }

    // 4. Trust Strip
    const trustContent = content.find((c) => c.key === 'homepage_trust');
    if (trustContent?.content?.items?.length) {
      setTrustItems(trustContent.content.items);
    }

    // 5. FAQ
    const faqContent = content.find((c) => c.key === 'homepage_faq');
    if (faqContent?.content?.items?.length) {
      setFaqs(faqContent.content.items);
    }

    // 6. Contact Info
    const contactContent = content.find((c) => c.key === 'contact_info');
    if (contactContent?.content) {
      setContactInfo({ ...DEFAULT_CONTACT, ...contactContent.content });
    }

    // 7. Footer Links
    const footerContent = content.find((c) => c.key === 'footer_links');
    if (footerContent?.content) {
      setFooter({ ...DEFAULT_FOOTER, ...footerContent.content });
    }

    // 8. Policies
    const privacyContent = content.find((c) => c.key === 'policy_privacy');
    const termsContent = content.find((c) => c.key === 'policy_terms');
    const shippingContent = content.find((c) => c.key === 'policy_shipping');
    const returnsContent = content.find((c) => c.key === 'policy_returns');

    setPolicies((prev) => ({
      privacy: privacyContent?.content ? { ...prev.privacy, ...privacyContent.content } : prev.privacy,
      terms: termsContent?.content ? { ...prev.terms, ...termsContent.content } : prev.terms,
      shipping: shippingContent?.content ? { ...prev.shipping, ...shippingContent.content } : prev.shipping,
      returns: returnsContent?.content ? { ...prev.returns, ...returnsContent.content } : prev.returns,
    }));
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload) => axiosInstance.put('/cms/homepage', payload),
    onSuccess: (_res, payload) => {
      queryClient.invalidateQueries({ queryKey: ['cms-homepage'] });
      alert(`${payload.title || 'CMS Content'} saved successfully!`);
    },
    onError: () => alert('Failed to save CMS content'),
  });

  // ---------- Save Handlers ----------
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

  const saveOfferStrip = () =>
    saveMutation.mutate({
      key: 'offer_strip',
      section: 'BANNERS',
      title: 'Announcement / Offer Strip',
      content: offerStrip,
      isActive: Boolean(offerStrip.isActive),
      sortOrder: 0,
    });

  const saveTrustStrip = () =>
    saveMutation.mutate({
      key: 'homepage_trust',
      section: 'HERO',
      title: 'Homepage Trust Strip',
      content: { items: trustItems },
      isActive: true,
      sortOrder: 3,
    });

  const saveFaqs = () =>
    saveMutation.mutate({
      key: 'homepage_faq',
      section: 'FAQ',
      title: 'Frequently Asked Questions',
      content: { items: faqs },
      isActive: true,
      sortOrder: 4,
    });

  const saveContactInfo = () =>
    saveMutation.mutate({
      key: 'contact_info',
      section: 'CONTACT_INFO',
      title: 'Store Contact Information',
      content: contactInfo,
      isActive: true,
      sortOrder: 5,
    });

  const saveFooter = () =>
    saveMutation.mutate({
      key: 'footer_links',
      section: 'FOOTER',
      title: 'Footer Links & Policies',
      content: footer,
      isActive: true,
      sortOrder: 6,
    });

  const savePolicy = (policyKey) => {
    const keyMap = {
      privacy: { key: 'policy_privacy', title: 'Privacy & Cookie Policy' },
      terms: { key: 'policy_terms', title: 'Terms of Service' },
      shipping: { key: 'policy_shipping', title: 'Shipping & Delivery Policy' },
      returns: { key: 'policy_returns', title: 'Return & Cancellation Policy' },
    };
    const meta = keyMap[policyKey];
    saveMutation.mutate({
      key: meta.key,
      section: 'POLICY',
      title: meta.title,
      content: policies[policyKey],
      isActive: true,
      sortOrder: 7,
    });
  };

  // ---------- Helpers ----------
  const updateSlide = (index, field, value) => {
    const next = [...heroSlides];
    next[index] = { ...next[index], [field]: value };
    setHeroSlides(next);
  };
  const addSlide = () => setHeroSlides([...heroSlides, { ...EMPTY_SLIDE }]);
  const removeSlide = (index) => setHeroSlides(heroSlides.filter((_, i) => i !== index));

  const updateBanner = (index, field, value) => {
    const next = [...banners];
    next[index] = { ...next[index], [field]: value };
    setBanners(next);
  };
  const addBanner = () => setBanners([...banners, { ...EMPTY_BANNER }]);
  const removeBanner = (index) => setBanners(banners.filter((_, i) => i !== index));

  // FAQ helpers
  const updateFaq = (index, field, value) => {
    const next = [...faqs];
    next[index] = { ...next[index], [field]: value };
    setFaqs(next);
  };
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '', isActive: true }]);
  const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));
  const moveFaq = (index, dir) => {
    if ((dir === -1 && index === 0) || (dir === 1 && index === faqs.length - 1)) return;
    const next = [...faqs];
    const target = index + dir;
    [next[index], next[target]] = [next[target], next[index]];
    setFaqs(next);
  };

  // Trust helpers
  const updateTrustItem = (index, field, value) => {
    const next = [...trustItems];
    next[index] = { ...next[index], [field]: value };
    setTrustItems(next);
  };
  const addTrustItem = () =>
    setTrustItems([...trustItems, { icon: 'CheckCircle', title: '', description: '', isActive: true }]);
  const removeTrustItem = (index) => setTrustItems(trustItems.filter((_, i) => i !== index));

  // Footer helpers
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
        className="px-6 py-2.5 neu-btn text-[var(--text-main)] font-bold text-sm rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 cursor-pointer shadow-sm"
      >
        <Save className="w-4 h-4 text-[#0082CA]" /> {saveMutation.isPending ? 'Saving...' : label}
      </button>
    </div>
  );

  const tabClass = (tab) =>
    `w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-between cursor-pointer ${
      activeTab === tab
        ? 'neu-flat text-[#0082CA] font-extrabold'
        : 'text-[var(--text-muted)] hover:neu-flat/50 border-transparent'
    }`;

  const LivePill = () => (
    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
      Live
    </span>
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Content Management (CMS)</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Control live storefront text, promotional marketing cards, trust badges, FAQs, and policies without code deploys.
        </p>
      </div>

      <div className="neu-flat rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 neu-flat p-4 space-y-1.5 shrink-0 border-r border-[var(--border)]">
          <button onClick={() => setActiveTab('hero')} className={tabClass('hero')}>
            <span>Hero Slider</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('banners')} className={tabClass('banners')}>
            <span>Promotional Banners</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('offer')} className={tabClass('offer')}>
            <span>Announcement Strip</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('trust')} className={tabClass('trust')}>
            <span>Trust Strip</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('faq')} className={tabClass('faq')}>
            <span>FAQ Manager</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('contact')} className={tabClass('contact')}>
            <span>Contact Details</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('footer')} className={tabClass('footer')}>
            <span>Footer Links</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('policies')} className={tabClass('policies')}>
            <span>Policies & Legal</span>
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
            /* TAB 1: HERO SLIDER */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Hero Slider</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    The first slide with both an image and a title replaces the default homepage banner.
                  </p>
                </div>
                <button
                  onClick={addSlide}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Slide
                </button>
              </div>

              <div className="space-y-4">
                {heroSlides.map((slide, index) => (
                  <div key={index} className="neu-flat rounded-xl p-4 flex gap-4 group">
                    <div className="cursor-move pt-2 text-[var(--text-faint)]">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-32 h-24 neu-flat rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative bg-[var(--bg-subtle)]">
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
                            help="Cloudinary direct image URL"
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
                      className="p-2 h-fit text-[var(--text-faint)] hover:text-rose-600 neu-flat rounded-lg transition-colors mt-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <SaveButton onClick={saveHero} label="Save Hero Slider" />
            </div>
          ) : activeTab === 'banners' ? (
            /* TAB 2: PROMOTIONAL BANNERS */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Promotional Banners</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Rendered directly under the hero on the storefront homepage. Leave list empty to hide section.
                  </p>
                </div>
                <button
                  onClick={addBanner}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Banner
                </button>
              </div>

              {banners.length === 0 ? (
                <div className="neu-flat rounded-xl p-10 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-3 text-[var(--text-faint)]" />
                  <p className="text-sm font-bold text-[var(--text-main)]">No banners yet</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Add a banner to show promotional cards under the hero banner.
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
                          <div className="w-32 h-20 neu-flat rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative bg-[var(--bg-subtle)]">
                            {banner.image ? (
                              <img src={getImageUrl(banner.image)} className="w-full h-full object-cover" alt="banner" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-[var(--text-faint)]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <Field
                              label="Image URL"
                              value={banner.image}
                              onChange={(v) => updateBanner(index, 'image', v)}
                              placeholder="https://res.cloudinary.com/..."
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Badge (pill above title)" value={banner.badge} onChange={(v) => updateBanner(index, 'badge', v)} placeholder="e.g. Limited Offer" />
                          <Field label="Title" value={banner.title} onChange={(v) => updateBanner(index, 'title', v)} placeholder="e.g. Flat 40% OFF" />
                          <Field label="Subtitle" value={banner.subtitle} onChange={(v) => updateBanner(index, 'subtitle', v)} placeholder="e.g. Valid on bulk corporate orders" />
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="CTA Text" value={banner.ctaText} onChange={(v) => updateBanner(index, 'ctaText', v)} placeholder="Claim Offer" />
                            <Field label="CTA Link" value={banner.ctaLink} onChange={(v) => updateBanner(index, 'ctaLink', v)} placeholder="/products" />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBanner(index)}
                        className="p-2 h-fit text-[var(--text-faint)] hover:text-rose-600 neu-flat rounded-lg transition-colors mt-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <SaveButton onClick={saveBanners} label="Save Promotional Banners" />
            </div>
          ) : activeTab === 'offer' ? (
            /* TAB 3: OFFER STRIP / ANNOUNCEMENT BAR */
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Announcement / Offer Strip</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Displays a top notification bar across the storefront header. Perfect for flash sales and festival notices.
                </p>
              </div>

              <div className="neu-flat rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                  <div>
                    <span className="text-sm font-bold text-[var(--text-main)]">Enable Announcement Bar</span>
                    <p className="text-xs text-[var(--text-muted)]">Turn on to display on the storefront header</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(offerStrip.isActive)}
                      onChange={(e) => setOfferStrip({ ...offerStrip, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0082CA]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Badge Text"
                    value={offerStrip.badge}
                    onChange={(v) => setOfferStrip({ ...offerStrip, badge: v })}
                    placeholder="e.g. FESTIVAL OFFER"
                  />
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">Color Theme</label>
                    <select
                      value={offerStrip.bgStyle || 'blue'}
                      onChange={(e) => setOfferStrip({ ...offerStrip, bgStyle: e.target.value })}
                      className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
                    >
                      <option value="blue">Electric Blue (Brand Default)</option>
                      <option value="dark">Sleek Charcoal Dark</option>
                      <option value="amber">Warm Amber / Gold</option>
                      <option value="gradient">Festive Gradient</option>
                    </select>
                  </div>
                </div>

                <Field
                  label="Announcement Message"
                  value={offerStrip.text}
                  onChange={(v) => setOfferStrip({ ...offerStrip, text: v })}
                  placeholder="e.g. Flat 40% OFF on all Bulk & Corporate Orders | Free Pan-India Delivery"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Action Button Label"
                    value={offerStrip.linkLabel}
                    onChange={(v) => setOfferStrip({ ...offerStrip, linkLabel: v })}
                    placeholder="e.g. Claim Discount"
                  />
                  <Field
                    label="Action Button Link"
                    value={offerStrip.linkTarget}
                    onChange={(v) => setOfferStrip({ ...offerStrip, linkTarget: v })}
                    placeholder="e.g. /products or /bulk-enquiry"
                  />
                </div>
              </div>

              <SaveButton onClick={saveOfferStrip} label="Save Announcement Strip" />
            </div>
          ) : activeTab === 'trust' ? (
            /* TAB 4: TRUST STRIP */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Trust Strip Badges</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    The 4 value pillars rendered directly under the hero banner. Customize promises and icons.
                  </p>
                </div>
                <button
                  onClick={addTrustItem}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Badge
                </button>
              </div>

              <div className="space-y-4">
                {trustItems.map((item, index) => (
                  <div key={index} className="neu-flat rounded-xl p-4 flex gap-4 items-start group">
                    <div className="pt-2 text-[var(--text-faint)]">
                      <span className="text-xs font-bold text-[var(--text-faint)]">#{index + 1}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">Icon</label>
                        <select
                          value={item.icon || 'ShieldCheck'}
                          onChange={(e) => updateTrustItem(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
                        >
                          {ICON_OPTIONS.map((ico) => (
                            <option key={ico} value={ico}>
                              {ico}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Field
                          label="Badge Title"
                          value={item.title}
                          onChange={(v) => updateTrustItem(index, 'title', v)}
                          placeholder="e.g. Precision Colors"
                        />
                      </div>
                      <div>
                        <Field
                          label="Description"
                          value={item.description}
                          onChange={(v) => updateTrustItem(index, 'description', v)}
                          placeholder="e.g. CMYK calibrated offset"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeTrustItem(index)}
                      className="p-2 h-fit text-[var(--text-faint)] hover:text-rose-600 neu-flat rounded-lg transition-colors mt-6 opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <SaveButton onClick={saveTrustStrip} label="Save Trust Strip" />
            </div>
          ) : activeTab === 'faq' ? (
            /* TAB 5: FAQ MANAGER */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">FAQ Manager</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Manages question/answer pairs on the homepage and support page. Feeds Google SEO structured data.
                  </p>
                </div>
                <button
                  onClick={addFaq}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Question
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="neu-flat rounded-xl p-4 flex gap-4 group">
                    <div className="flex flex-col items-center gap-1 pt-2">
                      <button
                        onClick={() => moveFaq(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-bold text-[var(--text-muted)]">{index + 1}</span>
                      <button
                        onClick={() => moveFaq(index, 1)}
                        disabled={index === faqs.length - 1}
                        className="p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-3">
                      <Field
                        label="Question"
                        value={faq.question}
                        onChange={(v) => updateFaq(index, 'question', v)}
                        placeholder="e.g. Can I order single-piece prints?"
                      />
                      <TextAreaField
                        label="Answer"
                        value={faq.answer}
                        onChange={(v) => updateFaq(index, 'answer', v)}
                        rows={3}
                        placeholder="Clear, helpful response for customers..."
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`faq-active-${index}`}
                          checked={faq.isActive !== false}
                          onChange={(e) => updateFaq(index, 'isActive', e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor={`faq-active-${index}`} className="text-xs font-semibold text-[var(--text-muted)] cursor-pointer">
                          Active on Storefront
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFaq(index)}
                      className="p-2 h-fit text-[var(--text-faint)] hover:text-rose-600 neu-flat rounded-lg transition-colors mt-2 opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <SaveButton onClick={saveFaqs} label="Save FAQ Content" />
            </div>
          ) : activeTab === 'contact' ? (
            /* TAB 6: CONTACT DETAILS */
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Store Contact Details</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Universal contact and business details shown across the Footer, Support page, and Order assistance.
                </p>
              </div>

              <div className="neu-flat rounded-xl p-6 space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Direct Hotline & Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field
                    label="Support Hotline (Phone)"
                    value={contactInfo.supportPhone}
                    onChange={(v) => setContactInfo({ ...contactInfo, supportPhone: v })}
                    placeholder="+91 7700054984"
                  />
                  <Field
                    label="WhatsApp Assistance"
                    value={contactInfo.whatsappNumber}
                    onChange={(v) => setContactInfo({ ...contactInfo, whatsappNumber: v })}
                    placeholder="+91 7700054984"
                  />
                  <Field
                    label="Official Support Email"
                    value={contactInfo.supportEmail}
                    onChange={(v) => setContactInfo({ ...contactInfo, supportEmail: v })}
                    placeholder="imagemazaprintwala@gmail.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <Field
                    label="Business Operating Hours"
                    value={contactInfo.workingHours}
                    onChange={(v) => setContactInfo({ ...contactInfo, workingHours: v })}
                    placeholder="Mon - Sat: 10:00 AM - 7:00 PM"
                  />
                  <Field
                    label="GSTIN / Business Registration"
                    value={contactInfo.gstin}
                    onChange={(v) => setContactInfo({ ...contactInfo, gstin: v })}
                    placeholder="27AAAAA0000A1Z5"
                  />
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] pt-4 border-t border-[var(--border)]">
                  Physical Office & Dispatch Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Address Line 1"
                    value={contactInfo.addressLine1}
                    onChange={(v) => setContactInfo({ ...contactInfo, addressLine1: v })}
                    placeholder="Shop/Unit No., Building Name"
                  />
                  <Field
                    label="Address Line 2"
                    value={contactInfo.addressLine2}
                    onChange={(v) => setContactInfo({ ...contactInfo, addressLine2: v })}
                    placeholder="Street, Landmark, Area"
                  />
                  <Field
                    label="City"
                    value={contactInfo.city}
                    onChange={(v) => setContactInfo({ ...contactInfo, city: v })}
                    placeholder="Mumbai"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Field
                      label="State"
                      value={contactInfo.state}
                      onChange={(v) => setContactInfo({ ...contactInfo, state: v })}
                      placeholder="Maharashtra"
                    />
                    <Field
                      label="PIN Code"
                      value={contactInfo.pincode}
                      onChange={(v) => setContactInfo({ ...contactInfo, pincode: v })}
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              <SaveButton onClick={saveContactInfo} label="Save Contact Details" />
            </div>
          ) : activeTab === 'footer' ? (
            /* TAB 7: FOOTER LINKS */
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Footer Links & Policies</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Every field here is optional. Anything you leave blank keeps the storefront built-in fallback.
                </p>
              </div>

              <div className="neu-flat rounded-xl p-6 space-y-4">
                <TextAreaField
                  label="Brand Tagline"
                  value={footer.tagline}
                  onChange={(v) => setFooterField('tagline', v)}
                  placeholder="Leave empty to use default description..."
                  rows={2}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Support Phone Override"
                    value={footer.supportPhone}
                    onChange={(v) => setFooterField('supportPhone', v)}
                    placeholder="+91 7700054984"
                  />
                  <Field
                    label="Support Email Override"
                    value={footer.supportEmail}
                    onChange={(v) => setFooterField('supportEmail', v)}
                    placeholder="imagemazaprintwala@gmail.com"
                  />
                </div>

                <div className="pt-2 border-t border-[var(--border)]">
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-3">Social Links</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Facebook" value={footer.social?.facebook} onChange={(v) => setSocial('facebook', v)} placeholder="https://facebook.com/..." />
                    <Field label="Instagram" value={footer.social?.instagram} onChange={(v) => setSocial('instagram', v)} placeholder="https://instagram.com/..." />
                    <Field label="Twitter / X" value={footer.social?.twitter} onChange={(v) => setSocial('twitter', v)} placeholder="https://x.com/..." />
                    <Field label="LinkedIn" value={footer.social?.linkedin} onChange={(v) => setSocial('linkedin', v)} placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">Custom Link Columns</h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Adding any column replaces the built-in Resources / Support links.
                  </p>
                </div>
                <button
                  onClick={addColumn}
                  className="px-3 py-1.5 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Column
                </button>
              </div>

              {footer.columns.map((col, ci) => (
                <div key={ci} className="neu-flat rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-xs">
                      <Field label={`Column ${ci + 1} Title`} value={col.title} onChange={(v) => updateColumn(ci, 'title', v)} placeholder="e.g. Corporate Services" />
                    </div>
                    <button onClick={() => removeColumn(ci)} className="text-[var(--text-faint)] hover:text-rose-600 p-2 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {col.links.map((link, li) => (
                      <div key={li} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={link.label || ''}
                          onChange={(e) => updateLink(ci, li, 'label', e.target.value)}
                          placeholder="Link Label"
                          className="flex-1 px-3 py-1.5 neu-flat rounded-lg text-xs outline-none bg-[var(--bg-card)] text-[var(--text-main)]"
                        />
                        <input
                          type="text"
                          value={link.href || ''}
                          onChange={(e) => updateLink(ci, li, 'href', e.target.value)}
                          placeholder="/path or https://..."
                          className="flex-1 px-3 py-1.5 neu-flat rounded-lg text-xs outline-none bg-[var(--bg-card)] text-[var(--text-main)]"
                        />
                        <button onClick={() => removeLink(ci, li)} className="text-[var(--text-faint)] hover:text-rose-600 p-1 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addLink(ci)}
                      className="text-xs text-[#0082CA] font-bold hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Link Row
                    </button>
                  </div>
                </div>
              ))}

              <SaveButton onClick={saveFooter} label="Save Footer Links" />
            </div>
          ) : (
            /* TAB 8: POLICIES & LEGAL */
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Legal & Store Policies</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Update customer policy text without writing HTML or requiring a code deploy.
                </p>
              </div>

              {/* Subtabs for the 4 policies */}
              <div className="flex gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
                {[
                  { id: 'privacy', label: 'Privacy Policy' },
                  { id: 'terms', label: 'Terms of Service' },
                  { id: 'shipping', label: 'Shipping Policy' },
                  { id: 'returns', label: 'Refund & Returns' },
                ].map((pol) => (
                  <button
                    key={pol.id}
                    onClick={() => setActivePolicyKey(pol.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activePolicyKey === pol.id
                        ? 'bg-[#0082CA] text-white shadow-xs'
                        : 'neu-flat text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {pol.label}
                  </button>
                ))}
              </div>

              <div className="neu-flat rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Page / Policy Title"
                    value={policies[activePolicyKey]?.title}
                    onChange={(v) =>
                      setPolicies({
                        ...policies,
                        [activePolicyKey]: { ...policies[activePolicyKey], title: v },
                      })
                    }
                  />
                  <Field
                    label="Last Updated Notice"
                    value={policies[activePolicyKey]?.lastUpdated}
                    onChange={(v) =>
                      setPolicies({
                        ...policies,
                        [activePolicyKey]: { ...policies[activePolicyKey], lastUpdated: v },
                      })
                    }
                    placeholder="e.g. November 2026"
                  />
                </div>

                <TextAreaField
                  label="Policy Document Body"
                  value={policies[activePolicyKey]?.body}
                  onChange={(v) =>
                    setPolicies({
                      ...policies,
                      [activePolicyKey]: { ...policies[activePolicyKey], body: v },
                    })
                  }
                  rows={10}
                  help="Plain text or multi-paragraph guidelines. Storefront preserves paragraph breaks."
                />
              </div>

              <SaveButton
                onClick={() => savePolicy(activePolicyKey)}
                label={`Save ${policies[activePolicyKey]?.title || 'Policy'}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
