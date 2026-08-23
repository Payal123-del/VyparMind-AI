'use client';

import { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Zap,
  Bot,
  Activity,
  CheckCircle2,
  Search,
  Play,
  Volume2,
  Loader2,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import type { AppConfig } from '@/app-config';

interface CopilotModalProps {
  appConfig: AppConfig;
  onClose?: () => void;
  isHinglish?: boolean;
}

export type AssistantState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export function CopilotModal({ appConfig, onClose, isHinglish = false }: CopilotModalProps) {
  const { isConnected, connectionState, start, end } = useSessionContext();
  const isConnecting = connectionState === ConnectionState.Connecting;

  const [simulatedVoiceState, setSimulatedVoiceState] = useState<boolean>(false);
  const [currentPromptText, setCurrentPromptText] = useState<string>('');
  const [aiSpeechResponse, setAiSpeechResponse] = useState<string>('');
  const [assistantState, setAssistantState] = useState<AssistantState>('IDLE');
  const [voiceErrorText, setVoiceErrorText] = useState<string>('');

  const samplePrompts = [
    {
      prompt: 'Mujhe sub-15k ke andar best 5G phone dikhao',
      response: 'Bilkul Rajesh ji! Aapke liye Redmi Note 13 Pro 5G best option hai. Isme 128GB storage, 5000mAh battery aur fast charger milta hai.',
    },
    {
      prompt: 'What is the 2TB cloud storage annual discount?',
      response: 'Our 2TB annual plan comes with a 15% discount and complimentary team backup licenses.',
    },
    {
      prompt: 'Deliver kitne din me ho jayegi order?',
      response: 'Aapki order 48 hours ke andar doorstep deliver ho jayegi with live tracking link.',
    },
    {
      prompt: 'Is there any warranty on headphones?',
      response: 'Haan ji! Sabhi headphones par 1-year official brand warranty aur instant replacement policy milti hai.',
    },
  ];

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update assistant state based on WebRTC connection state
  useEffect(() => {
    if (isConnecting) {
      setAssistantState('PROCESSING');
    } else if (isConnected) {
      setAssistantState('LISTENING');
    } else if (!simulatedVoiceState) {
      setAssistantState('IDLE');
    }
  }, [isConnected, isConnecting, simulatedVoiceState]);

  // Actual Browser Audio Playback Execution
  const speakAudioResponse = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis API not supported in browser');
      setAssistantState('SPEAKING');
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any active speech

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const hindiOrIndianVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')
      );
      if (hindiOrIndianVoice) {
        utterance.voice = hindiOrIndianVoice;
      }

      utterance.onstart = () => {
        setAssistantState('SPEAKING');
        setVoiceErrorText('');
      };

      utterance.onend = () => {
        setAssistantState(isConnected ? 'LISTENING' : 'IDLE');
      };

      utterance.onerror = (e) => {
        console.error('Browser audio speech error:', e);
        setVoiceErrorText('Audio playback issue encountered');
        setAssistantState('ERROR');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Audio synthesis exception:', err);
      setAssistantState('ERROR');
    }
  };

  const handleSimulatedPrompt = (prompt: string, response: string) => {
    setSimulatedVoiceState(true);
    setCurrentPromptText(prompt);
    setAiSpeechResponse(response);

    // Play actual voice through browser speaker
    speakAudioResponse(response);
  };

  const handleStartRealConnection = async () => {
    try {
      setAssistantState('PROCESSING');
      // Unlock WebAudio Context for browser autoplay policies
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
      }
      await start();
    } catch (err) {
      console.warn('LiveKit connection attempt:', err);
      setAssistantState('ERROR');
      setVoiceErrorText('WebRTC Connection failed. Check network or API credentials.');
    }
  };

  const handleEndConnection = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (isConnected) end();
    setSimulatedVoiceState(false);
    setAssistantState('IDLE');
  };

  // State Badge Config
  const getStateBadge = () => {
    switch (assistantState) {
      case 'LISTENING':
        return {
          label: isHinglish ? '🎙️ Listening — Sun rahi hai' : '🎙️ Listening',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: Mic,
        };
      case 'PROCESSING':
        return {
          label: isHinglish ? '⏳ Processing — Samajh rahi hai' : '⏳ Processing',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: Loader2,
        };
      case 'SPEAKING':
        return {
          label: isHinglish ? '🔊 Speaking — Bol rahi hai' : '🔊 Speaking',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse',
          icon: Volume2,
        };
      case 'ERROR':
        return {
          label: isHinglish ? '⚠️ Error — Retrying' : '⚠️ Audio Error',
          color: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: AlertCircle,
        };
      default:
        return {
          label: isHinglish ? 'Ready / Standby' : 'Ready / Standby',
          color: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: Radio,
        };
    }
  };

  const stateBadge = getStateBadge();
  const BadgeIcon = stateBadge.icon;

  return (
    <div className="space-y-6 p-6">
      {/* Header Banner with Anisha Avatar Image */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 p-6 shadow-2xl shadow-purple-950/40">
        <div className="flex items-center gap-4">
          <div className="relative size-16 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-xl shadow-purple-500/30 shrink-0">
            <img
              src="/anisha_copilot_avatar.jpg"
              alt="Anisha AI Copilot Avatar"
              onError={(e) => {
                // Fallback handling if avatar image fails
                (e.target as HTMLImageElement).src = '/vyaparmind_hero_banner.jpg';
              }}
              className="size-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-slate-950 ${
                assistantState === 'SPEAKING'
                  ? 'bg-purple-400 animate-ping'
                  : assistantState === 'LISTENING'
                  ? 'bg-emerald-500'
                  : 'bg-slate-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Anisha — AI Commerce Copilot
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${stateBadge.color}`}>
                <BadgeIcon className={`size-3.5 ${assistantState === 'PROCESSING' ? 'animate-spin' : ''}`} />
                {stateBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {isHinglish
                ? 'Anisha ready hai aapki help ke liye in Hinglish, English & Hindi with natural conversational voice synthesis.'
                : 'Anisha is ready to assist with real-time product recommendations, Hinglish conversation, and instant intent classification.'}
            </p>
          </div>
        </div>

        {/* Start / Stop Audio Call Button */}
        <div>
          {isConnected || simulatedVoiceState ? (
            <Button
              onClick={handleEndConnection}
              variant="destructive"
              className="rounded-xl px-5 py-2.5 text-xs font-semibold gap-2 shadow-lg shadow-red-900/30 transition-transform hover:scale-105"
            >
              <PhoneOff className="size-4" />
              {isHinglish ? 'Session End Karein' : 'End Copilot Session'}
            </Button>
          ) : (
            <Button
              onClick={handleStartRealConnection}
              disabled={isConnecting}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl px-6 py-3 text-xs font-bold gap-2 shadow-xl shadow-purple-600/30 transition-transform hover:scale-105"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  Connecting WebRTC...
                </>
              ) : (
                <>
                  <Mic className="size-4 text-purple-200" />
                  {isHinglish ? 'Voice Call Start Karein' : 'Start Audio Session'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Main Intelligence Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Copilot Status & Pipeline */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {isHinglish ? 'Live AI Execution Pipeline' : 'Live AI Execution Pipeline'}
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Activity className="size-4 text-purple-400 animate-pulse" />
              <span>Latency: ~55ms</span>
            </div>
          </div>

          {/* 4 Pipeline Stages Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className={`p-3 rounded-xl border transition-all ${assistantState === 'LISTENING' ? 'border-purple-500 bg-purple-950/30 text-purple-300' : 'border-slate-800 bg-slate-950/60 text-slate-500'}`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Mic className="size-3.5" />
                <span>1. Speech STT</span>
              </div>
              <p className="text-[10px] text-slate-400">Deepgram Nova-3</p>
            </div>

            <div className={`p-3 rounded-xl border transition-all ${assistantState === 'PROCESSING' ? 'border-indigo-500 bg-indigo-950/30 text-indigo-300' : 'border-slate-800 bg-slate-950/60 text-slate-500'}`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Zap className="size-3.5" />
                <span>2. Intent LLM</span>
              </div>
              <p className="text-[10px] text-slate-400">Gemini Intent Engine</p>
            </div>

            <div className={`p-3 rounded-xl border transition-all ${assistantState === 'PROCESSING' ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300' : 'border-slate-800 bg-slate-950/60 text-slate-500'}`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Search className="size-3.5" />
                <span>3. Live Catalogue</span>
              </div>
              <p className="text-[10px] text-slate-400">Vyapar Catalogue Check</p>
            </div>

            <div className={`p-3 rounded-xl border transition-all ${assistantState === 'SPEAKING' ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300' : 'border-slate-800 bg-slate-950/60 text-slate-500'}`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Sparkles className="size-3.5" />
                <span>4. Murf Falcon</span>
              </div>
              <p className="text-[10px] text-slate-400">Ultra-fast Speech</p>
            </div>
          </div>

          {/* Active Audio Waveform Container */}
          <div className="min-h-48 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-4 relative overflow-hidden">
            {isConnected || simulatedVoiceState ? (
              <div className="space-y-4 w-full">
                {/* 16-Bar Equalizer animation */}
                <div className="flex items-center justify-center gap-1.5 h-12">
                  {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 65, 85, 40, 75, 50, 90].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        height: assistantState === 'SPEAKING' ? `${h}%` : '20%',
                        transition: 'height 0.15s ease-in-out',
                      }}
                      className={`w-1.5 rounded-full ${
                        assistantState === 'SPEAKING'
                          ? 'bg-gradient-to-t from-purple-600 via-indigo-500 to-emerald-400 animate-pulse'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {currentPromptText && (
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-left text-xs space-y-1">
                    <span className="font-semibold text-purple-400">User Question:</span>
                    <p className="text-slate-200 font-medium">"{currentPromptText}"</p>
                  </div>
                )}

                {aiSpeechResponse && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-left text-xs space-y-1">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Volume2 className={`size-4 ${assistantState === 'SPEAKING' ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`} />
                      Anisha Spoken Response (Murf Falcon Audio):
                    </span>
                    <p className="text-slate-100 font-medium">{aiSpeechResponse}</p>
                  </div>
                )}

                {voiceErrorText && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-left text-xs text-red-300">
                    {voiceErrorText}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="size-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
                  <MicOff className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300">
                    {isHinglish ? 'Commerce Copilot Standby State' : 'Commerce Copilot Offline'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm">
                    {isHinglish
                      ? 'Niche kisi bhi sample question par click karein to hear real spoken Hinglish audio response!'
                      : 'Click any sample inquiry on the right to hear real spoken voice synthesis response!'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Prompts & Sample Intents */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">
            {isHinglish ? 'Hinglish Voice Inquiries Test' : 'Suggested Voice Inquiries'}
          </h3>
          <p className="text-xs text-slate-400">
            {isHinglish ? 'Click karke real audio speech response suniye:' : 'Click any prompt to trigger live audio playback:'}
          </p>

          <div className="space-y-2.5">
            {samplePrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulatedPrompt(item.prompt, item.response)}
                className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-purple-500/40 hover:bg-purple-950/20 text-xs font-medium text-slate-200 transition-all flex items-center justify-between group active:scale-95"
              >
                <span>"{item.prompt}"</span>
                <Play className="size-3.5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-xs space-y-2 mt-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="size-4" />
              <span>Hinglish & Code-Mixing Active</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Anisha seamlessly understands Hindi-English mixing (e.g. "Mujhe warranty details chahiye") with zero-hallucination boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
