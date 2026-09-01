export type OrderStatus =
  | 'DISCOVERED'
  | 'RECOMMENDED'
  | 'ACCEPTED'
  | 'CHECKOUT_CREATED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'PAYMENT_FAILED'
  | 'RETRY_AVAILABLE'
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  isCrossSell?: boolean;
}

export interface CommerceOrder {
  orderId: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentVerifiedAt?: string;
  webhookProcessedAt?: string;
  revenueAttributed: boolean;
  attributionType?: 'AI_DIRECT' | 'AI_INFLUENCED' | 'RECOVERY' | 'UPSELL';
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DISCOVERED: ['RECOMMENDED', 'CANCELLED'],
  RECOMMENDED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['CHECKOUT_CREATED', 'CANCELLED'],
  CHECKOUT_CREATED: ['PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['RETRY_AVAILABLE', 'CANCELLED'],
  RETRY_AVAILABLE: ['PAYMENT_PENDING', 'CANCELLED'],
  PAID: [], // Final terminal state
  CANCELLED: [], // Terminal state
};

export class OrderStateMachine {
  public static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const allowed = VALID_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  public static transition(order: CommerceOrder, newStatus: OrderStatus, note?: string): CommerceOrder {
    if (!this.canTransition(order.status, newStatus)) {
      throw new Error(
        `Invalid order state transition from ${order.status} to ${newStatus} for Order #${order.orderId}`
      );
    }

    const timestamp = new Date().toISOString();
    return {
      ...order,
      status: newStatus,
      updatedAt: timestamp,
      statusHistory: [
        ...order.statusHistory,
        {
          status: newStatus,
          timestamp,
          note: note || `State transitioned to ${newStatus}`,
        },
      ],
    };
  }
}
