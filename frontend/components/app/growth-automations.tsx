'use client';

import { useState } from 'react';
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  BellRing,
  ShoppingCart,
  RotateCcw,
  Sparkles,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  aiAction: string;
  expectedOutcome: string;
  status: boolean;
  successCount: number;
  revenueGenerated: string;
}

export function GrowthAutomations() {
  const [flows, setFlows] = useState<AutomationFlow[]>([
    {
      id: 'AUTO-01',
      name: 'Abandoned Inquiry Hinglish Voice Re-engagement',
      trigger: 'Customer drops off during catalogue pricing inquiry without checkout',
      aiAction: 'Trigger Autonomous Recovery Agent via voice call with 10% instant promo code',
      expectedOutcome: '+22% Recovery Rate & ₹45,000 monthly revenue boost',
      status: true,
      successCount: 142,
      revenueGenerated: '₹1,12,400',
    },
    {
      id: 'AUTO-02',
      name: 'High Intent Purchase Spike Alert',
      trigger: 'Customer intent score exceeds 90 during product spec discussion',
      aiAction: 'Instantly generate high-intent opportunity card & dispatch priority checkout link',
      expectedOutcome: 'Shorten sales cycle by 65% and capture instant purchase',
      status: true,
      successCount: 312,
      revenueGenerated: '₹2,45,000',
    },
    {
      id: 'AUTO-03',
      name: 'Post-Purchase Accessory Cross-Sell Engine',
      trigger: 'Order confirmed for primary hardware / smartphone item',
      aiAction: 'Schedule follow-up recommendation for compatible accessories within 2 hours',
      expectedOutcome: '+18% Average Order Value (AOV) increase',
      status: true,
      successCount: 89,
      revenueGenerated: '₹34,800',
    },
    {
      id: 'AUTO-04',
      name: 'Low Stock Demand Re-allocation Alert',
      trigger: 'Voice queries for specific product variant exceed 5 per hour',
      aiAction: 'Alert Inventory Intelligence Agent & allocate local warehouse reserve stock',
      expectedOutcome: 'Zero lost revenue due to stockouts',
      status: true,
      successCount: 45,
      revenueGenerated: '₹93,000',
    },
  ]);

  const toggleFlow = (id: string) => {
    setFlows((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: !f.status } : f))
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40">
              Autonomous Workflows
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">Growth Automations</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated event triggers, AI execution rules, and conversion tracking pipelines
          </p>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl gap-2">
          <Plus className="size-4" />
          Create New Rule
        </Button>
      </div>

      {/* List of Workflow Cards */}
      <div className="space-y-4">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className={`rounded-2xl border p-5 transition-all duration-200 ${
              flow.status
                ? 'border-slate-800 bg-slate-900/60 hover:border-purple-500/40'
                : 'border-slate-800/60 bg-slate-950/40 opacity-60'
            }`}
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400">
                  <Zap className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{flow.name}</h3>
                  <span className="text-xs font-mono text-purple-400">{flow.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Revenue Generated</span>
                  <div className="font-bold text-emerald-400">{flow.revenueGenerated}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleFlow(flow.id)}
                  className={`text-xs h-8 border ${
                    flow.status
                      ? 'border-purple-800/60 bg-purple-950/40 text-purple-300'
                      : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  {flow.status ? 'ACTIVE' : 'PAUSED'}
                </Button>
              </div>
            </div>

            {/* Workflow Pipeline Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">1. Trigger Event</span>
                <p className="text-slate-200 font-medium">{flow.trigger}</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 space-y-1">
                <span className="text-[10px] font-semibold text-purple-400 uppercase">2. AI Execution</span>
                <p className="text-slate-200 font-medium">{flow.aiAction}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
                <span className="text-[10px] font-semibold text-emerald-400 uppercase">3. Measured Outcome</span>
                <p className="text-slate-200 font-medium">{flow.expectedOutcome}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
