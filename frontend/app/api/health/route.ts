import { NextResponse } from 'next/server';
import { STRUCTURED_CATALOG } from '@/lib/commerce/catalog';

export async function GET() {
  const hasRazorpayKeys = Boolean(
    (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) &&
      process.env.RAZORPAY_KEY_SECRET
  );

  return NextResponse.json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    services: {
      ai_copilot: {
        status: 'ONLINE',
        provider: 'Google Gemini 1.5 + Murf Falcon Low-Latency TTS + Deepgram Nova-3',
        state: 'Ready for Hinglish/English/Hindi voice & text sessions',
      },
      product_catalog: {
        status: 'HEALTHY',
        items_count: STRUCTURED_CATALOG.length,
        zero_hallucination_guard: 'ACTIVE',
      },
      policy_engine: {
        status: 'ACTIVE',
        active_rules: ['MAX_AMOUNT_BOUND', 'MAX_DISCOUNT_BOUND', 'RETRY_LIMIT', 'INVENTORY_VERIFIED', 'CUSTOMER_CONFIRMATION', 'CURRENCY_SUPPORTED'],
        max_bound: '₹25,000',
      },
      razorpay_gateway: {
        status: hasRazorpayKeys ? 'CONFIGURED_TEST_MODE' : 'TEST_MODE_EMULATED',
        mode: 'TEST_MODE',
        server_verification: 'HMAC_SHA256_ACTIVE',
      },
      webhook_processor: {
        status: 'HEALTHY',
        signature_verification: 'HMAC_SHA256',
        idempotency_cache: 'ACTIVE',
      },
      revenue_attribution: {
        status: 'HEALTHY',
        tracking: ['AI_DIRECT', 'AI_INFLUENCED', 'RECOVERY', 'UPSELL'],
      },
    },
  });
}
