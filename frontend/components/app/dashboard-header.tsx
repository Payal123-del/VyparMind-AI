'use client';

import { Sparkles, Bot, PhoneCall, Search, Zap, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageMode, TRANSLATIONS } from '@/lib/translations';

interface DashboardHeaderProps {
  onOpenCopilot: () => void;
  isConnected: boolean;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
}

export function DashboardHeader({
  onOpenCopilot,
  isConnected,
  language,
  onLanguageChange,
}: DashboardHeaderProps) {
  const t = TRANSLATIONS[language];

  return (
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
              <Zap className="size-3 text-purple-400" /> Commerce OS
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous AI Commerce & Custom Customer Intelligence
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-1.5 text-xs text-slate-400 w-72">
        <Search className="size-4 text-slate-500" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          className="bg-transparent text-slate-200 placeholder:text-slate-500 outline-none w-full"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
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

        {/* Engine Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-xs font-medium text-emerald-400">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
          </span>
          {t.engineActive}
        </div>

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
  );
}
