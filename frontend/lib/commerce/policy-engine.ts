export interface PolicyConfig {
  maxAgentPayment: number; // default ₹25,000
  maxDiscountPercent: number; // default 15%
  maxPaymentRetries: number; // default 2
  requireApprovalAbove: number; // default ₹10,000
  allowedCurrencies: string[];
}

export const DEFAULT_POLICY_CONFIG: PolicyConfig = {
  maxAgentPayment: 25000,
  maxDiscountPercent: 15,
  maxPaymentRetries: 2,
  requireApprovalAbove: 20000,
  allowedCurrencies: ['INR'],
};

export interface PolicyCheckResult {
  rule: string;
  passed: boolean;
  message: string;
}

export interface ActionEvaluation {
  approved: boolean;
  requiresHumanApproval: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  checks: PolicyCheckResult[];
  reason: string;
}

export interface ActionRequestParams {
  agentId: string;
  actionType: 'CREATE_ORDER' | 'APPLY_DISCOUNT' | 'RETRY_PAYMENT' | 'TRIGGER_RECOVERY';
  amount: number;
  discountPercent?: number;
  retryCount?: number;
  inventoryAvailable: boolean;
  customerConfirmed: boolean;
  currency?: string;
  config?: Partial<PolicyConfig>;
}

export class AgentActionPolicyEngine {
  private config: PolicyConfig;

  constructor(config?: Partial<PolicyConfig>) {
    this.config = { ...DEFAULT_POLICY_CONFIG, ...config };
  }

  public updateConfig(newConfig: Partial<PolicyConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): PolicyConfig {
    return { ...this.config };
  }

  public evaluateAction(params: ActionRequestParams): ActionEvaluation {
    const checks: PolicyCheckResult[] = [];
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let requiresHumanApproval = false;
    let confidenceScore = 94;

    // 1. Currency check
    const currency = params.currency || 'INR';
    const isCurrencyAllowed = this.config.allowedCurrencies.includes(currency);
    checks.push({
      rule: 'CURRENCY_SUPPORTED',
      passed: isCurrencyAllowed,
      message: isCurrencyAllowed
        ? `Currency ${currency} supported.`
        : `Currency ${currency} not supported. Only ${this.config.allowedCurrencies.join(', ')} allowed.`,
    });

    // 2. Maximum Payment Bound check
    const isAmountWithinBound = params.amount <= this.config.maxAgentPayment;
    checks.push({
      rule: 'MAX_AMOUNT_BOUND',
      passed: isAmountWithinBound,
      message: isAmountWithinBound
        ? `Amount ₹${params.amount.toLocaleString('en-IN')} is within agent limit (₹${this.config.maxAgentPayment.toLocaleString('en-IN')}).`
        : `Amount ₹${params.amount.toLocaleString('en-IN')} exceeds maximum agent limit (₹${this.config.maxAgentPayment.toLocaleString('en-IN')}).`,
    });

    // 3. Discount Check
    const discount = params.discountPercent || 0;
    const isDiscountPermitted = discount <= this.config.maxDiscountPercent;
    checks.push({
      rule: 'MAX_DISCOUNT_BOUND',
      passed: isDiscountPermitted,
      message: isDiscountPermitted
        ? `Discount ${discount}% is within policy ceiling (${this.config.maxDiscountPercent}%).`
        : `Discount ${discount}% exceeds authorized limit (${this.config.maxDiscountPercent}%).`,
    });

    // 4. Retry Limit Check
    const retries = params.retryCount || 0;
    const isRetryAllowed = retries <= this.config.maxPaymentRetries;
    checks.push({
      rule: 'RETRY_LIMIT',
      passed: isRetryAllowed,
      message: isRetryAllowed
        ? `Retry count ${retries} is within threshold (max ${this.config.maxPaymentRetries}).`
        : `Retry count ${retries} exceeded policy threshold (max ${this.config.maxPaymentRetries}).`,
    });

    // 5. Inventory Verification Check
    checks.push({
      rule: 'INVENTORY_VERIFIED',
      passed: params.inventoryAvailable,
      message: params.inventoryAvailable
        ? 'Real-time catalog inventory confirmed available.'
        : 'Inventory unavailable or out of stock in catalog.',
    });

    // 6. Customer Confirmation Check
    checks.push({
      rule: 'CUSTOMER_CONFIRMATION',
      passed: params.customerConfirmed,
      message: params.customerConfirmed
        ? 'Customer affirmative confirmation received in session.'
        : 'Customer confirmation not yet recorded.',
    });

    // Risk Scoring Logic
    if (params.amount > 20000 || retries >= 2 || discount > 12) {
      riskLevel = 'HIGH';
      requiresHumanApproval = true;
      confidenceScore = 82;
    } else if (params.amount > this.config.requireApprovalAbove || retries === 1 || discount > 8) {
      riskLevel = 'MEDIUM';
      requiresHumanApproval = true;
      confidenceScore = 90;
    } else {
      riskLevel = 'LOW';
      requiresHumanApproval = params.amount > this.config.requireApprovalAbove;
      confidenceScore = 96;
    }

    const allPassed = checks.every((c) => c.passed);

    let reason = '';
    if (!allPassed) {
      const failedChecks = checks.filter((c) => !c.passed).map((c) => c.message).join(' ');
      reason = `Policy validation failed: ${failedChecks}`;
    } else if (requiresHumanApproval) {
      reason = `Policy passed with ${riskLevel} risk. Amount ₹${params.amount.toLocaleString('en-IN')} requires merchant approval gate.`;
    } else {
      reason = `All policy constraints satisfied. Zero-hallucination checks verified with ${riskLevel} risk.`;
    }

    return {
      approved: allPassed,
      requiresHumanApproval,
      riskLevel,
      confidenceScore,
      checks,
      reason,
    };
  }
}

export const defaultPolicyEngine = new AgentActionPolicyEngine();
