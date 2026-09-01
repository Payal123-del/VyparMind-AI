export interface AuditEvent {
  id: string;
  timestamp: string;
  requestId: string;
  conversationId: string;
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  action:
    | 'INTENT_DETECTED'
    | 'CATALOG_QUERIED'
    | 'PRODUCT_VERIFIED'
    | 'RECOMMENDATION_GENERATED'
    | 'UPSELL_OFFERED'
    | 'CUSTOMER_ACCEPTED'
    | 'POLICY_EVALUATED'
    | 'APPROVAL_GATED'
    | 'RAZORPAY_ORDER_CREATED'
    | 'CHECKOUT_INITIATED'
    | 'PAYMENT_RECEIVED'
    | 'SIGNATURE_VERIFIED'
    | 'WEBHOOK_PROCESSED'
    | 'ORDER_PAID'
    | 'REVENUE_ATTRIBUTED'
    | 'PAYMENT_FAILED'
    | 'RECOVERY_TRIGGERED';
  entity: string;
  amount?: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'PENDING';
  reason: string;
  confidenceScore: number;
  verificationBadges: string[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'EVT-901',
    timestamp: '10:31:02',
    requestId: 'REQ-9401',
    conversationId: 'CONV-8812',
    customerId: 'CUST-801',
    customerName: 'Rajesh Sharma',
    agentId: 'AGENT-01',
    agentName: 'Commerce Growth Agent',
    action: 'INTENT_DETECTED',
    entity: '5G Smartphone under ₹15,000',
    amount: 14999,
    status: 'SUCCESS',
    reason: 'Customer expressed clear purchase intent for 5G phone with 128GB storage in Hinglish voice call',
    confidenceScore: 96,
    verificationBadges: ['✓ Intent Verified (96%)', '✓ Language: Hinglish'],
  },
  {
    id: 'EVT-902',
    timestamp: '10:31:04',
    requestId: 'REQ-9402',
    conversationId: 'CONV-8812',
    customerId: 'CUST-801',
    customerName: 'Rajesh Sharma',
    agentId: 'AGENT-01',
    agentName: 'Commerce Growth Agent',
    action: 'PRODUCT_VERIFIED',
    entity: 'Redmi Note 13 Pro 5G (PROD-101)',
    amount: 14999,
    status: 'SUCCESS',
    reason: 'Real-time catalogue lookup confirmed price ₹14,999, 48 units in stock, matching all user specs',
    confidenceScore: 98,
    verificationBadges: ['✓ Product Verified', '✓ Price Verified (₹14,999)', '✓ Inventory Verified (48 units)'],
  },
  {
    id: 'EVT-903',
    timestamp: '10:31:05',
    requestId: 'REQ-9403',
    conversationId: 'CONV-8812',
    customerId: 'CUST-801',
    customerName: 'Rajesh Sharma',
    agentId: 'AGENT-01',
    agentName: 'Commerce Growth Agent',
    action: 'UPSELL_OFFERED',
    entity: '67W SonicCharge Fast Power Adapter & Cable Combo',
    amount: 499,
    status: 'SUCCESS',
    reason: 'Complementary fast charger bundle presented to increase basket value and ensure device safety',
    confidenceScore: 92,
    verificationBadges: ['✓ Compatible Accessory', '✓ Bundle Value +₹499'],
  },
  {
    id: 'EVT-904',
    timestamp: '10:31:07',
    requestId: 'REQ-9404',
    conversationId: 'CONV-8812',
    customerId: 'CUST-801',
    customerName: 'Rajesh Sharma',
    agentId: 'AGENT-01',
    agentName: 'Commerce Growth Agent',
    action: 'CUSTOMER_ACCEPTED',
    entity: 'Redmi Note 13 Pro 5G + 67W Fast Charger Combo',
    amount: 15498,
    status: 'SUCCESS',
    reason: 'Customer affirmed selection: "Haan ye theek hai, payment karwa do"',
    confidenceScore: 99,
    verificationBadges: ['✓ Customer Affirmed', '✓ Total: ₹15,498'],
  },
  {
    id: 'EVT-905',
    timestamp: '10:31:08',
    requestId: 'REQ-9405',
    conversationId: 'CONV-8812',
    customerId: 'CUST-801',
    customerName: 'Rajesh Sharma',
    agentId: 'POLICY-ENGINE',
    agentName: 'Action Policy Engine',
    action: 'POLICY_EVALUATED',
    entity: 'Payment Order ₹15,498',
    amount: 15498,
    status: 'SUCCESS',
    reason: 'Amount <= ₹25,000 bound, 0% illegal discount, 1st attempt, Risk Level: LOW. Approval gate passed.',
    confidenceScore: 95,
    verificationBadges: ['✓ Max Bound Passed', '✓ Risk Score: LOW', '✓ Policy Approved'],
  },
];

type AuditListener = (events: AuditEvent[]) => void;

class AuditTrailService {
  private events: AuditEvent[] = [...INITIAL_AUDIT_LOGS];
  private listeners: Set<AuditListener> = new Set();

  public getEvents(): AuditEvent[] {
    return [...this.events];
  }

  public recordEvent(event: Omit<AuditEvent, 'id' | 'timestamp'> & { timestamp?: string }): AuditEvent {
    const timeStr = event.timestamp || new Date().toLocaleTimeString('en-US', { hour12: false });
    const fullEvent: AuditEvent = {
      ...event,
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr,
    };

    this.events.unshift(fullEvent);
    this.notifyListeners();
    return fullEvent;
  }

  public subscribe(listener: AuditListener): () => void {
    this.listeners.add(listener);
    listener([...this.events]);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const list = [...this.events];
    this.listeners.forEach((l) => l(list));
  }

  public clear() {
    this.events = [...INITIAL_AUDIT_LOGS];
    this.notifyListeners();
  }
}

export const auditTrailService = new AuditTrailService();
