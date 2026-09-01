'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Target,
  Zap,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Quote,
  Flame,
  CreditCard,
  Layers,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  revenueAttributionService,
  type AttributionMetrics,
  type TransactionRecord,
} from '@/lib/commerce/revenue-attribution';

interface ExecutiveOverviewProps {
  onOpenOpportunityCenter: () => void;
  onOpenCopilot: () => void;
  onOpenJudgeDemo?: () => void;
  isHinglish?: boolean;
}

export function ExecutiveOverview({
  onOpenOpportunityCenter,
  onOpenCopilot,
  onOpenJudgeDemo,
  isHinglish = false,
}: ExecutiveOverviewProps) {
  const [metricsData, setMetricsData] = useState<AttributionMetrics>(
    revenueAttributionService.getMetrics()
  );
  const [recentTxns, setRecentTxns] = useState<TransactionRecord[]>(
    revenueAttributionService.getRecentTransactions()
  );

  useEffect(() => {
    const unsubscribe = revenueAttributionService.subscribe((metrics, txns) => {
      setMetricsData(metrics);
      setRecentTxns(txns);
    });
    return () => unsubscribe();
  }, []);

  const metrics = [
    {
      title: isHinglish ? 'Total Influenced Kamai' : 'Gross Revenue',
      value: `₹${metricsData.grossRevenue.toLocaleString('en-IN')}`,
      change: '+24.2%',
      isPositive: true,
      description: isHinglish
        ? 'AI Voice aur Chat se generated sales'
        : 'Total conversational & store sales volume',
      icon: DollarSign,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: isHinglish ? 'AI Direct Checkout Kamai' : 'AI Direct Revenue',
      value: `₹${metricsData.aiDirectRevenue.toLocaleString('en-IN')}`,
      change: '+31.8%',
      isPositive: true,
      description: isHinglish
        ? 'Autonomous AI Buyer & Copilot checkout sales'
        : 'Direct revenue converted via AI agent checkouts',
      icon: Zap,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: isHinglish ? 'AI Assisted Orders' : 'AI Assisted Orders',
      value: metricsData.assistedOrdersCount.toLocaleString('en-IN'),
      change: '+18.5%',
      isPositive: true,
      description: isHinglish
        ? 'AI Copilot aur Agent se final hue orders'
        : 'Orders finalized with AI Copilot & Agents',
      icon: ShoppingCart,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: isHinglish ? 'Recovered Lost Revenue' : 'Recovered Revenue',
      value: `₹${metricsData.recoveredRevenue.toLocaleString('en-IN')}`,
      change: '+15.2%',
      isPositive: true,
      description: isHinglish
        ? 'Chhute hue customer inquiries se wapas mili kamai'
        : 'Recovered from abandoned inquiries via Recovery Agent',
      icon: CheckCircle2,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20',
    },
    {
      title: isHinglish ? 'Upsell & Cross-Sell Kamai' : 'Upsell / Cross-Sell Revenue',
      value: `₹${metricsData.upsellRevenue.toLocaleString('en-IN')}`,
      change: '+22.4%',
      isPositive: true,
      description: isHinglish
        ? 'Compatible accessories aur bundle recommendations'
        : 'Incremental value from intelligent accessory bundling',
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: isHinglish ? 'Razorpay Test Transactions' : 'Razorpay Test Volume',
      value: `₹${metricsData.razorpayTestVolume.toLocaleString('en-IN')}`,
      change: `${metricsData.razorpayTestTransactionsCount} test orders`,
      isPositive: true,
      description: isHinglish
        ? 'Verified Razorpay Test Mode transactions'
        : 'Verified Razorpay Test Mode settlements',
      icon: CreditCard,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
  ];

  const recentConversations = [
    {
      id: 'CONV-9402',
      customer: 'Rajesh Sharma',
      intent: isHinglish ? 'High Intent — Sub-15k 5G Phone Inquiry' : 'High Intent — Smartphone < ₹15k',
      language: 'Hinglish',
      agent: 'Commerce Growth Agent (Anisha)',
      value: '₹15,498',
      status: isHinglish ? 'Razorpay Paid' : 'Razorpay Verified',
      time: 'Just now',
    },
    {
      id: 'CONV-9401',
      customer: 'Ananya Verma',
      intent: isHinglish ? 'Chhuta hua Cart Inquiry — 2TB Plan' : 'Abandoned Cart Inquiry',
      language: 'English',
      agent: 'Recovery Specialist',
      value: '₹4,249',
      status: isHinglish ? 'Recovered (₹4,249)' : 'Recovered (₹4,249)',
      time: '12 mins ago',
    },
    {
      id: 'CONV-9400',
      customer: 'Vikram Patel',
      intent: isHinglish ? 'Accessory Cross-Sell Suggestion' : 'Accessory Upsell Recommendation',
      language: 'Hinglish',
      agent: 'Commerce Growth Agent',
      value: '₹3,149',
      status: isHinglish ? 'Upsell Converted' : 'Upsell Converted',
      time: '25 mins ago',
    },
    {
      id: 'CONV-9399',
      customer: 'Sunita Gupta',
      intent: isHinglish ? 'Warranty aur Delivery Question' : 'Product Warranty FAQ',
      language: 'Hindi',
      agent: 'Support Specialist',
      value: '₹0',
      status: isHinglish ? 'Resolved' : 'Resolved',
      time: '41 mins ago',
    },
  ];

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-300">
      {/* Brand Hero Banner Image & Compulsory Quote */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-slate-950 shadow-2xl shadow-purple-950/40 hover:border-purple-500/60 transition-all duration-300 group">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700">
          <img
            src="/vyaparmind_hero_banner.jpg"
            alt="VyaparMind AI Banner"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/anisha_copilot_avatar.jpg';
            }}
            className="size-full object-cover object-center"
          />
        </div>

        <div className="relative z-10 p-6 md:p-8 space-y-4 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/90 to-purple-950/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="size-3.5 text-purple-400" />
              {isHinglish ? 'Autonomous Commerce & Business OS' : 'Autonomous Commerce Growth Engine'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center gap-1">
              <CreditCard className="size-3" />
              Razorpay Test Mode Active
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {isHinglish
                ? 'Har Customer Baatchaat ko Banaayein Vyapaar ki Nayi Kamai'
                : 'Turn Every Customer Conversation Into Autonomous Revenue Growth'}
            </h2>

            {/* Compulsory Quote */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-950/40 border border-purple-800/50 backdrop-blur-sm text-slate-200 text-xs md:text-sm shadow-inner">
              <Quote className="size-5 text-purple-400 shrink-0 mt-0.5" />
              <p className="italic font-medium leading-relaxed">
                {isHinglish
                  ? '"Bina AI assistance ke chhuti har customer inquiry lost revenue hai. VyaparMind AI karta hai 100% customer intent ko instant sales aur 24/7 revenue growth mein convert."'
                  : '"Every unassisted customer inquiry is lost revenue. VyaparMind AI captures 100% of customer intent, turning conversations into instant sales and 24/7 revenue velocity."'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onOpenJudgeDemo && (
              <Button
                onClick={onOpenJudgeDemo}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-extrabold rounded-xl px-5 py-2.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all gap-1.5"
              >
                <Flame className="size-4 fill-slate-950 text-slate-950" />
                Launch 14-Step Judge Demo
              </Button>
            )}

            <Button
              onClick={onOpenOpportunityCenter}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl px-5 py-2.5 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
            >
              <Sparkles className="size-4 mr-2 text-purple-200" />
              {isHinglish ? '312 Growth Opportunities Dekhein' : 'Explore 312 Growth Opportunities'}
            </Button>
          </div>
        </div>
      </div>

      {/* Dataset Separation Notice */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-400" />
          <span>
            Dataset Transparency: <strong>Demo / Simulated Baseline</strong> is separated from <strong>Razorpay Test Transactions</strong>.
          </span>
        </div>
        <span suppressHydrationWarning className="text-[11px] font-mono text-purple-300">
          Last live sync: {metricsData.lastUpdated}
        </span>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{m.title}</span>
                <div className={`p-2 rounded-xl border ${m.bg}`}>
                  <Icon className={`size-4 ${m.color}`} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-white">{m.value}</span>
                  <span className="flex items-center text-xs font-semibold text-emerald-400">
                    <ArrowUpRight className="size-3 mr-0.5" />
                    {m.change}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{m.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Chart & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Visualization */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {isHinglish ? 'Weekly AI Kamai Velocity' : 'AI-Influenced Revenue Velocity'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHinglish
                  ? 'Autonomous AI voice aur chat se hui hafte var ki growth'
                  : 'Weekly autonomous revenue growth and recovery trajectory'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="size-2.5 rounded-full bg-purple-500"></span> Organic
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <span className="size-2.5 rounded-full bg-emerald-400"></span> AI Direct & Assisted
              </span>
            </div>
          </div>

          {/* SVG Trend Graph */}
          <div className="h-48 w-full flex items-end justify-between gap-2 pt-4 px-2">
            {[
              { day: 'Mon', organic: 35, ai: 65, total: '₹48k' },
              { day: 'Tue', organic: 40, ai: 72, total: '₹55k' },
              { day: 'Wed', organic: 45, ai: 85, total: '₹64k' },
              { day: 'Thu', organic: 50, ai: 95, total: '₹72k' },
              { day: 'Fri', organic: 55, ai: 110, total: '₹89k' },
              { day: 'Sat', organic: 60, ai: 130, total: '₹98k' },
              { day: 'Sun', organic: 65, ai: 145, total: '₹107k' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full bg-slate-800/80 rounded-t-lg overflow-hidden flex flex-col justify-end h-36 relative group-hover:border group-hover:border-purple-500/50 transition-all">
                  <div
                    style={{ height: `${(bar.ai / 150) * 100}%` }}
                    className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-sm"
                  />
                  <div
                    style={{ height: `${(bar.organic / 150) * 100}%` }}
                    className="w-full bg-emerald-500/80"
                  />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-[10px] font-mono text-purple-300 px-1.5 py-0.5 rounded shadow">
                    {bar.total}
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Card */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/30 to-slate-900/80 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">
              {isHinglish ? 'AI Smart Recommendations' : 'Autonomous Recommendations'}
            </h3>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-purple-800/40 bg-purple-950/40 text-xs space-y-1.5">
              <span className="font-semibold text-purple-300">Smartphones & Accessories Bundle</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isHinglish
                  ? 'Sub-15k mobile demand high hai. Automatic 67W fast charger cross-sell se weekly ₹18,500 extra revenue add ho sakti hai.'
                  : 'High demand detected for sub-₹15k phones. Bundling 67W fast charger cross-sell adds estimated ₹18,500 weekly revenue.'}
              </p>
              <Button
                size="sm"
                onClick={onOpenOpportunityCenter}
                className="mt-2 h-7 bg-purple-600 hover:bg-purple-500 text-[11px] w-full rounded-lg"
              >
                {isHinglish ? 'Action Apply Karein' : 'Apply Recommendation'}
              </Button>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs space-y-1.5">
              <span className="font-semibold text-emerald-400">Abandoned Inquiry Alert</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isHinglish
                  ? '14 customers checkout se exit hue. Automatic Hinglish voice follow-up active hai with 10% coupon.'
                  : '14 customers dropped off during payment terms inquiry. Triggering Hinglish voice follow-up script.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Live Commerce Conversations */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {isHinglish ? 'Live Customer Baatchaat Feed' : 'Live Conversation Intelligence'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHinglish
                ? 'Real-time customer intent tracking aur agent response'
                : 'Real-time customer intent classification and agent intervention'}
            </p>
          </div>
          <Button
            onClick={onOpenCopilot}
            variant="outline"
            className="text-xs border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl"
          >
            <MessageSquare className="size-3.5 mr-2 text-purple-400" />
            {isHinglish ? 'Live Copilot Session Join Karein' : 'Join Active Copilot Session'}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="pb-3 px-3">Session ID</th>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Detected Intent</th>
                <th className="pb-3 px-3">Language</th>
                <th className="pb-3 px-3">Assigned Agent</th>
                <th className="pb-3 px-3">Value</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentConversations.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-purple-400">{row.id}</td>
                  <td className="py-3 px-3 font-semibold text-white">{row.customer}</td>
                  <td className="py-3 px-3 font-medium text-slate-200">{row.intent}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                      {row.language}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{row.agent}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-400">{row.value}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-[10px] font-semibold text-purple-300">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
