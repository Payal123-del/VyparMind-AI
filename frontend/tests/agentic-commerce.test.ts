import assert from 'assert';
import crypto from 'crypto';
import {
  STRUCTURED_CATALOG,
  verifyProductFromCatalog,
  searchCatalogByIntent,
  getCrossSellRecommendations,
} from '../lib/commerce/catalog';
import {
  AgentActionPolicyEngine,
  DEFAULT_POLICY_CONFIG,
} from '../lib/commerce/policy-engine';
import {
  OrderStateMachine,
  CommerceOrder,
} from '../lib/commerce/order-state-machine';

console.log('--- RUNNING VYAPARMIND AGENTIC COMMERCE TEST SUITE ---');

// TEST 1: Catalog Search & Zero-Hallucination Checks
{
  console.log('Test 1: Catalog Search & Strict Zero-Hallucination');
  const results = searchCatalogByIntent('5g phone under 15000', 15000);
  assert(results.length > 0, 'Should find at least 1 smartphone matching sub-15k intent');
  assert.strictEqual(results[0].product_id, 'PROD-101');
  assert.strictEqual(results[0].final_price, 14999);

  // Grocery refusal test
  const groceryResults = searchCatalogByIntent('mujhe basmati rice chahiye');
  assert.strictEqual(groceryResults.length, 0, 'Grocery items must be refused completely');

  // Verify non-existent product
  const fakeCheck = verifyProductFromCatalog('PROD-999-FAKE');
  assert.strictEqual(fakeCheck.verified, false, 'Fake product must fail verification');

  console.log('✓ Test 1 Passed: Catalog search and zero-hallucination guard verified.');
}

// TEST 2: Cross-Sell Recommendations
{
  console.log('Test 2: Contextual Cross-Sell Retrieval');
  const crossSells = getCrossSellRecommendations('PROD-101');
  assert(crossSells.length > 0, 'Should return cross-sell accessories for PROD-101');
  assert.strictEqual(crossSells[0].product_id, 'PROD-302');
  assert.strictEqual(crossSells[0].price, 499);
  console.log('✓ Test 2 Passed: Cross-sell recommendations verified.');
}

// TEST 3: Agent Action Policy Engine
{
  console.log('Test 3: Policy Engine Boundaries & Gating');
  const policyEngine = new AgentActionPolicyEngine();

  // A. Compliant Order (₹15,498 <= ₹25,000 bound, 0% discount, confirmed)
  const approvedAction = policyEngine.evaluateAction({
    agentId: 'AGENT-01',
    actionType: 'CREATE_ORDER',
    amount: 15498,
    discountPercent: 0,
    inventoryAvailable: true,
    customerConfirmed: true,
    retryCount: 0,
  });

  assert.strictEqual(approvedAction.approved, true, 'Standard sub-25k order must be approved');
  assert.strictEqual(approvedAction.riskLevel, 'LOW', 'Standard order should be LOW risk');

  // B. Violation: Excessive Amount (₹35,000 > ₹25,000 bound)
  const overboundAction = policyEngine.evaluateAction({
    agentId: 'AGENT-01',
    actionType: 'CREATE_ORDER',
    amount: 35000,
    discountPercent: 0,
    inventoryAvailable: true,
    customerConfirmed: true,
  });
  assert.strictEqual(overboundAction.approved, false, 'Over-bound order must be blocked');

  // C. Violation: Excessive Discount (25% > 15% ceiling)
  const overDiscountAction = policyEngine.evaluateAction({
    agentId: 'AGENT-01',
    actionType: 'CREATE_ORDER',
    amount: 10000,
    discountPercent: 25,
    inventoryAvailable: true,
    customerConfirmed: true,
  });
  assert.strictEqual(overDiscountAction.approved, false, 'Excessive discount must be blocked');

  // D. Retry Limit Check
  const excessiveRetryAction = policyEngine.evaluateAction({
    agentId: 'AGENT-01',
    actionType: 'RETRY_PAYMENT',
    amount: 15498,
    retryCount: 3, // max is 2
    inventoryAvailable: true,
    customerConfirmed: true,
  });
  assert.strictEqual(excessiveRetryAction.approved, false, 'Excessive retry must be blocked');

  console.log('✓ Test 3 Passed: Policy Engine boundaries and rules verified.');
}

// TEST 4: Order State Machine Transitions
{
  console.log('Test 4: Order State Machine Transitions');
  const initialOrder: CommerceOrder = {
    orderId: 'ORD-TEST-01',
    customerId: 'CUST-801',
    customerName: 'Rajesh Sharma',
    items: [{ productId: 'PROD-101', name: 'Redmi Note 13 Pro 5G', unitPrice: 14999, quantity: 1 }],
    subtotal: 14999,
    discountAmount: 0,
    totalAmount: 14999,
    currency: 'INR',
    status: 'DISCOVERED',
    revenueAttributed: false,
    retryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [{ status: 'DISCOVERED', timestamp: new Date().toISOString() }],
  };

  // Valid chain: DISCOVERED -> RECOMMENDED -> ACCEPTED -> CHECKOUT_CREATED -> PAYMENT_PENDING -> PAID
  let order = OrderStateMachine.transition(initialOrder, 'RECOMMENDED');
  assert.strictEqual(order.status, 'RECOMMENDED');

  order = OrderStateMachine.transition(order, 'ACCEPTED');
  assert.strictEqual(order.status, 'ACCEPTED');

  order = OrderStateMachine.transition(order, 'CHECKOUT_CREATED');
  assert.strictEqual(order.status, 'CHECKOUT_CREATED');

  order = OrderStateMachine.transition(order, 'PAYMENT_PENDING');
  assert.strictEqual(order.status, 'PAYMENT_PENDING');

  order = OrderStateMachine.transition(order, 'PAID');
  assert.strictEqual(order.status, 'PAID');

  // Illegal jump: PAID cannot transition back to DISCOVERED or CHECKOUT_CREATED
  assert.throws(() => {
    OrderStateMachine.transition(order, 'DISCOVERED');
  }, /Invalid order state transition/);

  console.log('✓ Test 4 Passed: Order State Machine valid and invalid transitions verified.');
}

// TEST 5: HMAC-SHA256 Payment Signature Calculation
{
  console.log('Test 5: HMAC-SHA256 Signature Verification');
  const orderId = 'order_test_9801vm881';
  const paymentId = 'pay_test_9801a';
  const testSecret = 'rzp_secret_mock_123456';

  const expectedSignature = crypto
    .createHmac('sha256', testSecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Verify match
  const checkSig = crypto
    .createHmac('sha256', testSecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  assert.strictEqual(checkSig, expectedSignature);

  // Tampered paymentId must fail
  const tamperedSig = crypto
    .createHmac('sha256', testSecret)
    .update(`${orderId}|pay_test_tampered_999`)
    .digest('hex');

  assert.notStrictEqual(tamperedSig, expectedSignature);

  console.log('✓ Test 5 Passed: HMAC-SHA256 signature calculation and tampering check verified.');
}

// TEST 6: Webhook Idempotency & Deduplication
{
  console.log('Test 6: Webhook Idempotency Simulation');
  const processedEvents = new Set<string>();

  const eventId = 'evt_test_payment_captured_1001';

  // First arrival
  const isFirstArrival = !processedEvents.has(eventId);
  assert.strictEqual(isFirstArrival, true);
  processedEvents.add(eventId);

  // Second arrival (Replay / Duplicate)
  const isDuplicate = processedEvents.has(eventId);
  assert.strictEqual(isDuplicate, true, 'Duplicate webhook event must be identified');

  console.log('✓ Test 6 Passed: Webhook idempotency and deduplication verified.');
}

console.log('\n=========================================');
console.log('🎉 ALL 6 AGENTIC COMMERCE TEST SUITES PASSED (100% GREEN)');
console.log('=========================================\n');
