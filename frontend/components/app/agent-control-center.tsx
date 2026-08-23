'use client';

import { useState } from 'react';
import {
  Bot,
  Zap,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentConfig {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'STANDBY' | 'LEARNING';
  purpose: string;
  currentTask: string;
  conversationsHandled: number;
  successRate: string;
  revenueInfluenced: string;
  escalationRate: string;
  languageCapabilities: string[];
}

export function AgentControlCenter() {
  const [agents, setAgents] = useState<AgentConfig[]>([
    {
      id: 'AGENT-01',
      name: 'Anisha — Commerce Growth Agent',
      role: 'Voice Sales & Catalogue Guidance',
      status: 'ACTIVE',
      purpose: 'Engages customers in Hinglish/English/Hindi voice calls to recommend products, answer specs, and drive high-intent conversion.',
      currentTask: 'Handling sub-15k smartphone buyer inquiry session',
      conversationsHandled: 1240,
      successRate: '94.2%',
      revenueInfluenced: '₹3,42,800',
      escalationRate: '3.1%',
      languageCapabilities: ['Hinglish', 'English', 'Hindi'],
    },
    {
      id: 'AGENT-02',
      name: 'Revenue Recovery Specialist',
      role: 'Abandoned Inquiry & Cart Recovery',
      status: 'ACTIVE',
      purpose: 'Autonomously identifies abandoned customer sessions, triggers targeted follow-ups, and delivers personalized incentives.',
      currentTask: 'Sending 10% coupon follow-up for Cloud Storage 2TB tier',
      conversationsHandled: 480,
      successRate: '88.5%',
      revenueInfluenced: '₹1,12,400',
      escalationRate: '2.4%',
      languageCapabilities: ['English', 'Hinglish'],
    },
    {
      id: 'AGENT-03',
      name: 'Support & Resolution Agent',
      role: 'Order FAQs & Account Policy Assistant',
      status: 'ACTIVE',
      purpose: 'Resolves standard shipping, warranty, and account queries without human intervention while strictly enforcing guardrails.',
      currentTask: 'Answering warranty claim policy FAQ',
      conversationsHandled: 910,
      successRate: '96.8%',
      revenueInfluenced: '₹30,000',
      escalationRate: '1.8%',
      languageCapabilities: ['Hinglish', 'English', 'Hindi'],
    },
    {
      id: 'AGENT-04',
      name: 'Inventory Intelligence Analyst',
      role: 'Demand & Stock Alert Specialist',
      status: 'ACTIVE',
      purpose: 'Monitors customer voice inquiry spikes, alerts inventory ops to stock shortages, and suggests region allocation.',
      currentTask: 'Monitoring North Zone 128GB storage edition demand spike',
      conversationsHandled: 320,
      successRate: '92.0%',
      revenueInfluenced: '₹85,000',
      escalationRate: '0.9%',
      languageCapabilities: ['Hinglish', 'English'],
    },
  ]);

  const toggleAgentStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'ACTIVE' ? 'STANDBY' : 'ACTIVE' }
          : a
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40">
            Autonomous Fleet
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white">AI Agent Control Center</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Monitor and manage your autonomous commerce growth agents, execution parameters, and performance stats
        </p>
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const isActive = agent.status === 'ACTIVE';

          return (
            <div
              key={agent.id}
              className={`rounded-2xl border p-6 space-y-5 transition-all duration-200 ${
                isActive
                  ? 'border-slate-800 bg-slate-900/60 hover:border-purple-500/40'
                  : 'border-slate-800/60 bg-slate-950/40 opacity-70'
              }`}
            >
              {/* Agent Title & Status */}
              <div className="flex items-start justify-between gap-4">
                  {agent.id === 'AGENT-01' ? (
                    <div className="relative size-11 rounded-xl overflow-hidden border border-purple-500 shadow-md shadow-purple-500/20 shrink-0">
                      <img
                        src="/anisha_copilot_avatar.jpg"
                        alt="Anisha AI Avatar"
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400 shrink-0">
                      <Bot className="size-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-white">{agent.name}</h3>
                    <p className="text-xs font-medium text-slate-400">{agent.role}</p>
                  </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleAgentStatus(agent.id)}
                  className={`text-xs h-8 border ${
                    isActive
                      ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'
                      : 'border-amber-800/60 bg-amber-950/40 text-amber-400 hover:bg-amber-900/60'
                  }`}
                >
                  <span className="size-2 rounded-full mr-2 animate-pulse bg-current" />
                  {agent.status}
                </Button>
              </div>

              {/* Purpose & Current Task */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-300">{agent.purpose}</p>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-2">
                    <Activity className="size-3.5 text-purple-400 animate-spin" />
                    <strong className="text-slate-200">Current Task:</strong> {agent.currentTask}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Sessions</span>
                  <div className="font-bold text-white mt-0.5">{agent.conversationsHandled}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Success</span>
                  <div className="font-bold text-emerald-400 mt-0.5">{agent.successRate}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Revenue</span>
                  <div className="font-bold text-purple-300 mt-0.5">{agent.revenueInfluenced}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Escalation</span>
                  <div className="font-bold text-slate-400 mt-0.5">{agent.escalationRate}</div>
                </div>
              </div>

              {/* Languages */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-slate-400">
                <span>Multilingual Support:</span>
                <div className="flex gap-1.5">
                  {agent.languageCapabilities.map((lang, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
