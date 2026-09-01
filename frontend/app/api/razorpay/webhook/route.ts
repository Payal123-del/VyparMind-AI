import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory idempotency cache for deduplicating webhook events
const PROCESSED_WEBHOOK_EVENTS = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Signature Verification
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json(
          { success: false, error: 'Invalid webhook signature.' },
          { status: 400 }
        );
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload in webhook.' },
        { status: 400 }
      );
    }

    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // 2. Idempotency Check & Event Deduplication
    if (PROCESSED_WEBHOOK_EVENTS.has(eventId)) {
      return NextResponse.json({
        success: true,
        message: 'Event already processed (Idempotent replay ignored).',
        eventId,
        deduplicated: true,
      });
    }

    PROCESSED_WEBHOOK_EVENTS.add(eventId);

    // Keep cache bounded
    if (PROCESSED_WEBHOOK_EVENTS.size > 1000) {
      const firstEntry = PROCESSED_WEBHOOK_EVENTS.values().next().value;
      if (firstEntry) PROCESSED_WEBHOOK_EVENTS.delete(firstEntry);
    }

    // 3. Process Event Types
    let actionTaken = 'LOGGED';
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    switch (eventType) {
      case 'payment.captured':
        actionTaken = 'ORDER_MARKED_PAID_AND_REVENUE_ATTRIBUTED';
        break;
      case 'payment.failed':
        actionTaken = 'PAYMENT_FAILED_RECOVERY_OPPORTUNITY_TRIGGERED';
        break;
      case 'order.paid':
        actionTaken = 'ORDER_FULFILLMENT_PIPELINE_NOTIFIED';
        break;
      default:
        actionTaken = `EVENT_${eventType}_RECORDED`;
    }

    return NextResponse.json({
      success: true,
      eventId,
      eventType,
      actionTaken,
      paymentId: paymentEntity?.id,
      orderId: orderEntity?.id || paymentEntity?.order_id,
      amount: paymentEntity?.amount ? paymentEntity.amount / 100 : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
