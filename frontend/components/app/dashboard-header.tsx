'use client';

import { useState } from 'react';
import {
  Sparkles,
  Bot,
  PhoneCall,
  Search,
  Zap,
  Flame,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Activity,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageMode, TRANSLATIONS } from '@/lib/translations';

interface DashboardHeaderProps {
  onOpenCopilot: () => void;
  onOpenJudgeDemo?: () => void;
  isConnected: boolean;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
}

export function DashboardHeader({
  onOpenCopilot,
  onOpenJudgeDemo,
  isConnected,
  language,
  onLanguageChange,
}: DashboardHeaderProps) {
  const t = TRANSLATIONS[language];
  const [showHealthModal, setShowHealthModal] = useState<boolean>(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#0B0F17]/90 px-6 backdrop-blur-md">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-lg shadow-purple-500/20">
            <Bot className="size-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">VyaparMind AI</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-950/80 px-2 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-800/60">
                <Zap className="size-3 text-purple-400" /> Agentic Commerce OS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Revenue Growth & Verified Razorpay Commerce
            </p>
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-1.5 text-xs text-slate-400 w-64">
          <Search className="size-4 text-slate-500" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="bg-transparent text-slate-200 placeholder:text-slate-500 outline-none w-full"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Razorpay Test Mode Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-800/50 text-[11px] font-semibold text-blue-300">
            <CreditCard className="size-3 text-blue-400" />
            <span>Razorpay Test Mode</span>
          </div>

          {/* System Health Trigger */}
          <button
            onClick={() => setShowHealthModal(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-xs font-medium text-emerald-400 hover:bg-emerald-900/40 transition-all"
            title="View System Health"
          >
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
            </span>
            <span>Health ● Online</span>
          </button>

          {/* Tri-Lingual Language Selector Switch */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 gap-1 text-xs">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                language === 'en'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to English"
            >
              🇬🇧 EN
            </button>

            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                language === 'hi'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="हिंदी में बदलें"
            >
              🇮🇳 हिंदी
            </button>

            <button
              onClick={() => onLanguageChange('hinglish')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                language === 'hinglish'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Hinglish"
            >
              ⚡ Hinglish
            </button>
          </div>

          {/* JUDGE DEMO Quick Action Button */}
          {onOpenJudgeDemo && (
            <Button
              onClick={onOpenJudgeDemo}
              className="gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20"
            >
              <Flame className="size-4 fill-slate-950 text-slate-950" />
              <span>JUDGE DEMO</span>
            </Button>
          )}

          {/* Copilot Action Button */}
          <Button
            onClick={onOpenCopilot}
            className={`gap-2 rounded-xl px-4 text-xs font-semibold shadow-lg transition-all duration-200 ${
              isConnected
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25'
            }`}
          >
            {isConnected ? (
              <>
                <PhoneCall className="size-4 animate-pulse text-white" />
                <span>Copilot Active</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-purple-200" />
                <span>{t.startCopilot}</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* System Health Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">System Health & Architecture Status</h3>
              </div>
              <button
                onClick={() => setShowHealthModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-slate-200">AI Commerce Copilot</span>
                </div>
                <span className="text-emerald-400 font-mono font-medium">Google Gemini + Murf Falcon (Online)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-slate-200">Structured Catalog</span>
                </div>
                <span className="text-emerald-400 font-mono font-medium">24 SKUs Verified (Zero Hallucination)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-slate-200">Agent Action Policy Engine</span>
                </div>
                <span className="text-emerald-400 font-mono font-medium">Bound: ₹25,000 / Discount: ≤15%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-blue-400" />
                  <span className="font-semibold text-slate-200">Razorpay Test Gateway</span>
                </div>
                <span className="text-blue-400 font-mono font-medium">Test Mode Active (HMAC-SHA256)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-slate-200">Webhook Processor</span>
                </div>
                <span className="text-emerald-400 font-mono font-medium">Idempotency & Replay Cache Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-slate-200">Revenue Attribution Engine</span>
                </div>
                <span className="text-emerald-400 font-mono font-medium">Direct vs Influenced Tracking</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Button
                onClick={() => setShowHealthModal(false)}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold"
              >
                Close Health Monitor
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
