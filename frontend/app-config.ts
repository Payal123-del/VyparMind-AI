export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;

  audioVisualizerType?: 'bar' | 'wave' | 'grid' | 'radial' | 'aura';
  audioVisualizerColor?: `#${string}`;
  audioVisualizerColorDark?: `#${string}`;
  audioVisualizerColorShift?: number;
  audioVisualizerBarCount?: number;
  audioVisualizerGridRowCount?: number;
  audioVisualizerGridColumnCount?: number;
  audioVisualizerRadialBarCount?: number;
  audioVisualizerRadialRadius?: number;
  audioVisualizerWaveLineWidth?: number;

  // agent dispatch configuration
  agentName?: string;

  // LiveKit Cloud Sandbox configuration
  sandboxId?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'VyaparMind AI',
  pageTitle: 'VyaparMind AI — Autonomous Commerce Growth & Conversation Intelligence',
  pageDescription: 'Turn every customer conversation into a revenue growth opportunity with AI Commerce Copilot',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  logo: '/vyaparmind-logo.svg',
  accent: '#7C3AED',
  logoDark: '/vyaparmind-logo-dark.svg',
  accentDark: '#8B5CF6',
  startButtonText: 'Launch Commerce Copilot',

  // agent dispatch configuration
  agentName: process.env.NEXT_PUBLIC_AGENT_NAME ?? process.env.AGENT_NAME ?? 'my-agent',

  // LiveKit Cloud Sandbox configuration
  sandboxId: undefined,
};
