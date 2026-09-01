export interface CommerceMemory {
  customerId: string;
  customerName: string;
  preferredLanguage: 'Hinglish' | 'English' | 'Hindi';
  targetBudget?: number;
  viewedProductIds: string[];
  lastInquiryTopic?: string;
  cartProductIds: string[];
  purchaseHistory: {
    orderId: string;
    productName: string;
    amount: number;
    date: string;
  }[];
  intentScore: number;
  lastUpdated: string;
}

const DEFAULT_MEMORY: Record<string, CommerceMemory> = {
  'CUST-801': {
    customerId: 'CUST-801',
    customerName: 'Rajesh Sharma',
    preferredLanguage: 'Hinglish',
    targetBudget: 15000,
    viewedProductIds: ['PROD-101'],
    lastInquiryTopic: '5G smartphone under 15k with 128GB storage',
    cartProductIds: ['PROD-101', 'PROD-302'],
    purchaseHistory: [
      { orderId: 'ORD-9801', productName: 'Redmi Note 13 Pro 5G', amount: 14999, date: '2026-08-15' },
    ],
    intentScore: 96,
    lastUpdated: '10:31:02',
  },
  'CUST-802': {
    customerId: 'CUST-802',
    customerName: 'Ananya Verma',
    preferredLanguage: 'English',
    targetBudget: 5000,
    viewedProductIds: ['PROD-107'],
    lastInquiryTopic: '2TB Cloud Storage Annual Discount',
    cartProductIds: ['PROD-107'],
    purchaseHistory: [],
    intentScore: 89,
    lastUpdated: '09:14:10',
  },
};

class CustomerMemoryStore {
  private memoryMap: Map<string, CommerceMemory> = new Map();

  constructor() {
    Object.entries(DEFAULT_MEMORY).forEach(([id, mem]) => {
      this.memoryMap.set(id, { ...mem });
    });
  }

  public getMemory(customerId: string): CommerceMemory | undefined {
    return this.memoryMap.get(customerId);
  }

  public updateMemory(customerId: string, updates: Partial<CommerceMemory>): CommerceMemory {
    const current = this.memoryMap.get(customerId) || {
      customerId,
      customerName: 'Guest User',
      preferredLanguage: 'Hinglish',
      viewedProductIds: [],
      cartProductIds: [],
      purchaseHistory: [],
      intentScore: 50,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };

    const updated: CommerceMemory = {
      ...current,
      ...updates,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };

    this.memoryMap.set(customerId, updated);
    return updated;
  }

  public clearMemory(customerId: string) {
    if (this.memoryMap.has(customerId)) {
      const current = this.memoryMap.get(customerId)!;
      this.memoryMap.set(customerId, {
        customerId,
        customerName: current.customerName,
        preferredLanguage: 'Hinglish',
        viewedProductIds: [],
        cartProductIds: [],
        purchaseHistory: [],
        intentScore: 0,
        lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false }),
      });
    }
  }

  public resetAll() {
    this.memoryMap.clear();
    Object.entries(DEFAULT_MEMORY).forEach(([id, mem]) => {
      this.memoryMap.set(id, { ...mem });
    });
  }
}

export const customerMemoryStore = new CustomerMemoryStore();
