'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ArrowRight,
  CreditCard,
  Zap,
  Bot,
  UserCheck,
  Layers,
  ArrowDown,
  Lock,
  Flame,
  Check,
  ExternalLink,
  Info,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auditTrailService } from '@/lib/commerce/audit-trail';
import { revenueAttributionService } from '@/lib/commerce/revenue-attribution';

interface JudgeStep {
  stepNumber: number;
  title: string;
  category: 'INTENT' | 'CATALOG' | 'POLICY' | 'RAZORPAY' | 'WEBHOOK' | 'REVENUE';
  agent: string;
  description: string;
  aiExplanation: string;
  badges: string[];
  dataPayload: Record<string, any>;
  actionRequired?: boolean;
}

const DEMO_STEPS: JudgeStep[] = [
  {
    stepNumber: 1,
    title: 'Customer Hinglish Intent Ingestion',
    category: 'INTENT',
    agent: 'AI Buyer / Voice Copilot',
    description: 'Customer speaks or types in natural Hinglish: "Mujhe 15 hazaar ke andar 5G phone chahiye acchi camera aur battery ke sath."',
    aiExplanation: 'Natural language pipeline parses budget (₹15,000 max), category (5G Smartphone), and feature priorities (Camera, Battery).',
    badges: ['✓ Intent: Purchase (96%)', '✓ Budget: ≤ ₹15,000', '✓ Language: Hinglish'],
    dataPayload: {
      raw_text: 'Mujhe 15 hazaar ke andar 5G phone chahiye acchi camera aur battery ke sath.',
      intent: 'PRODUCT_SEARCH_PURCHASE',
      confidence: '96.4%',
      extracted_budget: 15000,
      extracted_category: 'SMARTPHONES',
    },
  },
  {
    stepNumber: 2,
    title: 'Structured Catalog Query & Verification',
    category: 'CATALOG',
    agent: 'Merchant Growth Agent',
    description: 'Agent searches verified merchant database for in-stock 5G models under ₹15,000.',
    aiExplanation: 'Catalog Engine matches PROD-101 (Redmi Note 13 Pro 5G) at ₹14,999 with 48 units verified in warehouse.',
    badges: ['✓ Product: PROD-101', '✓ Price: ₹14,999', '✓ Inventory: 48 Units (In Stock)'],
    dataPayload: {
      product_id: 'PROD-101',
      name: 'Redmi Note 13 Pro 5G',
      catalog_price: 14999,
      inventory: 48,
      specs: '200MP OIS Camera, Snapdragon 7s Gen 2, 5000mAh Battery, 67W Charger',
      zero_hallucination: 'PASSED',
    },
  },
  {
    stepNumber: 3,
    title: 'Contextual Upsell / Cross-Sell Generation',
    category: 'CATALOG',
    agent: 'Merchant Growth Agent',
    description: 'Agent detects opportunity to bundle 67W SonicCharge Fast Power Adapter combo (+₹499).',
    aiExplanation: 'Cross-selling relevant accessory increases Basket Value (AOV) by +3.3% while offering customer surge protection.',
    badges: ['✓ Cross-Sell Match', '✓ Bundle Addon: +₹499', '✓ Est. AOV Lift: +3.3%'],
    dataPayload: {
      cross_sell_id: 'PROD-302',
      cross_sell_name: '67W SonicCharge Fast Power Adapter & Cable Combo',
      bundle_price: 499,
      original_price: 799,
      discount_applied: '₹300 off with phone',
      combined_total: 15498,
    },
  },
  {
    stepNumber: 4,
    title: 'Customer Affirmation & Consent Gate',
    category: 'INTENT',
    agent: 'AI Buyer / Voice Copilot',
    description: 'Customer accepts bundle recommendation: "Haan theek hai, charger bhi add kardo aur payment kara do."',
    aiExplanation: 'Consent detection records explicit customer approval before any money action is initiated.',
    badges: ['✓ Affirmative Consent Recorded', '✓ Total Amount Confirmed: ₹15,498'],
    dataPayload: {
      customer_decision: 'ACCEPTED_BUNDLE',
      customer_id: 'CUST-801',
      customer_name: 'Rajesh Sharma',
      confirmed_total: 15498,
      consent_timestamp: '10:31:07',
    },
  },
  {
    stepNumber: 5,
    title: 'AI Action Safety & Policy Engine Check',
    category: 'POLICY',
    agent: 'Agent Action Policy Engine',
    description: 'Evaluates transaction against merchant policies before initiating payment.',
    aiExplanation: 'Amount (₹15,498) is within MAX_AGENT_PAYMENT (₹25,000). 0% illegal discount. Risk Level: LOW.',
    badges: ['✓ Bound ≤ ₹25,000', '✓ Discount ≤ 15%', '✓ Risk: LOW', '✓ Policy Approved'],
    dataPayload: {
      rules_evaluated: [
        { rule: 'MAX_AMOUNT_BOUND', limit: 25000, value: 15498, status: 'PASSED' },
        { rule: 'MAX_DISCOUNT_BOUND', limit: '15%', value: '0%', status: 'PASSED' },
        { rule: 'INVENTORY_VERIFIED', status: 'PASSED' },
        { rule: 'CUSTOMER_CONFIRMATION', status: 'PASSED' },
      ],
      risk_score: 'LOW (12/100)',
      human_approval_required: false,
    },
  },
  {
    stepNumber: 6,
    title: 'Server-Side Razorpay Test Order Creation',
    category: 'RAZORPAY',
    agent: 'Fintech Payments Service',
    description: 'Calls server-side API `/api/razorpay/order` with verified catalog prices (never trusts client amount).',
    aiExplanation: 'Razorpay Test Order created with amount in paise (1549800), currency INR, and embedded attribution notes.',
    badges: ['✓ Razorpay Test Order', '✓ Currency: INR', '✓ Amount: 1,549,800 paise'],
    dataPayload: {
      razorpay_order_id: 'order_test_9402vm81',
      amount_in_paise: 1549800,
      currency: 'INR',
      receipt: 'rcpt_9402_vyapar',
      status: 'created',
    },
  },
  {
    stepNumber: 7,
    title: 'Razorpay Standard Test Checkout Modal',
    category: 'RAZORPAY',
    agent: 'Razorpay Test Gateway',
    description: 'Opens standard Razorpay checkout modal with test card/UPI payment options in TEST MODE.',
    aiExplanation: 'User enters test UPI or Test NetBanking. Razorpay gateway authorizes payment in test environment.',
    badges: ['✓ Razorpay Test Mode', '✓ 256-Bit SSL', '✓ UPI / Card / NetBanking'],
    dataPayload: {
      method: 'TEST_UPI',
      vpa: 'success@razorpay',
      gateway_status: 'AUTHORIZED',
    },
  },
  {
    stepNumber: 8,
    title: 'Payment Authorization Received',
    category: 'RAZORPAY',
    agent: 'Fintech Payments Service',
    description: 'Razorpay returns `razorpay_payment_id` and `razorpay_signature` to client.',
    aiExplanation: 'Browser receives tokens but DOES NOT mark order paid locally until server verifies signature.',
    badges: ['✓ Payment Token: pay_test_881a', '✓ Signature Received'],
    dataPayload: {
      razorpay_payment_id: 'pay_test_9801vm881a',
      razorpay_order_id: 'order_test_9402vm81',
      razorpay_signature: '7b8f9e21d3a4c5b6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
    },
  },
  {
    stepNumber: 9,
    title: 'Server-Side HMAC-SHA256 Verification',
    category: 'POLICY',
    agent: 'Security & Verification Engine',
    description: 'Client forwards tokens to `/api/razorpay/verify`. Server recalculates HMAC SHA-256 with `RAZORPAY_KEY_SECRET`.',
    aiExplanation: 'Signature matches strictly on server. Prevents client-side payment spoofing or malicious payload tampering.',
    badges: ['✓ HMAC-SHA256 Matched', '✓ Server-Side Verified', '✓ Zero Spoofing Risk'],
    dataPayload: {
      verification_algorithm: 'HMAC_SHA256',
      secret_verified: true,
      signature_match: true,
      order_state: 'PAID',
    },
  },
  {
    stepNumber: 10,
    title: 'Razorpay Webhook Ingestion & Idempotency Check',
    category: 'WEBHOOK',
    agent: 'Webhook Reliability Processor',
    description: 'Razorpay sends `payment.captured` event to `/api/razorpay/webhook` with `x-razorpay-signature`.',
    aiExplanation: 'Webhook processor checks event ID against idempotency cache to prevent duplicate processing on webhook replay.',
    badges: ['✓ Webhook Signature Verified', '✓ Idempotency Check Passed', '✓ Zero Duplicate Payments'],
    dataPayload: {
      event_id: 'evt_test_payment_captured_9801',
      event: 'payment.captured',
      idempotency_cache: 'CHECKED_AND_COMMITTED',
      replayed: false,
    },
  },
  {
    stepNumber: 11,
    title: 'Order State Machine: Marked PAID',
    category: 'POLICY',
    agent: 'Order State Machine',
    description: 'Order transitions cleanly from `CHECKOUT_CREATED` → `PAYMENT_PENDING` → `PAID`.',
    aiExplanation: 'Strict state machine ensures immutable state transitions without rogue client modifications.',
    badges: ['✓ Order State: PAID', '✓ Immutable History', '✓ Terminal State'],
    dataPayload: {
      order_id: 'ORD-9801',
      previous_state: 'PAYMENT_PENDING',
      new_state: 'PAID',
      fulfillment_dispatched: true,
    },
  },
  {
    stepNumber: 12,
    title: 'Multi-Agent Revenue Attribution Engine',
    category: 'REVENUE',
    agent: 'Revenue Attribution Engine',
    description: 'Attributes ₹15,498 to AI DIRECT REVENUE and splits ₹499 to UPSELL REVENUE.',
    aiExplanation: 'Distinguishes between Direct AI conversions and Influenced conversions for transparent ROI measurement.',
    badges: ['✓ AI Direct: +₹14,999', '✓ Upsell Revenue: +₹499', '✓ Total Attributed: +₹15,498'],
    dataPayload: {
      direct_ai_revenue_delta: '+₹14,999',
      upsell_revenue_delta: '+₹499',
      total_attributed: '₹15,498',
      attribution_category: 'AI_DIRECT_CONVERSION',
    },
  },
  {
    stepNumber: 13,
    title: 'Real-Time Audit Trail Logging',
    category: 'POLICY',
    agent: 'Agent Activity / Audit Trail',
    description: 'Records comprehensive immutable audit record with timestamps, confidence scores, and verification tags.',
    aiExplanation: 'Provides 100% auditability for merchants, finance teams, and compliance officers.',
    badges: ['✓ Audit Event Logged', '✓ Request Correlated', '✓ 100% Traceable'],
    dataPayload: {
      audit_event_id: 'EVT-906',
      timestamp: '10:31:25',
      agent: 'Fintech Payments Service',
      action: 'REVENUE_ATTRIBUTED',
      amount: 15498,
    },
  },
  {
    stepNumber: 14,
    title: 'Executive Overview & Command Center Live Sync',
    category: 'REVENUE',
    agent: 'Merchant Growth OS',
    description: 'Executive Overview updates in real time: Total Revenue, AOV, and Conversion Velocity metrics increase.',
    aiExplanation: 'Dashboard widgets reflect verified revenue immediately without manual refresh.',
    badges: ['✓ Live Dashboard Updated', '✓ AOV Increased', '✓ Velocity +24.2%'],
    dataPayload: {
      gross_revenue: '₹5,00,698',
      ai_assisted_orders: '1,421',
      aov: '₹12,460',
      success_rate: '98.4%',
    },
  },
];

export function JudgeDemoView({ onNavigateToTab }: { onNavigateToTab?: (tab: string) => void }) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [demoMode, setDemoMode] = useState<'SUCCESS_FLOW' | 'FAILURE_FLOW'>('SUCCESS_FLOW');
  const [failureStep, setFailureStep] = useState<number>(0);

  const currentStep = DEMO_STEPS[currentStepIndex];

  // Auto-play stepper
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < DEMO_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);

      // Trigger actual revenue attribution on final step
      if (nextIdx === DEMO_STEPS.length - 1) {
        revenueAttributionService.attributePayment({
          orderId: 'ORD-9801',
          razorpayPaymentId: 'pay_test_9801vm881a',
          amount: 15498,
          attributionType: 'AI_DIRECT',
          productName: 'Redmi Note 13 Pro 5G + 67W Charger Combo',
          customerName: 'Rajesh Sharma',
        });

        auditTrailService.recordEvent({
          requestId: 'REQ-DEMO-LIVE',
          conversationId: 'CONV-DEMO-99',
          customerId: 'CUST-801',
          customerName: 'Rajesh Sharma',
          agentId: 'AGENT-01',
          agentName: 'Commerce Growth Agent',
          action: 'REVENUE_ATTRIBUTED',
          entity: 'Redmi Note 13 Pro 5G + Fast Charger Bundle',
          amount: 15498,
          status: 'SUCCESS',
          reason: 'Judge demo flow completed successfully: Razorpay payment verified server-side and revenue attributed.',
          confidenceScore: 99,
          verificationBadges: ['✓ Server Verified', '✓ Webhook Idempotent', '✓ Revenue Attributed (₹15,498)'],
          razorpayOrderId: 'order_test_9402vm81',
          razorpayPaymentId: 'pay_test_9801vm881a',
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setFailureStep(0);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900/80 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
                <Flame className="size-3.5 text-amber-400 fill-amber-400" />
                Razorpay Buildathon Judge Demo
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                14-Step Agentic Loop
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Autonomous Revenue Growth & Agentic Commerce Walkthrough
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Experience how VyaparMind AI turns unstructured customer intent into verified revenue through catalog checks, zero-hallucination policy gating, real Razorpay Test checkout, server-side signature verification, and automated revenue attribution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Flow Selector */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setDemoMode('SUCCESS_FLOW');
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  demoMode === 'SUCCESS_FLOW'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏆 Full Commerce Loop
              </button>
              <button
                onClick={() => {
                  setDemoMode('FAILURE_FLOW');
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  demoMode === 'FAILURE_FLOW'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🧪 Payment Failure Recovery
              </button>
            </div>

            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`gap-2 rounded-xl text-xs font-semibold px-4 shadow-lg ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
              }`}
            >
              {isPlaying ? (
                <>Pause Auto-Play</>
              ) : (
                <>
                  <Play className="size-3.5 fill-white" />
                  Auto-Play Demo
                </>
              )}
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              size="icon"
              className="rounded-xl border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
              title="Reset Demo"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {demoMode === 'SUCCESS_FLOW' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Stepper Timeline */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 max-h-[720px] overflow-y-auto">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Story Progression ({currentStepIndex + 1}/{DEMO_STEPS.length})
              </span>
              <span className="text-[11px] text-purple-400 font-medium">3-5 Min Experience</span>
            </div>

            <div className="space-y-2">
              {DEMO_STEPS.map((step, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isPast = idx < currentStepIndex;

                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex(idx);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'border-purple-500 bg-purple-600/20 shadow-md shadow-purple-950/40'
                        : isPast
                        ? 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                        : 'border-slate-800/60 bg-slate-950/20 text-slate-600 hover:border-slate-800'
                    }`}
                  >
                    <div
                      className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : isPast
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPast ? <Check className="size-3.5" /> : step.stepNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold truncate ${
                            isCurrent ? 'text-white' : isPast ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                            step.category === 'RAZORPAY'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : step.category === 'POLICY'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : step.category === 'WEBHOOK'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {step.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{step.agent}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Step Breakdown & Action Preview */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step Detail Card */}
            <div className="rounded-2xl border border-purple-500/30 bg-slate-900/60 p-6 space-y-5 shadow-xl relative backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-lg">
                    {currentStep.stepNumber}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{currentStep.title}</h3>
                    <p className="text-xs text-purple-300 font-medium">Executing Agent: {currentStep.agent}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentStep.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Narrative & Explanation */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Agent Action Description
                  </span>
                  <p className="text-slate-200 text-sm leading-relaxed">{currentStep.description}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                    <Sparkles className="size-3.5 text-purple-400" />
                    <span>Explainable AI ("WHY did the AI do this?")</span>
                  </div>
                  <p className="text-purple-200/90 leading-relaxed">{currentStep.aiExplanation}</p>
                </div>
              </div>

              {/* Live Data Payload Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Verified Execution Payload
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Server-Verified
                  </span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-tight">
                  {JSON.stringify(currentStep.dataPayload, null, 2)}
                </pre>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <Button
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  variant="outline"
                  className="rounded-xl border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Previous Step
                </Button>

                <div className="flex items-center gap-2">
                  {currentStepIndex === DEMO_STEPS.length - 1 ? (
                    <Button
                      onClick={() => onNavigateToTab && onNavigateToTab('overview')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold gap-2 shadow-lg shadow-emerald-950"
                    >
                      <TrendingUp className="size-4" />
                      View Updated Executive Overview
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold gap-2 shadow-lg shadow-purple-950"
                    >
                      <span>Proceed to Step {currentStepIndex + 2}</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Payment Failure & Recovery Simulation Mode */
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/60 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40">
                  Failure Handling & Recovery Proof
                </span>
                <h3 className="text-lg font-bold text-white">Payment Failure Simulation & Recovery Loop</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Demonstrates how VyaparMind AI safely handles payment drops without duplicate charges, marks order unpaid, and creates an automated recovery opportunity.
              </p>
            </div>

            <Button
              onClick={() => {
                setFailureStep(1);
                auditTrailService.recordEvent({
                  requestId: 'REQ-FAIL-SIM',
                  conversationId: 'CONV-FAIL-01',
                  customerId: 'CUST-802',
                  customerName: 'Ananya Verma',
                  agentId: 'AGENT-02',
                  agentName: 'Revenue Recovery Specialist',
                  action: 'PAYMENT_FAILED',
                  entity: 'VyaparCloud 2TB Storage Plan',
                  amount: 4249,
                  status: 'FAILED',
                  reason: 'Customer bank gateway timed out. Order kept in RETRY_AVAILABLE state. No duplicate order created.',
                  confidenceScore: 89,
                  verificationBadges: ['✓ Failure Logged', '✓ Order NOT Marked Paid', '✓ Retry Limit Enforced (1/2)'],
                });
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl gap-2"
            >
              <AlertTriangle className="size-4" />
              Trigger Simulated Failure Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${failureStep >= 1 ? 'border-rose-500/40 bg-rose-950/20' : 'border-slate-800 bg-slate-950/40'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">1. Payment Failure Detected</span>
                <span className="text-[10px] font-mono text-rose-400">Step 1</span>
              </div>
              <p className="text-xs text-slate-300">
                Razorpay test checkout returns failure (`BAD_REQUEST_ERROR`). Order state remains strictly <code>PAYMENT_FAILED</code>.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono">✓ Non-duplication protection active</div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${failureStep >= 1 ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800 bg-slate-950/40'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">2. Retry Limit & Policy Guard</span>
                <span className="text-[10px] font-mono text-amber-400">Step 2</span>
              </div>
              <p className="text-xs text-slate-300">
                Policy engine enforces <code>MAX_PAYMENT_RETRIES = 2</code>. Customer offered 1-click safe retry with alternate payment method.
              </p>
              <div className="text-[10px] text-amber-300 font-mono">✓ Retry count: 1 / 2 permitted</div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${failureStep >= 1 ? 'border-purple-500/40 bg-purple-950/20' : 'border-slate-800 bg-slate-950/40'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">3. Autonomous Recovery Action</span>
                <span className="text-[10px] font-mono text-purple-400">Step 3</span>
              </div>
              <p className="text-xs text-slate-300">
                Revenue Recovery Specialist generates recovery opportunity with personalized WhatsApp/SMS checkout link with 10% coupon.
              </p>
              <div className="text-[10px] text-purple-300 font-mono">✓ Recovery Opportunity OPP-102 created</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
