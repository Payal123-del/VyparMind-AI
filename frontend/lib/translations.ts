export type LanguageMode = 'en' | 'hi' | 'hinglish';

export interface Dictionary {
  // Navigation
  navExecutiveOverview: string;
  navProductCatalogue: string;
  navOpportunityCenter: string;
  navCustomerIntelligence: string;
  navAgentControlCenter: string;
  navGrowthAutomations: string;
  navCopilotRoom: string;
  navZeroHallucination: string;
  navAuditTrail: string;
  navJudgeDemo: string;

  // Header & General
  searchPlaceholder: string;
  engineActive: string;
  startCopilot: string;
  quoteTitle: string;
  quoteBody: string;
  exploreOpportunities: string;

  // Metrics
  revenueInfluenced: string;
  revenueInfluencedDesc: string;
  conversionRate: string;
  conversionRateDesc: string;
  assistedOrders: string;
  assistedOrdersDesc: string;
  qualifiedOpportunities: string;
  qualifiedOpportunitiesDesc: string;
  intentScore: string;
  intentScoreDesc: string;
  recoveredRevenue: string;
  recoveredRevenueDesc: string;

  // Catalogue
  catalogueTitle: string;
  catalogueSubtitle: string;
  allCategories: string;
  smartphonesCategory: string;
  laptopsCategory: string;
  audioCategory: string;
  cloudCategory: string;
  officePosCategory: string;
  networkingSecurityCategory: string;
  inquireWithAi: string;
  viewDetails: string;
  addToInquiry: string;
  priceTag: string;

  // Copilot
  copilotTitle: string;
  copilotSubtitle: string;
  startVoiceCall: string;
  endVoiceCall: string;
  connectingWebRtc: string;
  userQuestion: string;
  anishaResponse: string;
  suggestedInquiries: string;
  clickToListen: string;
}

export const TRANSLATIONS: Record<LanguageMode, Dictionary> = {
  en: {
    navExecutiveOverview: 'Executive Overview',
    navProductCatalogue: 'Product Catalogue',
    navOpportunityCenter: 'Opportunity Center',
    navCustomerIntelligence: 'Customer Intelligence',
    navAgentControlCenter: 'Agent Control Center',
    navGrowthAutomations: 'Growth Automations',
    navCopilotRoom: 'AI Copilot Room',
    navZeroHallucination: 'Zero-Hallucination Guard',
    navAuditTrail: 'Agent Audit Trail',
    navJudgeDemo: 'Judge Demo Mode',

    searchPlaceholder: 'Search opportunities, products, intents...',
    engineActive: 'AI Engine Active',
    startCopilot: 'Launch AI Copilot',
    quoteTitle: 'Turn Every Customer Conversation Into Autonomous Revenue Growth',
    quoteBody: '"Every unassisted customer inquiry is lost revenue. VyaparMind AI captures 100% of customer intent, turning conversations into instant sales and 24/7 revenue velocity."',
    exploreOpportunities: 'Explore 312 Opportunities',

    revenueInfluenced: 'Revenue Influenced',
    revenueInfluencedDesc: 'AI voice & chat assisted conversions',
    conversionRate: 'AI Conversion Rate',
    conversionRateDesc: 'Conversational intent to purchase ratio',
    assistedOrders: 'AI Assisted Orders',
    assistedOrdersDesc: 'Orders finalized with AI Copilot',
    qualifiedOpportunities: 'Qualified Opportunities',
    qualifiedOpportunitiesDesc: 'High-intent leads flagged for action',
    intentScore: 'Customer Intent Score',
    intentScoreDesc: 'Average intent classification metric',
    recoveredRevenue: 'Revenue Recovered',
    recoveredRevenueDesc: 'Recovered from abandoned inquiries',

    catalogueTitle: 'Commercial Product & Services Catalogue',
    catalogueSubtitle: 'Explore high-demand smartphones, cloud infrastructure, office POS & electronics',
    allCategories: 'All Products (24)',
    smartphonesCategory: 'Smartphones (5)',
    laptopsCategory: 'Computers & Laptops (4)',
    audioCategory: 'Audio & Acoustics (3)',
    cloudCategory: 'Cloud & Business SaaS (4)',
    officePosCategory: 'Office & POS Retail (4)',
    networkingSecurityCategory: 'Networking & Security (4)',
    inquireWithAi: 'Inquire with AI',
    viewDetails: 'View Specifications',
    addToInquiry: 'Add to Inquiry',
    priceTag: 'Price / Investment',

    copilotTitle: 'Anisha — AI Commerce Copilot',
    copilotSubtitle: 'Anisha is ready to assist with real-time product recommendations, Hinglish conversation, and instant intent classification.',
    startVoiceCall: 'Start Audio Session',
    endVoiceCall: 'End Copilot Session',
    connectingWebRtc: 'Connecting WebRTC...',
    userQuestion: 'User Question:',
    anishaResponse: 'Anisha Spoken Response (Murf Falcon Audio):',
    suggestedInquiries: 'Suggested Voice Inquiries',
    clickToListen: 'Click any prompt to trigger live voice response out loud:',
  },

  hi: {
    navExecutiveOverview: 'मुख्य डैशबोर्ड (Overview)',
    navProductCatalogue: 'उत्पाद सूची (Product Catalogue)',
    navOpportunityCenter: 'अवसर केंद्र (Opportunity Center)',
    navCustomerIntelligence: 'ग्राहक बुद्धिमत्ता (Customer Intelligence)',
    navAgentControlCenter: 'एजेंट नियंत्रण केंद्र',
    navGrowthAutomations: 'विकास स्वचालन (Automations)',
    navCopilotRoom: 'AI वॉयस सहायक कक्ष',
    navZeroHallucination: 'शून्य-भ्रम सुरक्षा गार्ड',
    navAuditTrail: 'एजेंट ऑडिट ट्रेल',
    navJudgeDemo: 'जज डेमो मोड',

    searchPlaceholder: 'उत्पाद, ग्राहक इरादे, अवसर खोजें...',
    engineActive: 'AI इंजन सक्रिय',
    startCopilot: 'AI सहायक प्रारंभ करें',
    quoteTitle: 'हर ग्राहक बातचीत को व्यापार की नई कमाई में बदलें',
    quoteBody: '"बिना AI सहायता के छूटी हर ग्राहक पूछताछ खोई हुई कमाई है। VyaparMind AI 100% ग्राहक इरादे को त्वरित बिक्री और 24/7 विकास में परिवर्तित करता है।"',
    exploreOpportunities: '312 विकास अवसर देखें',

    revenueInfluenced: 'कुल प्रभावित आय (Revenue)',
    revenueInfluencedDesc: 'AI वॉयस और चैट द्वारा जनरेट की गई बिक्री',
    conversionRate: 'AI रूपांतरण दर',
    conversionRateDesc: 'बातचीत से सीधी खरीदारी का अनुपात',
    assistedOrders: 'AI सहायता प्राप्त ऑर्डर',
    assistedOrdersDesc: 'AI सह-पायलट द्वारा अंतिम रूप दिए गए ऑर्डर',
    qualifiedOpportunities: 'योग्य बिक्री अवसर',
    qualifiedOpportunitiesDesc: 'उच्च-इरादे वाले ग्राहक अवसर',
    intentScore: 'ग्राहक इरादा स्कोर',
    intentScoreDesc: 'खरीदारी की संभावना का औसत स्कोर',
    recoveredRevenue: 'पुनर्प्राप्त खोई हुई आय',
    recoveredRevenueDesc: 'अधूरे छूटे ऑर्डरों से वापस मिली कमाई',

    catalogueTitle: 'व्यावसायिक उत्पाद एवं सेवा सूची',
    catalogueSubtitle: 'उच्च-मांग वाले स्मार्टफोन, क्लाउड इंफ्रास्ट्रक्चर, ऑफिस पीओएस और इलेक्ट्रॉनिक्स एक्सप्लोर करें',
    allCategories: 'सभी उत्पाद (24)',
    smartphonesCategory: 'स्मार्टफोन (5)',
    laptopsCategory: 'कंप्यूटर एवं लैपटॉप (4)',
    audioCategory: 'ऑडियो और हेडफोन (3)',
    cloudCategory: 'क्लाउड और सॉफ्टवेयर (4)',
    officePosCategory: 'ऑफिस व रिटेल POS (4)',
    networkingSecurityCategory: 'नेटवर्किंग व सुरक्षा (4)',
    inquireWithAi: 'AI से पूछताछ करें',
    viewDetails: 'विवरण देखें',
    addToInquiry: 'पूछताछ में जोड़ें',
    priceTag: 'मूल्य / निवेश',

    copilotTitle: 'अनीशा — AI कॉमर्स सह-पायलट',
    copilotSubtitle: 'अनीशा प्राकृतिक हिंदी और अंग्रेजी भाषा में उत्पाद सिफारिशों के लिए तैयार है।',
    startVoiceCall: 'वॉयस कॉल शुरू करें',
    endVoiceCall: 'सत्र समाप्त करें',
    connectingWebRtc: 'WebRTC कनेक्ट हो रहा है...',
    userQuestion: 'ग्राहक का प्रश्न:',
    anishaResponse: 'अनीशा का उत्तर (ऑडियो द्वारा):',
    suggestedInquiries: 'सुझाए गए वॉयस प्रश्न',
    clickToListen: 'वास्तविक वॉयस उत्तर सुनने के लिए प्रश्न पर क्लिक करें:',
  },

  hinglish: {
    navExecutiveOverview: 'Executive Overview',
    navProductCatalogue: 'Product Catalogue (24 Items)',
    navOpportunityCenter: 'Opportunity Center (+5)',
    navCustomerIntelligence: 'Customer Intelligence',
    navAgentControlCenter: 'Agent Control Center',
    navGrowthAutomations: 'Growth Automations',
    navCopilotRoom: 'AI Copilot Room',
    navZeroHallucination: 'Zero-Hallucination Guard',
    navAuditTrail: 'Agent Audit Trail',
    navJudgeDemo: 'Judge Demo Mode ⚡',

    searchPlaceholder: 'Search opportunities, products, intent...',
    engineActive: 'AI Engine Active',
    startCopilot: 'AI Copilot Start Karein',
    quoteTitle: 'Har Customer Baatchaat ko Banaayein Vyapaar ki Nayi Kamai',
    quoteBody: '"Bina AI assistance ke chhuti har customer inquiry lost revenue hai. VyaparMind AI karta hai 100% customer intent ko instant sales aur 24/7 revenue growth mein convert."',
    exploreOpportunities: '312 Growth Opportunities Dekhein',

    revenueInfluenced: 'Total Influenced Kamai',
    revenueInfluencedDesc: 'AI Voice aur Chat se generated sales',
    conversionRate: 'AI Conversion Rate',
    conversionRateDesc: 'Customer baatchaat se direct khareedi ratio',
    assistedOrders: 'AI Assisted Orders',
    assistedOrdersDesc: 'AI Copilot se final hue orders',
    qualifiedOpportunities: 'High Intent Leads',
    qualifiedOpportunitiesDesc: 'Taza khareeddar leads ready for action',
    intentScore: 'Customer Intent Score',
    intentScoreDesc: 'Customer ki khareedne ki ichha score',
    recoveredRevenue: 'Recovered Lost Revenue',
    recoveredRevenueDesc: 'Chhute hue customer inquiries se wapas mili kamai',

    catalogueTitle: 'Commercial Product & Services Catalogue',
    catalogueSubtitle: 'Full catalogue: smartphones, cloud infrastructure, office POS & premium tech items',
    allCategories: 'All Products (24)',
    smartphonesCategory: 'Smartphones (5)',
    laptopsCategory: 'Computers & Laptops (4)',
    audioCategory: 'Audio & Headphones (3)',
    cloudCategory: 'Cloud & SaaS Plans (4)',
    officePosCategory: 'Office & POS Devices (4)',
    networkingSecurityCategory: 'Networking & Security (4)',
    inquireWithAi: 'Inquire with AI',
    viewDetails: 'Specs Dekhein',
    addToInquiry: 'Add to Inquiry',
    priceTag: 'Price / Offer',

    copilotTitle: 'Anisha — AI Commerce Copilot',
    copilotSubtitle: 'Anisha ready hai aapki help ke liye in Hinglish, English & Hindi with natural voice synthesis.',
    startVoiceCall: 'Voice Call Start Karein',
    endVoiceCall: 'Session End Karein',
    connectingWebRtc: 'WebRTC Connecting...',
    userQuestion: 'User Question:',
    anishaResponse: 'Anisha Spoken Response (Murf Falcon Audio):',
    suggestedInquiries: 'Hinglish Voice Inquiries Test',
    clickToListen: 'Click karke real audio speech response suniye:',
  },
};
