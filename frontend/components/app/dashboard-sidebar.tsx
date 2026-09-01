'use client';

import {
  LayoutDashboard,
  ShoppingBag,
  Target,
  Users,
  Bot,
  Zap,
  Mic,
  ShieldCheck,
  Flame,
  ListFilter,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/shadcn/utils';
import { LanguageMode, TRANSLATIONS } from '@/lib/translations';

export type DashboardTab =
  | 'overview'
  | 'catalogue'
  | 'opportunities'
  | 'customers'
  | 'agents'
  | 'automations'
  | 'audit'
  | 'judge-demo'
  | 'copilot';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  opportunityCount?: number;
  language?: LanguageMode;
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  opportunityCount = 5,
  language = 'hinglish',
}: DashboardSidebarProps) {
  const t = TRANSLATIONS[language];

  const navItems = [
    {
      id: 'overview' as DashboardTab,
      label: t.navExecutiveOverview,
      icon: LayoutDashboard,
    },
    {
      id: 'judge-demo' as DashboardTab,
      label: t.navJudgeDemo,
      icon: Flame,
      badge: 'Judge Flow',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse',
    },
    {
      id: 'catalogue' as DashboardTab,
      label: t.navProductCatalogue,
      icon: ShoppingBag,
      badge: '24',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    {
      id: 'opportunities' as DashboardTab,
      label: t.navOpportunityCenter,
      icon: Target,
      badge: `+${opportunityCount}`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
    {
      id: 'customers' as DashboardTab,
      label: t.navCustomerIntelligence,
      icon: Users,
    },
    {
      id: 'agents' as DashboardTab,
      label: t.navAgentControlCenter,
      icon: Bot,
    },
    {
      id: 'automations' as DashboardTab,
      label: t.navGrowthAutomations,
      icon: Zap,
    },
    {
      id: 'audit' as DashboardTab,
      label: t.navAuditTrail,
      icon: Activity,
      badge: 'Live',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'copilot' as DashboardTab,
      label: t.navCopilotRoom,
      icon: Mic,
      badge: 'Voice',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0B0F17] flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Growth OS Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold shadow-sm shadow-purple-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'size-4',
                        isActive ? 'text-purple-400' : 'text-slate-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'px-2 py-0.5 text-[10px] rounded-full border font-semibold',
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            System & Trust
          </p>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>{t.navZeroHallucination}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Active boundaries: Real-time catalogue match & code-mixing verification.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span>VyaparMind v2.4</span>
          </div>
          <span className="text-[10px] text-slate-500">Enterprise</span>
        </div>
      </div>
    </aside>
  );
}
