export interface AttributionMetrics {
  grossRevenue: number;
  aiDirectRevenue: number;
  aiInfluencedRevenue: number;
  recoveredRevenue: number;
  upsellRevenue: number;
  assistedOrdersCount: number;
  conversionRate: number;
  averageOrderValue: number;
  paymentSuccessRate: number;
  razorpayTestTransactionsCount: number;
  razorpayTestVolume: number;
  lastUpdated: string;
}

export interface TransactionRecord {
  id: string;
  orderId: string;
  razorpayPaymentId: string;
  amount: number;
  attributionType: 'AI_DIRECT' | 'AI_INFLUENCED' | 'RECOVERY' | 'UPSELL';
  productName: string;
  customerName: string;
  isSimulatedDemo: boolean;
  timestamp: string;
}

const INITIAL_METRICS: AttributionMetrics = {
  grossRevenue: 485200,
  aiDirectRevenue: 342800,
  aiInfluencedRevenue: 142400,
  recoveredRevenue: 112400,
  upsellRevenue: 34800,
  assistedOrdersCount: 1420,
  conversionRate: 28.4,
  averageOrderValue: 12450,
  paymentSuccessRate: 98.2,
  razorpayTestTransactionsCount: 14,
  razorpayTestVolume: 89480,
  lastUpdated: '10:31:25',
};

type MetricsListener = (metrics: AttributionMetrics, recentTransactions: TransactionRecord[]) => void;

class RevenueAttributionService {
  private metrics: AttributionMetrics = { ...INITIAL_METRICS };
  private transactions: TransactionRecord[] = [
    {
      id: 'TXN-701',
      orderId: 'ORD-9801',
      razorpayPaymentId: 'pay_test_9801a',
      amount: 15498,
      attributionType: 'AI_DIRECT',
      productName: 'Redmi Note 13 Pro 5G + 67W Charger Combo',
      customerName: 'Rajesh Sharma',
      isSimulatedDemo: false,
      timestamp: '10:31:24',
    },
    {
      id: 'TXN-702',
      orderId: 'ORD-9802',
      razorpayPaymentId: 'pay_test_9802b',
      amount: 4249,
      attributionType: 'RECOVERY',
      productName: 'VyaparCloud 2TB Storage Plan (Annual)',
      customerName: 'Ananya Verma',
      isSimulatedDemo: false,
      timestamp: '09:14:10',
    },
    {
      id: 'TXN-703',
      orderId: 'ORD-9803',
      razorpayPaymentId: 'pay_test_9803c',
      amount: 3149,
      attributionType: 'UPSELL',
      productName: 'Pro Audio Active Noise-Cancelling Headphones',
      customerName: 'Vikram Patel',
      isSimulatedDemo: true,
      timestamp: 'Yesterday',
    },
  ];
  private listeners: Set<MetricsListener> = new Set();

  public getMetrics(): AttributionMetrics {
    return { ...this.metrics };
  }

  public getRecentTransactions(): TransactionRecord[] {
    return [...this.transactions];
  }

  public attributePayment(params: {
    orderId: string;
    razorpayPaymentId: string;
    amount: number;
    attributionType: 'AI_DIRECT' | 'AI_INFLUENCED' | 'RECOVERY' | 'UPSELL';
    productName: string;
    customerName: string;
    isSimulatedDemo?: boolean;
  }) {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // Update metrics
    this.metrics.grossRevenue += params.amount;
    if (params.attributionType === 'AI_DIRECT') {
      this.metrics.aiDirectRevenue += params.amount;
    } else if (params.attributionType === 'RECOVERY') {
      this.metrics.recoveredRevenue += params.amount;
    } else if (params.attributionType === 'UPSELL') {
      this.metrics.upsellRevenue += params.amount;
    } else {
      this.metrics.aiInfluencedRevenue += params.amount;
    }

    this.metrics.assistedOrdersCount += 1;
    this.metrics.razorpayTestTransactionsCount += 1;
    this.metrics.razorpayTestVolume += params.amount;
    this.metrics.averageOrderValue = Math.round(
      this.metrics.grossRevenue / Math.max(1, this.metrics.assistedOrdersCount)
    );
    this.metrics.lastUpdated = timestamp;

    const newTxn: TransactionRecord = {
      id: `TXN-${Date.now()}`,
      orderId: params.orderId,
      razorpayPaymentId: params.razorpayPaymentId,
      amount: params.amount,
      attributionType: params.attributionType,
      productName: params.productName,
      customerName: params.customerName,
      isSimulatedDemo: params.isSimulatedDemo || false,
      timestamp,
    };

    this.transactions.unshift(newTxn);
    this.notifyListeners();
  }

  public subscribe(listener: MetricsListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.metrics }, [...this.transactions]);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const metricsCopy = { ...this.metrics };
    const txnsCopy = [...this.transactions];
    this.listeners.forEach((l) => l(metricsCopy, txnsCopy));
  }
}

export const revenueAttributionService = new RevenueAttributionService();
