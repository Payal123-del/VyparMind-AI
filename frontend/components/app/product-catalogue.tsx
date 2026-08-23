'use client';

import { useState } from 'react';
import {
  Search,
  Sparkles,
  Zap,
  ShoppingCart,
  Check,
  Tag,
  ArrowRight,
  Filter,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageMode, TRANSLATIONS } from '@/lib/translations';

interface ProductCatalogueProps {
  onOpenCopilot: (prompt?: string) => void;
  lang?: LanguageMode;
}

export interface CatalogueProduct {
  id: string;
  name: string;
  category: 'SMARTPHONES' | 'LAPTOPS' | 'AUDIO' | 'CLOUD' | 'POS' | 'SECURITY';
  categoryLabelEn: string;
  categoryLabelHi: string;
  categoryLabelHinglish: string;
  price: string;
  image: string;
  descEn: string;
  descHi: string;
  descHinglish: string;
  badge?: string;
  isPopular?: boolean;
}

export const CATALOGUE_PRODUCTS: CatalogueProduct[] = [
  // 1. Smartphones
  {
    id: 'PROD-101',
    name: 'Redmi Note 13 Pro 5G',
    category: 'SMARTPHONES',
    categoryLabelEn: 'Smartphones',
    categoryLabelHi: 'स्मार्टफोन',
    categoryLabelHinglish: 'Smartphones',
    price: '₹14,999',
    image: '/product_smartphone_item.jpg',
    descEn: '200MP OIS Camera, 67W Turbo Charge, 128GB Storage, 5000mAh Battery.',
    descHi: '200MP OIS कैमरा, 67W टर्बो चार्जिंग, 128GB स्टोरेज, 5000mAh बैटरी।',
    descHinglish: '200MP OIS Camera, 67W fast charger, 128GB storage aur 5000mAh battery ke saath.',
    badge: 'Best Value 5G',
    isPopular: true,
  },
  {
    id: 'PROD-102',
    name: 'Realme 12 Pro+ 5G',
    category: 'SMARTPHONES',
    categoryLabelEn: 'Smartphones',
    categoryLabelHi: 'स्मार्टफोन',
    categoryLabelHinglish: 'Smartphones',
    price: '₹23,999',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    descEn: 'Periscope Portrait Lens, Snapdragon 7s Gen 2, 120Hz Curved OLED.',
    descHi: 'पेरिस्कोप पोर्ट्रेट लेंस, स्नैपड्रैगन 7s जेन 2, 120Hz कर्व्ड OLED डिस्प्ले।',
    descHinglish: 'Periscope portrait lens, curved OLED display aur ultra-fast 5G connectivity.',
  },
  {
    id: 'PROD-103',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'SMARTPHONES',
    categoryLabelEn: 'Smartphones',
    categoryLabelHi: 'स्मार्टफोन',
    categoryLabelHinglish: 'Smartphones',
    price: '₹1,29,999',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    descEn: 'Galaxy AI Features, Snapdragon 8 Gen 3, Titanium Frame, 200MP Sensor.',
    descHi: 'गैलेक्सी AI फीचर्स, स्नैपड्रैगन 8 जेन 3, टाइटेनियम फ्रेम, 200MP कैमरा।',
    descHinglish: 'Galaxy AI, titanium frame body, 200MP camera aur S-Pen stylus Included.',
    badge: 'Flagship AI',
  },
  {
    id: 'PROD-104',
    name: 'OnePlus 12 5G',
    category: 'SMARTPHONES',
    categoryLabelEn: 'Smartphones',
    categoryLabelHi: 'स्मार्टफोन',
    categoryLabelHinglish: 'Smartphones',
    price: '₹64,999',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    descEn: 'Hasselblad Camera for Mobile, 5400mAh, 100W SUPERVOOC Charging.',
    descHi: 'हैसेलब्लाड कैमरा सिस्टम, 5400mAh बैटरी, 100W सुपरवूक फास्ट चार्जिंग।',
    descHinglish: 'Hasselblad 4th Gen camera, 100W superfast charger aur 5400mAh battery.',
  },
  {
    id: 'PROD-105',
    name: 'iPhone 15 Pro Max',
    category: 'SMARTPHONES',
    categoryLabelEn: 'Smartphones',
    categoryLabelHi: 'स्मार्टफोन',
    categoryLabelHinglish: 'Smartphones',
    price: '₹1,59,900',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    descEn: 'Aerospace Titanium Design, A17 Pro Chip, 5x Telephoto Zoom Camera.',
    descHi: 'एयरोस्पेस टाइटेनियम डिज़ाइन, A17 प्रो चिपसेट, 5x टेलीफोटो ज़ूम कैमरा।',
    descHinglish: 'Aerospace grade titanium, A17 Pro chip aur 5x optical zoom camera.',
  },

  // 2. Laptops & Computers
  {
    id: 'PROD-201',
    name: 'MacBook Pro 16 M3 Max',
    category: 'LAPTOPS',
    categoryLabelEn: 'Laptops',
    categoryLabelHi: 'लैपटॉप',
    categoryLabelHinglish: 'Laptops',
    price: '₹3,49,900',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    descEn: 'Liquid Retina XDR Display, 36GB Unified Memory, 1TB High-speed SSD.',
    descHi: 'लिक्विड रेटिना XDR डिस्प्ले, 36GB यूनिफाइड मेमोरी, 1TB हाई-स्पीड SSD।',
    descHinglish: 'Liquid Retina XDR display, 36GB RAM, 1TB SSD for heavy video & coding work.',
    badge: 'Pro Performance',
    isPopular: true,
  },
  {
    id: 'PROD-202',
    name: 'Dell XPS 13 UltraBook',
    category: 'LAPTOPS',
    categoryLabelEn: 'Laptops',
    categoryLabelHi: 'लैपटॉप',
    categoryLabelHinglish: 'Laptops',
    price: '₹1,45,000',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    descEn: 'Intel Core Ultra 7 Processor, InfinityEdge Touch Display, 16GB LPDDR5.',
    descHi: 'इंटेल कोर अल्ट्रा 7 प्रोसेसर, इनफिनिटी-एज टच स्क्रीन, 16GB रैम।',
    descHinglish: 'Ultra-thin aluminum chassis, Intel Core Ultra 7 processor aur 16GB RAM.',
  },
  {
    id: 'PROD-203',
    name: 'Logitech MX Master 3S Mouse',
    category: 'LAPTOPS',
    categoryLabelEn: 'Accessories',
    categoryLabelHi: 'सहायक उपकरण',
    categoryLabelHinglish: 'Accessories',
    price: '₹9,995',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    descEn: 'Quiet Clicks Technology, 8K DPI Darkfield Sensor, Ergonomic Design.',
    descHi: 'क्वाइट क्लिक तकनीक, 8K DPI डार्कफील्ड सेंसर, एर्गोनोमिक बॉडी।',
    descHinglish: 'Silent clicks, 8K DPI sensor, Bluetooth + Logi Bolt wireless receiver.',
  },
  {
    id: 'PROD-204',
    name: 'Keychron K2 Mechanical Keyboard',
    category: 'LAPTOPS',
    categoryLabelEn: 'Accessories',
    categoryLabelHi: 'सहायक उपकरण',
    categoryLabelHinglish: 'Accessories',
    price: '₹8,499',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    descEn: '75% Layout Wireless Mechanical, RGB Backlit, Hot-swappable Switches.',
    descHi: '75% लेआउट मैकेनिकल कीबोर्ड, आरजीबी बैकलाइट, हॉट-स्वैपेबल स्विच।',
    descHinglish: 'Wireless Bluetooth/Wired mechanical keyboard with RGB backlighting.',
  },

  // 3. Audio & Headphones
  {
    id: 'PROD-301',
    name: 'Pro Noise-Cancelling Headphones',
    category: 'AUDIO',
    categoryLabelEn: 'Audio',
    categoryLabelHi: 'ऑडियो',
    categoryLabelHinglish: 'Audio',
    price: '₹4,999',
    image: '/product_headphones_item.jpg',
    descEn: 'Active Hybrid ANC, 40-hour Battery Life, High-Res Audio Drivers.',
    descHi: 'एक्टिव हाइब्रिड शोर रद्दीकरण (ANC), 40 घंटे की बैटरी लाइफ, हाई-रेस साउंड।',
    descHinglish: 'Active Noise Cancellation, 40 hours battery backup aur deep bass audio.',
    badge: 'Bestseller',
    isPopular: true,
  },
  {
    id: 'PROD-302',
    name: 'Wireless ANC Earbuds',
    category: 'AUDIO',
    categoryLabelEn: 'Audio',
    categoryLabelHi: 'ऑडियो',
    categoryLabelHinglish: 'Audio',
    price: '₹2,499',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    descEn: 'Spatial Audio Engine, IPX4 Sweat Resistance, Smart Touch Controls.',
    descHi: 'स्थानिक ऑडियो इंजन, IPX4 पसीना प्रतिरोधी, स्मार्ट टच नियंत्रण।',
    descHinglish: 'Low latency spatial audio, IPX4 sweatproof, wireless charging case.',
  },
  {
    id: 'PROD-303',
    name: 'Portable Bluetooth Speaker',
    category: 'AUDIO',
    categoryLabelEn: 'Audio',
    categoryLabelHi: 'ऑडियो',
    categoryLabelHinglish: 'Audio',
    price: '₹3,999',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    descEn: '360-degree Deep Bass, Waterproof IP67 Rating, 18hr Playtime.',
    descHi: '360-डिग्री गहरा बास, वाटरप्रूफ IP67 रेटिंग, 18 घंटे प्लेबैक।',
    descHinglish: '360 degree sound output, IP67 waterproof body aur long battery life.',
  },

  // 4. Cloud & Business SaaS
  {
    id: 'PROD-401',
    name: 'Vyapar Cloud Storage 2TB Tier',
    category: 'CLOUD',
    categoryLabelEn: 'Cloud & SaaS',
    categoryLabelHi: 'क्लाउड सेवाएं',
    categoryLabelHinglish: 'Cloud Plans',
    price: '₹4,999 / yr',
    image: '/product_cloud_storage.jpg',
    descEn: 'AES-256 Encrypted Backup, Multi-User Team Sharing, Ransomware Shield.',
    descHi: 'AES-256 एन्क्रिप्टेड बैकअप, टीम शेयरिंग, रैनसमवेयर सुरक्षा शील्ड।',
    descHinglish: 'Secure 2TB cloud vault, multi-user sharing aur automatic backup.',
    badge: 'Enterprise Security',
    isPopular: true,
  },
  {
    id: 'PROD-402',
    name: 'Enterprise Backup Vault',
    category: 'CLOUD',
    categoryLabelEn: 'Cloud & SaaS',
    categoryLabelHi: 'क्लाउड सेवाएं',
    categoryLabelHinglish: 'Cloud Plans',
    price: '₹12,999 / yr',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    descEn: 'Automated Hourly Snapshots, Geo-Redundant Servers, 99.99% Uptime SLA.',
    descHi: 'स्वचालित प्रति घंटा स्नैपशॉट, भू-अतिरि‍क्त सर्वर, 99.99% अपटाइम।',
    descHinglish: 'Hourly automatic data snapshots, geo-redundant servers aur 99.99% uptime.',
  },
  {
    id: 'PROD-403',
    name: 'VyaparMind AI Billing Engine',
    category: 'CLOUD',
    categoryLabelEn: 'Software',
    categoryLabelHi: 'सॉफ्टवेयर',
    categoryLabelHinglish: 'Software',
    price: '₹8,999 / yr',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    descEn: 'Multi-GST Invoicing, WhatsApp Payment Links, Automated Payment Reminders.',
    descHi: 'मल्टी-जीएसटी चालान, व्हाट्सएप भुगतान लिंक, स्वचालित रिमाइंडर।',
    descHinglish: 'Instant GST invoice creation, WhatsApp payment links aur auto reminders.',
  },
  {
    id: 'PROD-404',
    name: 'Automated CRM Growth OS',
    category: 'CLOUD',
    categoryLabelEn: 'Software',
    categoryLabelHi: 'सॉफ्टवेयर',
    categoryLabelHinglish: 'Software',
    price: '₹18,999 / yr',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    descEn: 'Voice AI Lead Capture, Automated Sales Funnel Pipeline, WhatsApp Bots.',
    descHi: 'वॉयस AI लीड कैप्चर, स्वचालित बिक्री फ़नल, व्हाट्सएप बॉट्स।',
    descHinglish: 'Voice AI lead qualification, automated WhatsApp chat bot aur sales CRM.',
  },

  // 5. Office & Retail POS
  {
    id: 'PROD-501',
    name: 'Thermal Receipt Printer 80mm',
    category: 'POS',
    categoryLabelEn: 'Office & POS',
    categoryLabelHi: 'ऑफिस व पीओएस',
    categoryLabelHinglish: 'Office & POS',
    price: '₹6,499',
    image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=800&q=80',
    descEn: 'High-speed 260mm/s Printing, USB + Bluetooth + Ethernet Interface.',
    descHi: 'हाई-स्पीड 260mm/s प्रिंटिंग, USB + ब्लूटूथ + इथरनेट इंटरफेस।',
    descHinglish: 'Ultra-fast bill printer with USB, Bluetooth and Ethernet connectivity.',
  },
  {
    id: 'PROD-502',
    name: 'Wireless 2D Barcode Scanner',
    category: 'POS',
    categoryLabelEn: 'Office & POS',
    categoryLabelHi: 'ऑफिस व पीओएस',
    categoryLabelHinglish: 'Office & POS',
    price: '₹3,299',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
    descEn: 'Scans QR Code & Screen Barcodes, 2.4G Wireless + Bluetooth Stand.',
    descHi: 'क्यूआर कोड और स्क्रीन बारकोड स्कैनिंग, 2.4G वायरलेस आधार।',
    descHinglish: 'High precision QR & Barcode scanner with wireless charging dock.',
  },
  {
    id: 'PROD-503',
    name: 'Dual Screen Retail POS Touch System',
    category: 'POS',
    categoryLabelEn: 'Office & POS',
    categoryLabelHi: 'ऑफिस व पीओएस',
    categoryLabelHinglish: 'Office & POS',
    price: '₹38,500',
    image: 'https://images.unsplash.com/photo-1556742049-0a67daf40955?auto=format&fit=crop&w=800&q=80',
    descEn: '15.6" Main Capacitive Touch Screen, 10.1" Customer Display, Cash Drawer.',
    descHi: '15.6 इंच मुख्य कैपेसिटिव टच स्क्रीन, 10.1 इंच ग्राहक डिस्प्ले।',
    descHinglish: 'Dual screen POS billing machine with integrated receipt printer & cash drawer.',
    badge: 'Retail Complete',
  },
  {
    id: 'PROD-504',
    name: 'Ultra-Fast 65W GaN Charger',
    category: 'POS',
    categoryLabelEn: 'Accessories',
    categoryLabelHi: 'सहायक उपकरण',
    categoryLabelHinglish: 'Accessories',
    price: '₹1,899',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    descEn: 'Triple USB-C Output, Gallium Nitride Tech, Compact Foldable Pins.',
    descHi: 'ट्रिपल USB-C आउटपुट, गैलियम नाइट्राइड तकनीक, कॉम्पैक्ट बॉडी।',
    descHinglish: '65W GaN fast charger for laptops, smartphones & tablets simultaneously.',
  },

  // 6. Networking & Security
  {
    id: 'PROD-601',
    name: 'Wi-Fi 6 Dual-Band Mesh Router',
    category: 'SECURITY',
    categoryLabelEn: 'Networking',
    categoryLabelHi: 'नेटवर्किंग',
    categoryLabelHinglish: 'Networking',
    price: '₹7,999',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    descEn: '3000Mbps Speed, Connects up to 60 Devices, Seamless Mesh Coverage.',
    descHi: '3000Mbps गति, 60 से अधिक डिवाइस कनेक्शन, निर्बाध जाल कवरेज।',
    descHinglish: 'Ultra high speed Wi-Fi 6 mesh router for office & large commercial spaces.',
  },
  {
    id: 'PROD-602',
    name: 'Smart Outdoor 4K CCTV Camera',
    category: 'SECURITY',
    categoryLabelEn: 'Security',
    categoryLabelHi: 'सुरक्षा',
    categoryLabelHinglish: 'Security',
    price: '₹4,500',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    descEn: 'Color Night Vision, AI Human Motion Detection, Two-way Audio Mic.',
    descHi: 'कलर नाइट विजन, AI मानव मोशन डिटेक्शन, टू-वे ऑडियो वॉकी-टॉकी।',
    descHinglish: '4K Ultra HD resolution, night vision color camera with mobile app alert.',
  },
  {
    id: 'PROD-603',
    name: 'Network Attached Storage (NAS) 4-Bay',
    category: 'SECURITY',
    categoryLabelEn: 'Storage & Hardware',
    categoryLabelHi: 'स्टोरेज व हार्डवेयर',
    categoryLabelHinglish: 'Hardware',
    price: '₹32,000',
    image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=800&q=80',
    descEn: 'Quad Core CPU, Dual 2.5GbE Ports, Hardware Encryption Engine, RAID Support.',
    descHi: 'क्वॉड कोर सीपीयू, डुअल 2.5GbE पोर्ट्स, हार्डवेयर एन्क्रिप्शन।',
    descHinglish: '4-Bay central network storage server for enterprise office data security.',
  },
  {
    id: 'PROD-604',
    name: 'UPS Power Backup System 1100VA',
    category: 'SECURITY',
    categoryLabelEn: 'Power Backup',
    categoryLabelHi: 'पावर बैकअप',
    categoryLabelHinglish: 'Power Backup',
    price: '₹6,800',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    descEn: 'Line-Interactive Technology, Automatic Voltage Regulator, LCD Monitor.',
    descHi: 'लाइन-इंटरएक्टिव तकनीक, स्वचालित वोल्टेज नियामक, एलसीडी मॉनिटर।',
    descHinglish: '1100VA continuous UPS battery backup for servers, POS & computers.',
  },
];

export function ProductCatalogue({ onOpenCopilot, lang = 'hinglish' }: ProductCatalogueProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedInquiries, setAddedInquiries] = useState<Record<string, boolean>>({});

  const t = TRANSLATIONS[lang];

  const categories = [
    { id: 'ALL', label: t.allCategories },
    { id: 'SMARTPHONES', label: t.smartphonesCategory },
    { id: 'LAPTOPS', label: t.laptopsCategory },
    { id: 'AUDIO', label: t.audioCategory },
    { id: 'CLOUD', label: t.cloudCategory },
    { id: 'POS', label: t.officePosCategory },
    { id: 'SECURITY', label: t.networkingSecurityCategory },
  ];

  const filteredProducts = CATALOGUE_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.descEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.descHi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getProductDesc = (prod: CatalogueProduct) => {
    if (lang === 'hi') return prod.descHi;
    if (lang === 'hinglish') return prod.descHinglish;
    return prod.descEn;
  };

  const getCategoryLabel = (prod: CatalogueProduct) => {
    if (lang === 'hi') return prod.categoryLabelHi;
    if (lang === 'hinglish') return prod.categoryLabelHinglish;
    return prod.categoryLabelEn;
  };

  const handleInquiryToggle = (id: string, name: string) => {
    setAddedInquiries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="size-3.5 text-purple-400" />
              VyaparMind Verified Catalogue
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">
            {t.catalogueTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {t.catalogueSubtitle}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-xs h-9 rounded-xl whitespace-nowrap px-4 font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Product Cards Grid: 4 cols desktop, 2 cols tablet, 1 col mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => {
          const isInquired = !!addedInquiries[prod.id];

          return (
            <div
              key={prod.id}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/40 transition-all duration-300"
            >
              {/* Product Image Box with Zoom Effect */}
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/vyaparmind_hero_banner.jpg';
                  }}
                  className="size-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />

                {/* Category & Badge Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-purple-300 border border-purple-500/30">
                    {getCategoryLabel(prod)}
                  </span>
                  {prod.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <span className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-slate-400 border border-slate-800">
                  {prod.id}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-extrabold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {getProductDesc(prod)}
                  </p>
                </div>

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                        {t.priceTag}
                      </span>
                      <span className="text-lg font-black text-emerald-400">
                        {prod.price}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInquiryToggle(prod.id, prod.name)}
                      className={`text-[11px] h-8 rounded-xl font-semibold px-2.5 gap-1.5 transition-all ${
                        isInquired
                          ? 'border-emerald-800 bg-emerald-950/60 text-emerald-300'
                          : 'border-slate-800 text-slate-300 hover:border-purple-500/40 hover:text-purple-300'
                      }`}
                    >
                      {isInquired ? (
                        <>
                          <Check className="size-3.5 text-emerald-400" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="size-3.5 text-purple-400" />
                          <span>{t.addToInquiry}</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Ask AI Button */}
                  <Button
                    onClick={() =>
                      onOpenCopilot(
                        lang === 'hi'
                          ? `कृपया मुझे ${prod.name} की कीमत, वारंटी और डिलीवरी विवरण बताएं।`
                          : `Please explain pricing, warranty, and features for ${prod.name}.`
                      )
                    }
                    className="w-full bg-purple-950/40 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-800/40 text-xs font-semibold rounded-xl py-2 gap-1.5 transition-all shadow-sm group/btn"
                  >
                    <Sparkles className="size-3.5 text-purple-400 group-hover/btn:text-white transition-colors" />
                    <span>{t.inquireWithAi}</span>
                    <ArrowRight className="size-3 text-purple-400 group-hover/btn:text-white transition-colors ml-auto" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
