'use client';

import { useState } from 'react';
import {
  Target,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Opportunity {
  id: string;
  type: 'HIGH_INTENT' | 'RECOVERY' | 'UPSELL' | 'DEMAND' | 'RE_ENGAGEMENT';
  title: string;
  customerName: string;
  language: string;
  confidenceScore: number;
  estimatedValue: string;
  detectedContext: string;
  suggestedAction: string;
  recommendedProduct: string;
  image: string;
  status: 'PENDING' | 'ACTIONED' | 'DISMISSED';
}

export function OpportunityCenter() {
  const [filterType, setFilterType] = useState<string>('ALL');

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 'OPP-101',
      type: 'HIGH_INTENT',
      title: 'High Purchase Intent — Smartphone under ₹15,000',
      customerName: 'Rajesh Sharma',
      language: 'Hinglish',
      confidenceScore: 94,
      estimatedValue: '₹14,999',
      detectedContext: 'Customer asked: "Mujhe sub-15k phone chahiye battery aur camera performant ho". AI verified catalogue specs.',
      suggestedAction: 'Send automated Hinglish summary & instant checkout link via SMS/WhatsApp',
      recommendedProduct: 'Redmi Note 13 Pro 5G / Realme 12',
      image: '/product_smartphone_item.jpg',
      status: 'PENDING',
    },
    {
      id: 'OPP-102',
      type: 'RECOVERY',
      title: 'Abandoned Checkout Inquiry — Cloud Storage Enterprise Plan',
      customerName: 'Ananya Verma',
      language: 'English',
      confidenceScore: 89,
      estimatedValue: '₹4,999',
      detectedContext: 'Customer inquired about 2TB annual billing discount terms but exited before payment authorization.',
      suggestedAction: 'Trigger Autonomous Recovery Agent with 10% annual coupon code',
      recommendedProduct: 'Vyapar Cloud Storage 2TB Tier',
      image: '/product_cloud_storage.jpg',
      status: 'PENDING',
    },
    {
      id: 'OPP-103',
      type: 'UPSELL',
      title: 'Post-Purchase Accessory Cross-Sell',
      customerName: 'Vikram Patel',
      language: 'Hinglish',
      confidenceScore: 91,
      estimatedValue: '₹1,299',
      detectedContext: 'Customer ordered Wireless Noise-Cancelling Headphones 2 hours ago.',
      suggestedAction: 'Recommend Hard-Shell Travel Case & Fast Charger combo',
      recommendedProduct: 'Pro Audio Noise-Cancelling Headphones',
      image: '/product_headphones_item.jpg',
      status: 'PENDING',
    },
    {
      id: 'OPP-104',
      type: 'DEMAND',
      title: 'High Stock Demand Spike — 128GB Storage Edition',
      customerName: 'Multiple Inquiries (8 Users)',
      language: 'Hinglish / Hindi',
      confidenceScore: 96,
      estimatedValue: '₹34,500',
      detectedContext: '8 voice conversations requested 128GB stock availability in North Zone.',
      suggestedAction: 'Notify Inventory Intelligence Agent & allocate local warehouse stock',
      recommendedProduct: '5G Smartphone 128GB Variant',
      image: '/product_smartphone_item.jpg',
      status: 'PENDING',
    },
    {
      id: 'OPP-105',
      type: 'RE_ENGAGEMENT',
      title: 'High LTV Customer Re-engagement Opportunity',
      customerName: 'Sunita Gupta',
      language: 'Hindi',
      confidenceScore: 87,
      estimatedValue: '₹28,000',
      detectedContext: 'Client hasn\'t placed a re-order in 35 days. Expressed interest in new festive catalog.',
      suggestedAction: 'Trigger Voice AI Re-engagement Call with exclusive early access catalog',
      recommendedProduct: 'Festive Enterprise Cloud Storage Vault',
      image: '/product_cloud_storage.jpg',
      status: 'PENDING',
    },
  ]);

  const handleAction = (id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'ACTIONED' } : o))
    );
  };

  const filteredOpps = opportunities.filter((o) => {
    if (filterType === 'ALL') return true;
    return o.type === filterType;
  });

  const getTypeBadge = (type: Opportunity['type']) => {
    switch (type) {
      case 'HIGH_INTENT':
        return { label: 'High Intent', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'RECOVERY':
        return { label: 'Cart Recovery', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'UPSELL':
        return { label: 'Upsell / Cross-sell', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'DEMAND':
        return { label: 'Demand Surge', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'RE_ENGAGEMENT':
        return { label: 'Re-engagement', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40">
              AI Growth Engine
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">AI Opportunity Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time intent detection, abandoned inquiry recovery, and high-value upsell triggers
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Button
            size="sm"
            variant={filterType === 'ALL' ? 'default' : 'outline'}
            onClick={() => setFilterType('ALL')}
            className={`text-xs h-8 ${filterType === 'ALL' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'border-slate-800 text-slate-400'}`}
          >
            All ({opportunities.length})
          </Button>
          <Button
            size="sm"
            variant={filterType === 'HIGH_INTENT' ? 'default' : 'outline'}
            onClick={() => setFilterType('HIGH_INTENT')}
            className={`text-xs h-8 ${filterType === 'HIGH_INTENT' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'border-slate-800 text-slate-400'}`}
          >
            High Intent
          </Button>
          <Button
            size="sm"
            variant={filterType === 'RECOVERY' ? 'default' : 'outline'}
            onClick={() => setFilterType('RECOVERY')}
            className={`text-xs h-8 ${filterType === 'RECOVERY' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'border-slate-800 text-slate-400'}`}
          >
            Recovery
          </Button>
          <Button
            size="sm"
            variant={filterType === 'UPSELL' ? 'default' : 'outline'}
            onClick={() => setFilterType('UPSELL')}
            className={`text-xs h-8 ${filterType === 'UPSELL' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'border-slate-800 text-slate-400'}`}
          >
            Upsell
          </Button>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {filteredOpps.map((opp) => {
          const badge = getTypeBadge(opp.type);
          const isActioned = opp.status === 'ACTIONED';

          return (
            <div
              key={opp.id}
              className={`rounded-2xl border p-5 transition-all duration-200 ${
                isActioned
                  ? 'border-emerald-900/40 bg-emerald-950/10 opacity-75'
                  : 'border-slate-800 bg-slate-900/60 hover:border-purple-500/40'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Product Item Image Thumbnail */}
                <div className="relative size-24 md:size-28 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shrink-0 shadow-lg">
                  <img
                    src={opp.image}
                    alt={opp.recommendedProduct}
                    className="size-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur text-[9px] font-mono text-purple-300 border border-slate-800">
                    Catalogue Item
                  </span>
                </div>

                {/* Main Opportunity Text & Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-mono text-purple-400">{opp.id}</span>
                    <span className="text-xs text-slate-400">• Customer: <strong className="text-white">{opp.customerName}</strong></span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">{opp.language}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{opp.title}</h3>

                  <p className="text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                    <strong className="text-purple-300">Detected Context:</strong> {opp.detectedContext}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    <div>
                      <span className="text-slate-500">Target Product: </span>
                      <span className="font-semibold text-purple-300">{opp.recommendedProduct}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Confidence: </span>
                      <span className="font-bold text-emerald-400">{opp.confidenceScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Right Value & Action */}
                <div className="flex flex-col items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-5 min-w-[200px]">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">Estimated Opportunity</span>
                    <div className="text-2xl font-extrabold text-emerald-400">{opp.estimatedValue}</div>
                  </div>

                  {isActioned ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60">
                      <CheckCircle2 className="size-4" />
                      <span>Trigger Executed</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleAction(opp.id)}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl px-4 py-2 w-full gap-2"
                    >
                      <span>Trigger AI Action</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Bottom Suggested Action banner */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="size-3.5 text-amber-400" />
                  <strong>Suggested Action:</strong> {opp.suggestedAction}
                </span>
                <span className="text-[11px] text-slate-500">AI Confidence Matrix Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
