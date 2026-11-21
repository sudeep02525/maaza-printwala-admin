'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  LayoutGrid,
  Type,
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

const DEFAULT_CATEGORY_BLOCKS = [
  {
    title: 'Business Essentials',
    tiles: [
      { name: 'Visiting Cards', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262678/maaza-printwala/images/cat_visiting_cards_new_1785478123231.jpg', link: '/visiting-cards', isActive: true },
      { name: 'Notebooks', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262673/maaza-printwala/images/cat_notebooks_new_1785478132458.jpg', link: '/stationery?sub=notebooks', isActive: true },
      { name: 'Custom Mugs', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262674/maaza-printwala/images/cat_mugs_new_1785478141544.jpg', link: '/products?search=mug', isActive: true },
      { name: 'Custom Clothing, Bags & Caps', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262671/maaza-printwala/images/cat_clothing_new_1785478162007.jpg', link: '/products?search=apparel', isActive: true },
    ],
  },
  {
    title: 'Custom Apparel',
    tiles: [
      { name: 'Custom Polo T-shirts', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262676/maaza-printwala/images/cat_polo_new_1785478171451.jpg', link: '/products?search=polo', isActive: true },
      { name: 'Custom T-shirts', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262677/maaza-printwala/images/cat_tshirt_new_1785478181285.jpg', link: '/products?search=t-shirt', isActive: true },
      { name: 'Custom Formal Shirts', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262668/maaza-printwala/images/cat_formal_new_1785478190948.jpg', link: '/products?search=apparel', isActive: true },
      { name: 'Caps', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262663/maaza-printwala/images/cat_caps_new_1785478209032.jpg', link: '/products?search=cap', isActive: true },
    ],
  },
];

const DEFAULT_HOME_HEADINGS = {
  bestSellersTitle: 'Best Selling Products',
  bestSellersSubtitle: 'Most ordered commercial print and merchandise products',
  newArrivalsTitle: 'New Arrivals & Fresh Templates',
  newArrivalsSubtitle: 'Fresh new templates and products',
  corporateTitle: 'Corporate Essentials & Gifting',
  corporateSubtitle: 'Bulk corporate solutions with custom GST invoicing',
  trendingTitle: 'Trending Print Catalogue',
  trendingSubtitle: 'Top rated commercial solutions popular this month',
  popularSearchesTitle: 'Popular Searches',
};

const DEFAULT_PAYMENTS = {
  enabled: true,
  badges: [
    { id: 'visa', label: 'VISA', enabled: true },
    { id: 'mc', label: 'Mastercard', enabled: true },
    { id: 'upi', label: 'UPI', enabled: true },
    { id: 'rupay', label: 'RuPay', enabled: true },
    { id: 'netbanking', label: 'Net Banking', enabled: false },
    { id: 'cod', label: 'Cash on Delivery', enabled: false },
  ],
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

// One-Click Image Upload Field with Direct Cloudinary Integration
const ImageField = ({ label, value, onChange, placeholder, help }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'maaza-printwala/cms');
    setIsUploading(true);
    try {
      const res = await axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = res.data?.url || res.url || res.data?.data?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'https://res.cloudinary.com/... or click Upload'}
          className="flex-1 px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 neu-flat rounded-lg font-bold text-xs flex items-center gap-1.5 text-[#0082CA] hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
        </button>
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <img
            src={getImageUrl(value)}
            alt="Preview"
            className="w-12 h-12 object-cover rounded-md border border-[var(--border)] shadow-xs"
          />
          <span className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">{value}</span>
        </div>
      )}
      {help && <p className="text-[11px] text-[var(--text-muted)] mt-1">{help}</p>}
    </div>
  );
};

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
  const [categoryBlocks, setCategoryBlocks] = useState(DEFAULT_CATEGORY_BLOCKS);
  const [homeHeadings, setHomeHeadings] = useState(DEFAULT_HOME_HEADINGS);
  const [offerStrip, setOfferStrip] = useState(DEFAULT_OFFER_STRIP);
  const [trustItems, setTrustItems] = useState(DEFAULT_TRUST_ITEMS);
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);
  const [footer, setFooter] = useState(DEFAULT_FOOTER);
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);
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

    // 3. Category Tiles
    const catContent = content.find((c) => c.key === 'homepage_categories');
    if (catContent?.content?.blocks?.length) {
      setCategoryBlocks(catContent.content.blocks);
    }

    // 4. Section Headings
    const headingsContent = content.find((c) => c.key === 'homepage_headings');
    if (headingsContent?.content) {
      setHomeHeadings({ ...DEFAULT_HOME_HEADINGS, ...headingsContent.content });
    }

    // 5. Offer Strip
    const offerContent = content.find((c) => c.key === 'offer_strip');
    if (offerContent?.content) {
      setOfferStrip({ ...DEFAULT_OFFER_STRIP, ...offerContent.content, isActive: offerContent.isActive ?? offerContent.content.isActive });
    }

    // 6. Trust Strip
    const trustContent = content.find((c) => c.key === 'homepage_trust');
    if (trustContent?.content?.items?.length) {
      setTrustItems(trustContent.content.items);
    }

    // 7. FAQ
    const faqContent = content.find((c) => c.key === 'homepage_faq');
    if (faqContent?.content?.items?.length) {
      setFaqs(faqContent.content.items);
    }

    // 8. Contact Info
    const contactContent = content.find((c) => c.key === 'contact_info');
    if (contactContent?.content) {
      setContactInfo({ ...DEFAULT_CONTACT, ...contactContent.content });
    }

    // 9. Footer Links & Payments
    const footerContent = content.find((c) => c.key === 'footer_links');
    if (footerContent?.content) {
      setFooter({ ...DEFAULT_FOOTER, ...footerContent.content });
    }

    const paymentContent = content.find((c) => c.key === 'payment_strip');
    if (paymentContent?.content) {
      setPayments({ ...DEFAULT_PAYMENTS, ...paymentContent.content });
    }

    // 10. Policies
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

  const saveCategoryTiles = () =>
    saveMutation.mutate({
      key: 'homepage_categories',
      section: 'BANNERS',
      title: 'Category Tiles',
      content: { blocks: categoryBlocks },
      isActive: true,
      sortOrder: 3,
    });

  const saveHeadings = () =>
    saveMutation.mutate({
      key: 'homepage_headings',
      section: 'HERO',
      title: 'Home Section Headings',
      content: homeHeadings,
      isActive: true,
      sortOrder: 4,
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
      sortOrder: 5,
    });

  const saveFaqs = () =>
    saveMutation.mutate({
      key: 'homepage_faq',
      section: 'FAQ',
      title: 'Frequently Asked Questions',
      content: { items: faqs },
      isActive: true,
      sortOrder: 6,
    });

  const saveContactInfo = () =>
    saveMutation.mutate({
      key: 'contact_info',
      section: 'CONTACT_INFO',
      title: 'Store Contact Information',
      content: contactInfo,
      isActive: true,
      sortOrder: 7,
    });

  const saveFooter = () => {
    saveMutation.mutate({
      key: 'footer_links',
      section: 'FOOTER',
      title: 'Footer Links',
      content: footer,
      isActive: true,
      sortOrder: 8,
    });
    saveMutation.mutate({
      key: 'payment_strip',
      section: 'FOOTER',
      title: 'Payment Strip Badges',
      content: payments,
      isActive: true,
      sortOrder: 9,
    });
  };

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
      sortOrder: 10,
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

  // Category Blocks Helpers
  const updateBlockTitle = (bi, title) => {
    const next = [...categoryBlocks];
    next[bi] = { ...next[bi], title };
    setCategoryBlocks(next);
  };
  const addBlock = () => {
    setCategoryBlocks([...categoryBlocks, { title: 'New Category Block', tiles: [] }]);
  };
  const removeBlock = (bi) => {
    setCategoryBlocks(categoryBlocks.filter((_, i) => i !== bi));
  };
  const updateTile = (bi, ti, field, value) => {
    const next = [...categoryBlocks];
    const tiles = [...next[bi].tiles];
    tiles[ti] = { ...tiles[ti], [field]: value };
    next[bi] = { ...next[bi], tiles };
    setCategoryBlocks(next);
  };
  const addTile = (bi) => {
    const next = [...categoryBlocks];
    next[bi] = {
      ...next[bi],
      tiles: [...next[bi].tiles, { name: 'New Category', img: '', link: '/products', isActive: true }],
    };
    setCategoryBlocks(next);
  };
  const removeTile = (bi, ti) => {
    const next = [...categoryBlocks];
    next[bi] = {
      ...next[bi],
      tiles: next[bi].tiles.filter((_, i) => i !== ti),
    };
    setCategoryBlocks(next);
  };

  // Trust Strip Helpers
  const updateTrust = (index, field, value) => {
    const next = [...trustItems];
    next[index] = { ...next[index], [field]: value };
    setTrustItems(next);
  };
  const addTrust = () =>
    setTrustItems([...trustItems, { icon: 'ShieldCheck', title: 'New Trust Item', description: '', isActive: true }]);
  const removeTrust = (index) => setTrustItems(trustItems.filter((_, i) => i !== index));

  // FAQ Helpers
  const updateFaq = (index, field, value) => {
    const next = [...faqs];
    next[index] = { ...next[index], [field]: value };
    setFaqs(next);
  };
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '', isActive: true }]);
  const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));
  const moveFaq = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setFaqs(next);
  };

  // Footer & Payment Helpers
  const setFooterField = (field, value) => setFooter({ ...footer, [field]: value });
  const setSocial = (network, value) =>
    setFooter({ ...footer, social: { ...(footer.social || {}), [network]: value } });

  const togglePaymentBadge = (id) => {
    const nextBadges = (payments.badges || []).map((b) =>
      b.id === id ? { ...b, enabled: !b.enabled } : b
    );
    setPayments({ ...payments, badges: nextBadges });
  };

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
          <button onClick={() => setActiveTab('categories')} className={tabClass('categories')}>
            <span>Category Tiles</span>
            <LivePill />
          </button>
          <button onClick={() => setActiveTab('headings')} className={tabClass('headings')}>
            <span>Section Headings</span>
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
            <span>Footer & Payments</span>
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
                    The first slide with both an image and a title replaces the default homepage banner. Use the Upload button to select an image from your device.
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
                          <ImageField
                            label="Slide Image"
                            value={slide.image}
                            onChange={(v) => updateSlide(index, 'image', v)}
                            placeholder="https://res.cloudinary.com/... or click Upload"
                            help="Cloudinary direct image URL or upload image directly"
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
                            <ImageField
                              label="Banner Image"
                              value={banner.image}
                              onChange={(v) => updateBanner(index, 'image', v)}
                              placeholder="https://res.cloudinary.com/... or click Upload"
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
            /* TAB 3: ANNOUNCEMENT / OFFER STRIP */
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Announcement / Offer Strip</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Appears at the very top of the storefront above the main header. Dismissible per browser session.
                </p>
              </div>

              <div className="neu-flat rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                  <div>
                    <label className="text-sm font-bold text-[var(--text-main)] block">Strip Visibility</label>
                    <p className="text-xs text-[var(--text-muted)]">Toggle this to show or hide the announcement bar across the site.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(offerStrip.isActive)}
                    onChange={(e) => setOfferStrip({ ...offerStrip, isActive: e.target.checked })}
                    className="w-5 h-5 accent-[#0082CA] rounded cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Badge Text"
                    value={offerStrip.badge}
                    onChange={(v) => setOfferStrip({ ...offerStrip, badge: v })}
                    placeholder="e.g. SPECIAL OFFER, FLASH SALE"
                  />
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">Color Theme</label>
                    <select
                      value={offerStrip.bgStyle || 'blue'}
                      onChange={(e) => setOfferStrip({ ...offerStrip, bgStyle: e.target.value })}
                      className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
                    >
                      <option value="blue">Blue / Brand Primary</option>
                      <option value="dark">Midnight Dark (Slate 900)</option>
                      <option value="amber">Warm Amber Gold</option>
                      <option value="emerald">Emerald Green</option>
                      <option value="crimson">Crimson Red</option>
                    </select>
                  </div>
                </div>

                <Field
                  label="Announcement Message"
                  value={offerStrip.text}
                  onChange={(v) => setOfferStrip({ ...offerStrip, text: v })}
                  placeholder="e.g. Flat 40% OFF on all Bulk Orders | Free Pan-India Delivery"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Link Button Text (optional)"
                    value={offerStrip.linkLabel}
                    onChange={(v) => setOfferStrip({ ...offerStrip, linkLabel: v })}
                    placeholder="e.g. Order Now, Shop Deals"
                  />
                  <Field
                    label="Link Target URL"
                    value={offerStrip.linkTarget}
                    onChange={(v) => setOfferStrip({ ...offerStrip, linkTarget: v })}
                    placeholder="/products or https://..."
                  />
                </div>
              </div>

              <SaveButton onClick={saveOfferStrip} label="Save Announcement Strip" />
            </div>
          ) : activeTab === 'categories' ? (
            /* TAB 4: CATEGORY TILES (VISUAL CATEGORIES) */
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Homepage Category Tiles</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Customize the 2-block square visual category tiles (Business Essentials, Custom Apparel, etc.) on the homepage.
                  </p>
                </div>
                <button
                  onClick={addBlock}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Category Block
                </button>
              </div>

              <div className="space-y-8">
                {categoryBlocks.map((block, bi) => (
                  <div key={bi} className="neu-flat rounded-2xl p-6 space-y-5 border border-[var(--border)]">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                      <div className="flex-1 max-w-md">
                        <Field
                          label={`Block ${bi + 1} Heading`}
                          value={block.title}
                          onChange={(v) => updateBlockTitle(bi, v)}
                          placeholder="e.g. Business Essentials"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <button
                          onClick={() => addTile(bi)}
                          className="px-3 py-1.5 neu-flat text-xs font-bold text-[#0082CA] rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Tile
                        </button>
                        <button
                          onClick={() => removeBlock(bi)}
                          className="p-1.5 text-[var(--text-faint)] hover:text-rose-600 rounded-lg cursor-pointer"
                          title="Delete Block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(block.tiles || []).map((tile, ti) => (
                        <div key={ti} className="neu-flat rounded-xl p-4 space-y-3 relative group">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Tile #{ti + 1}</span>
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={tile.isActive !== false}
                                  onChange={(e) => updateTile(bi, ti, 'isActive', e.target.checked)}
                                  className="accent-[#0082CA] rounded"
                                />
                                Active
                              </label>
                              <button
                                onClick={() => removeTile(bi, ti)}
                                className="text-[var(--text-faint)] hover:text-rose-600 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <Field
                            label="Tile Title / Label"
                            value={tile.name}
                            onChange={(v) => updateTile(bi, ti, 'name', v)}
                            placeholder="e.g. Visiting Cards"
                          />

                          <ImageField
                            label="Tile Image"
                            value={tile.img}
                            onChange={(v) => updateTile(bi, ti, 'img', v)}
                            placeholder="https://res.cloudinary.com/... or upload"
                          />

                          <Field
                            label="Target URL"
                            value={tile.link}
                            onChange={(v) => updateTile(bi, ti, 'link', v)}
                            placeholder="/visiting-cards or /products?search=..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <SaveButton onClick={saveCategoryTiles} label="Save Category Tiles" />
            </div>
          ) : activeTab === 'headings' ? (
            /* TAB 5: HOME SECTION HEADINGS */
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Home Section Headings</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Customize the titles and subtitles rendered above each major storefront product section on the homepage.
                </p>
              </div>

              <div className="neu-flat rounded-xl p-6 space-y-6">
                {/* Best Sellers */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">Best Sellers Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Section Title"
                      value={homeHeadings.bestSellersTitle}
                      onChange={(v) => setHomeHeadings({ ...homeHeadings, bestSellersTitle: v })}
                      placeholder="Best Selling Products"
                    />
                    <Field
                      label="Section Subtitle"
                      value={homeHeadings.bestSellersSubtitle}
                      onChange={(v) => setHomeHeadings({ ...homeHeadings, bestSellersSubtitle: v })}
                      placeholder="Most ordered commercial print and merchandise products"
                    />
                  </div>
                </div>

                {/* New Arrivals */}
                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">New Arrivals Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Section Title"
                      value={homeHeadings.newArrivalsTitle}
                      onChange={(v) => setHomeHeadings({ ...homeHeadings, newArrivalsTitle: v })}
                      placeholder="New Arrivals & Fresh Templates"
                    />
                    <Field
                      label="Section Subtitle"
                      value={homeHeadings.newArrivalsSubtitle}
                      onChange={(v) => setHomeHeadings({ ...homeHeadings, newArrivalsSubtitle: v })}
                      placeholder="Fresh new templates and products"
                    />
                  </div>
                </div>

                {/* Corporate Essentials */}
                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">Corporate & Business Printing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Section Title"
                      value={homeHeadings.corporateTitle}
                      onChange={(v) => setHomeHeadings({ ...homeHeadings, corporateTitle: v })}
                      placeholder="Corporate Essentials & Gifting"
                    />
                    <Field
                      label="Section Subtitle"
                      value={homeHeadings.corporateSubtitle}
                      onChange={(v) => setHomeHeadings({ ...homeHeadings, corporateSubtitle: v })}
                      placeholder="Bulk corporate solutions with custom GST invoicing"
                    />
                  </div>
                </div>

                {/* Trending Products */}
                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">Trending / Top Rated Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Section Title"
                      value={homeHeadings.trendingTitle}
                      onChange={(v) => setHomeHeadings({ ...homeHeadings, trendingTitle: v })}
                      placeholder="Trending Print Catalogue"
                    />
                    <Field
                      label="Section Subtitle"
                      value={homeHeadings.trendingSubtitle}
                      onChange={(v) => setHomeHeadings({ ...homeHeadings, trendingSubtitle: v })}
                      placeholder="Top rated commercial solutions popular this month"
                    />
                  </div>
                </div>

                {/* Popular Searches */}
                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0082CA]">Popular Searches Bar</h3>
                  <Field
                    label="Section Title"
                    value={homeHeadings.popularSearchesTitle}
                    onChange={(v) => setHomeHeadings({ ...homeHeadings, popularSearchesTitle: v })}
                    placeholder="Popular Searches"
                  />
                </div>
              </div>

              <SaveButton onClick={saveHeadings} label="Save Section Headings" />
            </div>
          ) : activeTab === 'trust' ? (
            /* TAB 6: TRUST STRIP */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Trust Strip (Value Pillars)</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    The 4 icons and value statements that appear below the hero banner.
                  </p>
                </div>
                <button
                  onClick={addTrust}
                  className="px-4 py-2 neu-flat text-[var(--text-main)] font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0082CA]" /> Add Item
                </button>
              </div>

              <div className="space-y-4">
                {trustItems.map((item, index) => (
                  <div key={index} className="neu-flat rounded-xl p-5 space-y-4 group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                        Pillar #{index + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(item.isActive !== false)}
                            onChange={(e) => updateTrust(index, 'isActive', e.target.checked)}
                            className="accent-[#0082CA] rounded cursor-pointer"
                          />
                          Active
                        </label>
                        <button
                          onClick={() => removeTrust(index)}
                          className="text-[var(--text-faint)] hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">Icon</label>
                        <select
                          value={item.icon || 'ShieldCheck'}
                          onChange={(e) => updateTrust(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 neu-flat rounded-lg focus:ring-2 focus:ring-[var(--border-strong)] focus:border-[var(--text-main)] outline-none text-sm text-[var(--text-main)] bg-[var(--bg-card)]"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <Field
                          label="Title"
                          value={item.title}
                          onChange={(v) => updateTrust(index, 'title', v)}
                          placeholder="e.g. Precision Colors"
                        />
                      </div>
                    </div>

                    <Field
                      label="Short Description"
                      value={item.description}
                      onChange={(v) => updateTrust(index, 'description', v)}
                      placeholder="e.g. CMYK calibrated offset & digital machines"
                    />
                  </div>
                ))}
              </div>

              <SaveButton onClick={saveTrustStrip} label="Save Trust Strip" />
            </div>
          ) : activeTab === 'faq' ? (
            /* TAB 7: FAQ MANAGER */
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">FAQ Manager</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Manage the accordion questions on the homepage. Drag reorder or use arrows.
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
                  <div key={index} className="neu-flat rounded-xl p-5 space-y-3 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                          Q{index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveFaq(index, -1)}
                            className="p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === faqs.length - 1}
                            onClick={() => moveFaq(index, 1)}
                            className="p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(faq.isActive !== false)}
                            onChange={(e) => updateFaq(index, 'isActive', e.target.checked)}
                            className="accent-[#0082CA] rounded cursor-pointer"
                          />
                          Active
                        </label>
                        <button
                          onClick={() => removeFaq(index)}
                          className="text-[var(--text-faint)] hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <Field
                      label="Question"
                      value={faq.question}
                      onChange={(v) => updateFaq(index, 'question', v)}
                      placeholder="e.g. Can I order single pieces?"
                    />

                    <TextAreaField
                      label="Answer"
                      value={faq.answer}
                      onChange={(v) => updateFaq(index, 'answer', v)}
                      placeholder="Detailed answer text..."
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              <SaveButton onClick={saveFaqs} label="Save FAQs" />
            </div>
          ) : activeTab === 'contact' ? (
            /* TAB 8: CONTACT DETAILS */
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Store Contact Information</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Shared across Footer, Support Desk, Header mobile drawer, and customer notification receipts.
                </p>
              </div>

              <div className="neu-flat rounded-xl p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Customer Support Helpline (Calling)"
                    value={contactInfo.supportPhone}
                    onChange={(v) => setContactInfo({ ...contactInfo, supportPhone: v })}
                    placeholder="+91 7700054984"
                  />
                  <Field
                    label="WhatsApp Assistance Number"
                    value={contactInfo.whatsappNumber}
                    onChange={(v) => setContactInfo({ ...contactInfo, whatsappNumber: v })}
                    placeholder="+91 7700054984"
                  />
                  <Field
                    label="Support Email"
                    value={contactInfo.supportEmail}
                    onChange={(v) => setContactInfo({ ...contactInfo, supportEmail: v })}
                    placeholder="imagemazaprintwala@gmail.com"
                  />
                  <Field
                    label="Working Hours Notice"
                    value={contactInfo.workingHours}
                    onChange={(v) => setContactInfo({ ...contactInfo, workingHours: v })}
                    placeholder="Mon - Sat: 10:00 AM - 7:00 PM"
                  />
                </div>

                <div>
                  <Field
                    label="GSTIN Number (for corporate billing)"
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
            /* TAB 9: FOOTER LINKS & PAYMENT STRIP */
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Footer Links & Payment Badges</h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Configure footer navigation columns, social URLs, and checkout trust payment badges.
                </p>
              </div>

              {/* Payment Strip Badges */}
              <div className="neu-flat rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">Payment Strip Badges</h3>
                    <p className="text-xs text-[var(--text-muted)]">Toggle payment brand logos displayed at the footer bottom.</p>
                  </div>
                  <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(payments.enabled !== false)}
                      onChange={(e) => setPayments({ ...payments, enabled: e.target.checked })}
                      className="accent-[#0082CA] rounded cursor-pointer"
                    />
                    Display Payment Strip
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {(payments.badges || []).map((badge) => (
                    <label
                      key={badge.id}
                      onClick={() => togglePaymentBadge(badge.id)}
                      className={`p-3 neu-flat rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                        badge.enabled
                          ? 'border-[#0082CA] bg-[#0082CA]/5 text-[var(--text-main)] font-bold'
                          : 'border-[var(--border)] opacity-60 text-[var(--text-muted)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(badge.enabled)}
                        readOnly
                        className="accent-[#0082CA] rounded"
                      />
                      <span className="text-xs font-bold">{badge.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Footer Links & Social */}
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

              <SaveButton onClick={saveFooter} label="Save Footer & Payment Badges" />
            </div>
          ) : (
            /* TAB 10: POLICIES & LEGAL */
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
