'use client';

import { useState } from 'react';
import { useSessionContext } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { DashboardHeader } from '@/components/app/dashboard-header';
import { DashboardSidebar, type DashboardTab } from '@/components/app/dashboard-sidebar';
import { ExecutiveOverview } from '@/components/app/executive-overview';
import { ProductCatalogue } from '@/components/app/product-catalogue';
import { OpportunityCenter } from '@/components/app/opportunity-center';
import { CustomerIntelligence } from '@/components/app/customer-intelligence';
import { AgentControlCenter } from '@/components/app/agent-control-center';
import { GrowthAutomations } from '@/components/app/growth-automations';
import { CopilotModal } from '@/components/app/copilot-modal';
import { AuditTrailView } from '@/components/app/audit-trail-view';
import { JudgeDemoView } from '@/components/app/judge-demo-view';
import { LanguageMode } from '@/lib/translations';

interface DashboardViewProps {
  appConfig: AppConfig;
}

export function DashboardView({ appConfig }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [language, setLanguage] = useState<LanguageMode>('hinglish');
  const { isConnected } = useSessionContext();

  const handleOpenCopilotWithPrompt = (prompt?: string) => {
    setActiveTab('copilot');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ExecutiveOverview
            onOpenOpportunityCenter={() => setActiveTab('opportunities')}
            onOpenCopilot={() => setActiveTab('copilot')}
            onOpenJudgeDemo={() => setActiveTab('judge-demo')}
            isHinglish={language === 'hi' || language === 'hinglish'}
          />
        );
      case 'judge-demo':
        return <JudgeDemoView onNavigateToTab={(tab) => setActiveTab(tab as DashboardTab)} />;
      case 'catalogue':
        return (
          <ProductCatalogue
            onOpenCopilot={handleOpenCopilotWithPrompt}
            lang={language}
          />
        );
      case 'opportunities':
        return <OpportunityCenter />;
      case 'customers':
        return <CustomerIntelligence />;
      case 'agents':
        return <AgentControlCenter />;
      case 'automations':
        return <GrowthAutomations />;
      case 'audit':
        return <AuditTrailView />;
      case 'copilot':
      default:
        return (
          <CopilotModal
            appConfig={appConfig}
            language={language}
            isHinglish={language === 'hi' || language === 'hinglish'}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0F17] text-slate-100 font-sans">
      <DashboardHeader
        onOpenCopilot={() => setActiveTab('copilot')}
        onOpenJudgeDemo={() => setActiveTab('judge-demo')}
        isConnected={isConnected}
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          opportunityCount={5}
          language={language}
        />

        <main className="flex-1 overflow-y-auto bg-[#0B0F17]/90 min-h-[calc(100vh-4rem)]">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
