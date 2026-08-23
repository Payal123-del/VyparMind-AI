'use client';

import { useState } from 'react';
import {
  Users,
  UserCheck,
  Globe,
  Sparkles,
  Zap,
  ShoppingBag,
  Clock,
  PhoneCall,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  intentScore: number;
  engagementLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  preferredLanguage: 'Hinglish' | 'English' | 'Hindi';
  totalLtv: string;
  ordersCount: number;
  lastInteraction: string;
  productInterests: string[];
  recommendedAction: string;
  recentTranscripts: { time: string; speaker: string; text: string }[];
}

export function CustomerIntelligence() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('CUST-801');

  const customers: CustomerProfile[] = [
    {
      id: 'CUST-801',
      name: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      email: 'rajesh.sharma@example.com',
      intentScore: 94,
      engagementLevel: 'HIGH',
      preferredLanguage: 'Hinglish',
      totalLtv: '₹42,500',
      ordersCount: 4,
      lastInteraction: '10 mins ago via Voice Copilot',
      productInterests: ['5G Smartphones', 'Fast Chargers', 'Cloud Storage'],
      recommendedAction: 'Trigger Hinglish SMS checkout for Redmi Note 13 Pro (sub-15k segment).',
      recentTranscripts: [
        { time: '18:45', speaker: 'Rajesh', text: 'Mujhe ek accha 5G phone chahiye sub 15,000 budget mein. Storage 128GB honi chahiye.' },
        { time: '18:46', speaker: 'VyaparMind AI', text: 'Bilkul Rajesh ji! Aapke liye Redmi Note 13 Pro best option hai. Isme 5G, 128GB storage, aur 5000mAh battery milti hai.' },
        { time: '18:47', speaker: 'Rajesh', text: 'Great, warranty and delivery status kya hoga?' },
      ],
    },
    {
      id: 'CUST-802',
      name: 'Ananya Verma',
      phone: '+91 98123 45678',
      email: 'ananya.v@example.com',
      intentScore: 89,
      engagementLevel: 'HIGH',
      preferredLanguage: 'English',
      totalLtv: '₹18,900',
      ordersCount: 2,
      lastInteraction: '2 hours ago via Web Inquiry',
      productInterests: ['Enterprise Cloud Storage', 'Security Backups'],
      recommendedAction: 'Send automated email coupon for 10% annual discount on 2TB Tier.',
      recentTranscripts: [
        { time: '16:20', speaker: 'Ananya', text: 'Is there any discount if I upgrade my cloud storage to 2TB annual plan?' },
        { time: '16:21', speaker: 'VyaparMind AI', text: 'Yes Ananya! Our 2TB annual plan comes with a 15% discount and complimentary team backup licenses.' },
      ],
    },
    {
      id: 'CUST-803',
      name: 'Vikram Patel',
      phone: '+91 97654 32109',
      email: 'vikram.patel@example.com',
      intentScore: 91,
      engagementLevel: 'MEDIUM',
      preferredLanguage: 'Hinglish',
      totalLtv: '₹8,499',
      ordersCount: 1,
      lastInteraction: ' Yesterday',
      productInterests: ['Noise-Cancelling Headphones', 'Car Chargers'],
      recommendedAction: 'Suggest protective travel case accessory combo.',
      recentTranscripts: [
        { time: 'Yesterday', speaker: 'Vikram', text: 'Headphones delivery kitne din me ho jayegi?' },
        { time: 'Yesterday', speaker: 'VyaparMind AI', text: 'Aapki order dispatch ho gayi hai, 48 hours me deliver ho jayegi.' },
      ],
    },
  ];

  const activeCustomer = customers.find((c) => c.id === selectedCustomer) || customers[0];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40">
            Customer Context Engine
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white">Customer Intelligence</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Deep customer context, intent scoring, language preference, and recommended next AI actions
        </p>
      </div>

      {/* Grid Layout: Customer Selector (Left) + Detail Profile (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer List */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
            Active Customer Segments ({customers.length})
          </p>

          {customers.map((cust) => {
            const isSelected = cust.id === selectedCustomer;
            return (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomer(cust.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/20 shadow-md shadow-purple-950/30'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400">{cust.id}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">
                    {cust.preferredLanguage}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">{cust.name}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>LTV: <strong className="text-emerald-400">{cust.totalLtv}</strong></span>
                  <span>Intent: <strong className="text-purple-300">{cust.intentScore}/100</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Customer Profile Context */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          {/* Top Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{activeCustomer.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
                  {activeCustomer.engagementLevel} Engagement
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {activeCustomer.email} • {activeCustomer.phone}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-500">Customer Intent Score</span>
                <div className="text-2xl font-extrabold text-purple-400">{activeCustomer.intentScore} / 100</div>
              </div>
            </div>
          </div>

          {/* Key Intelligence Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Customer LTV</span>
              <div className="text-sm font-bold text-emerald-400 mt-1">{activeCustomer.totalLtv}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Orders</span>
              <div className="text-sm font-bold text-white mt-1">{activeCustomer.ordersCount} Completed</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Preferred Language</span>
              <div className="text-sm font-bold text-purple-300 mt-1">{activeCustomer.preferredLanguage}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Last Interaction</span>
              <div className="text-xs font-medium text-slate-300 mt-1">{activeCustomer.lastInteraction}</div>
            </div>
          </div>

          {/* Product Interests & Recommended Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product Interests & AI Next Action
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeCustomer.productInterests.map((interest, idx) => {
                const getImageForInterest = (name: string) => {
                  if (name.toLowerCase().includes('phone') || name.toLowerCase().includes('charger')) return '/product_smartphone_item.jpg';
                  if (name.toLowerCase().includes('cloud') || name.toLowerCase().includes('storage')) return '/product_cloud_storage.jpg';
                  if (name.toLowerCase().includes('headphone') || name.toLowerCase().includes('audio')) return '/product_headphones_item.jpg';
                  return '/vyaparmind_hero_banner.jpg';
                };
                return (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-medium flex items-center gap-2"
                  >
                    <img
                      src={getImageForInterest(interest)}
                      alt={interest}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/vyaparmind_hero_banner.jpg';
                      }}
                      className="size-4 rounded-md object-cover"
                    />
                    <span>{interest}</span>
                  </span>
                );
              })}
            </div>

            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Sparkles className="size-4 text-purple-400" />
                <span>Recommended Next AI Action</span>
              </div>
              <p className="text-xs text-slate-200">{activeCustomer.recommendedAction}</p>
            </div>
          </div>

          {/* Recent Transcripts */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recent Voice Conversation Transcript
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activeCustomer.recentTranscripts.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span className="font-semibold text-purple-400">{t.speaker}</span>
                    <span>{t.time}</span>
                  </div>
                  <p className="text-slate-200">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
