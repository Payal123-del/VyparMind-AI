import { NextRequest, NextResponse } from 'next/server';
import { STRUCTURED_CATALOG, verifyProductFromCatalog } from '@/lib/commerce/catalog';
import { defaultPolicyEngine } from '@/lib/commerce/policy-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      crossSellProductId,
      customerId = 'CUST-801',
      customerName = 'Rajesh Sharma',
      customerConfirmed = true,
      agentId = 'AGENT-01',
      attributionType = 'AI_DIRECT',
    } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required for order creation.' },
        { status: 400 }
      );
    }

    // 1. Zero-hallucination server-side catalog verification
    const productCheck = verifyProductFromCatalog(productId);
    if (!productCheck.verified || !productCheck.product) {
      return NextResponse.json(
        { success: false, error: `Invalid product: ${productCheck.reason}` },
        { status: 404 }
      );
    }

    const primaryProduct = productCheck.product;
    let totalAmount = primaryProduct.final_price;
    let crossSellItem = null;

    // 2. Cross-sell verification if requested
    if (crossSellProductId) {
      const crossCheck = primaryProduct.cross_sell_products.find(
        (c) => c.product_id === crossSellProductId
      );
      if (crossCheck) {
        const itemPrice = crossCheck.discounted_bundle_price || crossCheck.price;
        totalAmount += itemPrice;
        crossSellItem = crossCheck;
      }
    }

    // 3. Centralized Action Policy Engine Evaluation
    const policyEvaluation = defaultPolicyEngine.evaluateAction({
      agentId,
      actionType: 'CREATE_ORDER',
      amount: totalAmount,
      discountPercent: primaryProduct.discount_percent,
      inventoryAvailable: primaryProduct.inventory > 0,
      customerConfirmed,
      currency: 'INR',
    });

    if (!policyEvaluation.approved) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order creation blocked by Agent Action Policy Engine.',
          policyEvaluation,
        },
        { status: 403 }
      );
    }

    // 4. Server-Side Razorpay Test Order Creation
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    let razorpayOrderId = `order_test_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
    let isLiveCredentials = false;

    if (razorpayKeyId && razorpayKeySecret) {
      try {
        const authHeader = `Basic ${Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64')}`;
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
          body: JSON.stringify({
            amount: totalAmount * 100, // Amount in paise
            currency: 'INR',
            receipt: receiptId,
            notes: {
              merchant_id: primaryProduct.merchant_id,
              customer_id: customerId,
              customer_name: customerName,
              agent_id: agentId,
              attribution_type: attributionType,
              product_id: primaryProduct.product_id,
              product_name: primaryProduct.name,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          razorpayOrderId = data.id;
          isLiveCredentials = true;
        } else {
          console.warn('Razorpay API order creation failed, falling back to verified test order representation.');
        }
      } catch (err) {
        console.warn('Razorpay network call error, falling back to verified test order representation:', err);
      }
    }

    const orderRecord = {
      orderId: `ORD-${Date.now()}`,
      razorpayOrderId,
      customerId,
      customerName,
      product: {
        id: primaryProduct.product_id,
        name: primaryProduct.name,
        basePrice: primaryProduct.price,
        discountPercent: primaryProduct.discount_percent,
        finalPrice: primaryProduct.final_price,
      },
      crossSell: crossSellItem,
      totalAmount,
      amountInPaise: totalAmount * 100,
      currency: 'INR',
      receiptId,
      status: 'CHECKOUT_CREATED',
      policyEvaluation,
      keyId: razorpayKeyId || 'rzp_test_VyaparMindDevKey',
      isLiveCredentials,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      order: orderRecord,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
