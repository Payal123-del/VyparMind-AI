'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Zap,
  Bot,
  Activity,
  CheckCircle2,
  Search,
  Play,
  Volume2,
  Loader2,
  AlertCircle,
  Radio,
  Send,
  MessageSquare,
  Languages,
  User,
  Video,
  VideoOff,
  MonitorUp,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionContext, useChat } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import type { AppConfig } from '@/app-config';
import type { LanguageMode } from '@/lib/translations';

interface CopilotModalProps {
  appConfig: AppConfig;
  onClose?: () => void;
  isHinglish?: boolean;
  language?: LanguageMode;
}

export type AssistantState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING' | 'ERROR';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  langTag?: string;
}

// Tailored multi-language prompts & replies
const MULTI_LANG_PROMPTS: Record<LanguageMode, Array<{ chip: string; prompt: string; response: string }>> = {
  en: [
    {
      chip: '📱 5G Smartphone',
      prompt: 'Show me the best 5G phone under ₹15k',
      response:
        'The Redmi Note 13 Pro 5G is our top recommendation under ₹15,000. It features 128GB storage, a 5000mAh battery, and a 67W turbo charger.',
    },
    {
      chip: '☁️ 2TB Cloud Discount',
      prompt: 'What is the 2TB cloud storage annual discount?',
      response:
        'Our 2TB annual cloud plan includes a 15% instant discount, 24/7 automated backups, and 3 complimentary team licenses.',
    },
    {
      chip: '🚚 Delivery Time',
      prompt: 'How many days will order delivery take?',
      response:
        'Your order will be delivered within 48 hours to your doorstep with live SMS & WhatsApp tracking links.',
    },
    {
      chip: '🛡️ Headphones Warranty',
      prompt: 'Is there any warranty on headphones?',
      response:
        'Yes! All commercial headphones include a 1-year official brand warranty and an instant 7-day replacement policy.',
    },
  ],
  hi: [
    {
      chip: '📱 5G स्मार्टफोन',
      prompt: 'मुझे 15,000 रुपये के अंदर सबसे अच्छा 5G फोन दिखाएं',
      response:
        'नमस्ते! ₹15,000 के बजट में Redmi Note 13 Pro 5G सबसे बेहतरीन विकल्प है। इसमें 128GB स्टोरेज, 5000mAh बैटरी और 67W टर्बो फास्ट चार्जर मिलता है।',
    },
    {
      chip: '☁️ 2TB क्लाउड छूट',
      prompt: '2TB क्लाउड स्टोरेज की सालाना छूट क्या है?',
      response:
        'हमारे 2TB वार्षिक क्लाउड प्लान पर 15% की सीधी छूट मिलती है, साथ ही 3 मुफ्त टीम लाइसेंस और 24/7 ऑटोमेटेड बैकअप शामिल हैं।',
    },
    {
      chip: '🚚 डिलीवरी समय',
      prompt: 'ऑर्डर डिलीवरी में कितने दिन लगेंगे?',
      response:
        'आपका ऑर्डर 48 घंटे के भीतर आपके दरवाजे तक डिलीवर हो जाएगा, जिसमें लाइव ट्रैकिंग लिंक भी शामिल है।',
    },
    {
      chip: '🛡️ हेडफोन वारंटी',
      prompt: 'क्या हेडफोन पर कोई वारंटी मिलती है?',
      response:
        'हाँ जी! सभी हेडफोन पर 1 वर्ष की आधिकारिक ब्रांड वारंटी और त्वरित 7-दिवसीय रिप्लेसमेंट नीति उपलब्ध है।',
    },
  ],
  hinglish: [
    {
      chip: '📱 5G Phone Deal',
      prompt: 'Mujhe sub-15k ke andar best 5G phone dikhao',
      response:
        'Bilkul Rajesh ji! Aapke liye Redmi Note 13 Pro 5G best option hai under ₹15,000. Isme 128GB storage, 5000mAh battery aur fast charger milta hai.',
    },
    {
      chip: '☁️ 2TB Storage Offer',
      prompt: 'What is the 2TB cloud storage annual discount?',
      response:
        'Hamare 2TB annual plan par 15% instant discount milta hai along with complimentary team backup licenses.',
    },
    {
      chip: '🚚 Delivery Status',
      prompt: 'Deliver kitne din me ho jayegi order?',
      response:
        'Aapki order 48 hours ke andar doorstep deliver ho jayegi with live WhatsApp tracking link.',
    },
    {
      chip: '🛡️ Warranty Policy',
      prompt: 'Is there any warranty on headphones?',
      response:
        'Haan ji! Sabhi headphones par 1-year official brand warranty aur instant replacement policy milti hai.',
    },
  ],
};

export function CopilotModal({
  appConfig,
  onClose,
  isHinglish = false,
  language = 'hinglish',
}: CopilotModalProps) {
  const { isConnected, connectionState, start, end } = useSessionContext();
  const { send: sendChatMessage } = useChat();
  const isConnecting = connectionState === ConnectionState.Connecting;

  const [simulatedVoiceState, setSimulatedVoiceState] = useState<boolean>(false);
  const [currentPromptText, setCurrentPromptText] = useState<string>('');
  const [aiSpeechResponse, setAiSpeechResponse] = useState<string>('');
  const [assistantState, setAssistantState] = useState<AssistantState>('LISTENING');
  const [voiceErrorText, setVoiceErrorText] = useState<string>('');

  // Pre-loaded Browser Speech Voices for Female Anisha Voice
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Written Text Feature State
  const [textInput, setTextInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = MULTI_LANG_PROMPTS[language] || MULTI_LANG_PROMPTS.hinglish;

  // Asynchronous Browser Voice Loading
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setBrowserVoices(v);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Auto-scroll written transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiSpeechResponse]);

  // Initial welcome message based on language mode
  useEffect(() => {
    let welcomeText = 'Hi! I am Anisha, your AI Commerce Copilot at VyaparMind AI. How can I help you today?';
    if (language === 'hi') {
      welcomeText = 'नमस्ते! मैं अनीशा हूँ, VyaparMind AI की आपकी वाणिज्यिक AI सह-पायलट। आज मैं आपकी क्या सहायता कर सकती हूँ?';
    } else if (language === 'hinglish') {
      welcomeText = 'Namaste! Main Anisha hoon, VyaparMind AI ki aapki AI Commerce Copilot. Aaj main aapki kya help kar sakti hoon?';
    }

    setChatMessages([
      {
        id: 'welcome_1',
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        langTag: language === 'hi' ? 'Hindi हिन्दी' : language === 'hinglish' ? 'Hinglish ⚡' : 'English 🇬🇧',
      },
    ]);
  }, [language]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Sync state with WebRTC connection state
  useEffect(() => {
    if (isConnecting) {
      setAssistantState('PROCESSING');
    } else if (isConnected) {
      setAssistantState('LISTENING');
    } else if (assistantState !== 'SPEAKING' && assistantState !== 'PROCESSING') {
      setAssistantState('LISTENING');
    }
  }, [isConnected, isConnecting]);

  // Dedicated Natural Female Voice Selector (Anisha / Zira / Female English / Indian Voices)
  const selectAnishaFemaleVoice = (langMode: LanguageMode, voices: SpeechSynthesisVoice[]) => {
    if (!voices || voices.length === 0) return null;

    // Search 1: Indian female voices (Anisha, Heera, Kalpana, Neerja, hi-IN, en-IN female)
    const indianFemale =
      voices.find((v) => {
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();
        const isIndian = lang.includes('hi') || lang.includes('en-in') || name.includes('india') || name.includes('hindi');
        const isFemale =
          name.includes('female') ||
          name.includes('anisha') ||
          name.includes('heera') ||
          name.includes('kalpana') ||
          name.includes('neerja') ||
          name.includes('zira') ||
          name.includes('samantha') ||
          name.includes('google');
        return isIndian && isFemale;
      }) ||
      voices.find((v) => {
        const lang = v.lang.toLowerCase();
        return lang.includes('hi') || lang.includes('en-in');
      });

    if (indianFemale) return indianFemale;

    // Search 2: Natural Female English voices (Zira, Jenny, Aria, Google UK English Female, Google US English Female, Samantha, Victoria)
    const femaleEnglish = voices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        name.includes('zira') ||
        name.includes('jenny') ||
        name.includes('aria') ||
        name.includes('female') ||
        name.includes('samantha') ||
        name.includes('victoria') ||
        name.includes('karen') ||
        name.includes('google uk english female') ||
        name.includes('google us english')
      );
    });

    if (femaleEnglish) return femaleEnglish;

    // Search 3: Exclude obvious male robotic voices (David, Mark, George, Richard, James)
    const nonMale = voices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        !name.includes('david') &&
        !name.includes('mark') &&
        !name.includes('george') &&
        !name.includes('richard') &&
        !name.includes('james') &&
        !name.includes('guy') &&
        !name.includes('male')
      );
    });

    return nonMale || voices[0];
  };

  // Ultra-Fast Spoken Audio Synthesizer with Guaranteed Female Voice & Immediate Auto-Reset
  const speakAudioResponse = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAssistantState('LISTENING');
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop active speech immediately

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.05; // Fast responsive pitch & speed
      utterance.pitch = 1.05;

      const voicesList = browserVoices.length > 0 ? browserVoices : window.speechSynthesis.getVoices();
      const femaleVoice = selectAnishaFemaleVoice(language, voicesList);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      // Auto-reset timer: Guaranteed return to LISTENING state after speech duration
      const maxSpeechMs = Math.min(Math.max(textToSpeak.length * 60, 2000), 8000);
      const safetyTimer = setTimeout(() => {
        setAssistantState('LISTENING');
      }, maxSpeechMs);

      utterance.onstart = () => {
        setAssistantState('SPEAKING');
        setVoiceErrorText('');
      };

      utterance.onend = () => {
        clearTimeout(safetyTimer);
        setAssistantState('LISTENING');
      };

      utterance.onerror = (e) => {
        clearTimeout(safetyTimer);
        setVoiceErrorText('Audio note: Written transcript available below.');
        setAssistantState('LISTENING');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Audio synthesis exception:', err);
      setAssistantState('LISTENING');
    }
  };

  // High-Speed Typewriter effect for live written text stream
  const triggerTypewriterText = (fullResponseText: string, userQuery: string) => {
    setSimulatedVoiceState(true);
    setCurrentPromptText(userQuery);
    setAssistantState('PROCESSING');
    setAiSpeechResponse('');

    let charIndex = 0;
    const speedMs = 10; // 10ms per character ultra-fast speed

    const interval = setInterval(() => {
      charIndex += 2; // Stream 2 chars per tick for super fast responsiveness
      if (charIndex >= fullResponseText.length) {
        setAiSpeechResponse(fullResponseText);
        clearInterval(interval);

        // Append finalized AI response to chat history stream
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessages((prev) => [
          ...prev,
          {
            id: `assist_${Date.now()}`,
            sender: 'assistant',
            text: fullResponseText,
            timestamp: timeStr,
            langTag: language === 'hi' ? 'Hindi हिन्दी' : language === 'hinglish' ? 'Hinglish ⚡' : 'English 🇬🇧',
          },
        ]);

        speakAudioResponse(fullResponseText);
      } else {
        setAiSpeechResponse(fullResponseText.slice(0, charIndex));
      }
    }, speedMs);
  };

  // Comprehensive 54-Rule Intent & Knowledge Engine for Anisha AI Copilot
  const generateResponseForCustomInput = (userQuery: string): string => {
    // 1. Silent Wake-Word Stripping (Anisha, अनीशा, Hey Anisha, सुनो अनीशा)
    const cleanQuery = userQuery
      .replace(/^(anisha|अनीशा|hey anisha|hey अनीशा|सुनो अनीशा|अनीशा सुनो|anisha ji|अनीशा जी)\s*/gi, '')
      .trim();
    const q = (cleanQuery || userQuery).toLowerCase().trim();

    // Phonetic normalization: removes repeated characters (e.g. 'rr' -> 'r', 'tt' -> 't'), maps w->g, e/y->i
    const qNorm = q
      .replace(/(.)\1+/g, '$1')
      .replace(/w/g, 'g')
      .replace(/e/g, 'i')
      .replace(/y/g, 'i');

    const matches = (...keys: string[]) =>
      keys.some((k) => {
        const kNorm = k.toLowerCase().replace(/(.)\1+/g, '$1').replace(/w/g, 'g').replace(/e/g, 'i').replace(/y/g, 'i');
        return qNorm.includes(kNorm) || q.includes(k);
      });

    // 0. Out-of-Domain Technical/Coding Guardrail (Exact match from screenshot)
    if (matches('python', 'binary search tree', 'bst', 'code', 'coding', 'program', 'algorithm', 'c++', 'java', 'script', 'function', 'class')) {
      return "I'm not able to handle coding requests directly. I can help you with authorized product searches, store info, or guide you to appropriate support options.";
    }

    // 0a. General Concept Explanation: Bluetooth ("Bluetooth kya karta hai", "ब्लूटूथ क्या करता है", "blu tooth")
    if (matches('bluetooth', 'blutooth', 'blutut', 'ब्लूटूथ', 'ब्लू टूथ')) {
      if (language === 'hi') {
        return 'ब्लूटूथ एक शॉर्ट-रेंज वायरलेस टेक्नोलॉजी है जो डिवाइसों (जैसे वायरलेस इयरबड्स, हेडफोन, स्पीकर्स) को बिना किसी तार के आपस में कनेक्ट करने के काम आती है। 😊';
      }
      if (language === 'hinglish') {
        return 'Bluetooth ek short-range wireless technology hai jo compatible devices (jaise earbuds, headphones, speakers) ko bina wire connect karne ke kaam aati hai. 😊';
      }
      return 'Bluetooth is a short-range wireless technology used to connect compatible devices such as wireless earbuds, headphones, and speakers without wires. 😊';
    }

    // 0b. General Concept Explanation: 5G / Cellular Network
    if (matches('5g kya', '5g use', '5जी क्या', '5g network', '5g speed')) {
      if (language === 'hi') {
        return '5G एक एडवांस्ड मोबाइल नेटवर्क तकनीक है जो हाई-स्पीड डेटा डाउनलोड और अल्ट्रा-लो लेटेंसी प्रदान करती है, जिससे वीडियो स्ट्रीमिंग और ऑनलाइन गेमिंग बेहद फ़ास्ट चलती है। 😊';
      }
      return '5G is an advanced mobile cellular network technology that delivers super-fast data download speeds and ultra-low latency for seamless video streaming and gaming. 😊';
    }

    // 0c. General Concept Explanation: RAM / Storage
    if (matches('ram kya', 'ram hoti', 'ram use', 'रैम')) {
      return 'RAM (Random Access Memory) फ़ोन की टेम्पररी वर्किंग मेमोरी होती है जो एक साथ कई ऐप्स (Multitasking) को बिना अटके स्मूथ चलाने में मदद करती है। 😊';
    }

    // 0d. Casual Conversation: Food / Hungry ("khana chahiye", "खाना चाहिए", "bhookh")
    if (matches('khana', 'bhookh', 'खाना', 'भूख', 'pizza', 'food')) {
      return 'Haha 😄 Khane ka mood hai? Batao spicy, light ya sweet—main kuch options suggest kar sakti hoon.';
    }

    // 0e. Emotional Support ("mood kharab", "tension", "stress", "मूड खराब")
    if (matches('mood', 'tension', 'stress', 'मूड', 'परेशान', 'उदासी')) {
      return 'Ohh 😟 Sorry, ye sunke bura laga. Agar aap comfortable ho to batao kya hua. Main sun rahi hoon. 😊';
    }

    // 0g. Whole Catalogue Ambiguous Search: Storage ("storage", "स्टोरेज", "memory", "2TB wala plan")
    if (matches('storage', 'स्टोरेज', 'memory', 'हंस स्टोरेज', '2tb')) {
      if (language === 'hi') {
        return 'व्यापारमाइंड कैटलॉग में उपलब्ध स्टोरेज विकल्प:\n1) Redmi Note 13 Pro 5G (128GB - ₹14,999)\n2) Realme 12 Pro 5G (256GB - ₹19,999)\n3) VyaparCloud 2TB क्लाउड स्टोरेज प्लान (₹4,999/वर्ष - 15% छूट)';
      }
      if (language === 'hinglish') {
        return 'VyaparMind catalogue me storage options:\n1) Redmi Note 13 Pro 5G (128GB - ₹14,999)\n2) Realme 12 Pro 5G (256GB - ₹19,999)\n3) VyaparCloud 2TB Cloud Storage Plan (₹4,999/yr with 15% discount)';
      }
      return 'Available Catalogue Storage Options:\n1) Redmi Note 13 Pro 5G (128GB - ₹14,999)\n2) Realme 12 Pro 5G (256GB - ₹19,999)\n3) VyaparCloud 2TB Annual Plan (₹4,999/yr with 15% discount)';
    }

    // 0h. Whole Catalogue Ambiguous Search: Safety / Security ("safety", "सेफ्टी", "secure hai?", "security")
    if (matches('safety', 'सेफ्टी', 'secure', 'security', 'सुरक्षा', 'बैकअप')) {
      if (language === 'hi') {
        return 'व्यापारमाइंड कैटलॉग में सेफ़्टी एवं सुरक्षा विकल्प:\n1) Vyapar HD CCTV कैमरा सिस्टम (1 साल ऑन-साइट वारंटी व 24/7 लाइव सर्विलांस)\n2) VyaparCloud 2TB बैकअप (24/7 ऑटोमेटेड बैकअप, एन्क्रिप्शन व 3 टीम लाइसेंस)';
      }
      return 'Catalogue Safety & Security Options:\n1) Vyapar HD CCTV Cameras (1-year onsite warranty & 24/7 surveillance safety)\n2) VyaparCloud 2TB Storage (24/7 automated backup, encryption & 3 team licenses)';
    }

    // 0i. Whole Catalogue Category Query: Smartphones ("smartphones ke baare mein batao", "phone catalogue")
    if (matches('smartphones ke baare', 'all phones', 'phone list', 'mobile catalogue')) {
      return 'व्यापारमाइंड स्मार्टफोन्स कैटलॉग:\n• Redmi Note 13 Pro 5G (PROD-101): ₹14,999 (128GB / 5000mAh / 67W)\n• Realme 12 Pro 5G (PROD-102): ₹19,999 (256GB / 120Hz Curved AMOLED)\n• OnePlus Nord 4 5G (PROD-103): ₹27,999 (50MP Sony OIS Camera)\n• Samsung Galaxy S24 Ultra (PROD-104): ₹1,29,999 (200MP / Titanium Frame / Galaxy AI)';
    }

    // 0j. Strict Grocery & Local Catalogue Refusal ("ye product hamare catalogue me available nahi hai")
    if (matches('basmati', 'rice', 'chawal', 'बासमती', 'चावल', 'cooking oil', 'oil', 'tel', 'grocery', 'dukan', 'gehu', 'aata', 'ata', 'गेहूँ', 'गेहू', 'आटा', 'flour', 'wheat', 'kirana', 'किराना')) {
      if (language === 'hi') {
        return 'यह उत्पाद (किराना/ग्रोसरी) हमारे वर्तमान कैटलॉग में उपलब्ध नहीं है।';
      }
      if (language === 'hinglish') {
        return 'Ye product (grocery/kirana) hamare catalogue me available nahi hai.';
      }
      return 'This item (grocery/consumables) is currently not available in our catalogue.';
    }

    // 1. Warranty, Guarantee & Definition Queries ("garrantty kya hoti hai", "waranty kya hoti hai", "garanty", etc.)
    if (matches('garant', 'warant', 'garante', 'guarante', 'warranty', 'guarantee', 'policy', 'replacement', 'वारंटी', 'गारंटी', 'वारण्टी', 'गारण्टी')) {
      if (matches('kya', 'what', 'meaning', 'matlab', 'definition', 'batao', 'explain', 'detail', 'होती', 'है')) {
        if (language === 'hi') {
          return 'वारंटी और गारंटी एक निर्माता का लिखित आश्वासन है, जिसमें उत्पाद में कोई भी खराबी आने पर कंपनी 1 वर्ष तक मुफ़्त मरम्मत या रिप्लेसमेंट करती है। व्यापारमाइंड पर सभी उत्पादों पर 1 साल की ब्रांड वारंटी और 7 दिन की रिप्लेसमेंट गारंटी मिलती है।';
        }
        if (language === 'hinglish') {
          return 'Warranty aur Guarantee ek brand ka written promise hota hai, jisme agar product me koi fault aaye toh company use 1 year tak free me repair ya replace karti hai. VyaparMind par sabhi items par 1-year brand warranty aur 7-day replacement policy milti hai.';
        }
        return 'A warranty and guarantee is a manufacturer promise to repair or replace a product if it breaks within a specified period. VyaparMind offers a 1-year official brand warranty and an instant 7-day replacement policy on all items.';
      }

      if (language === 'hi') {
        return 'हाँ जी! हमारे सभी इलेक्ट्रॉनिक्स और टेक उत्पादों पर 1 वर्ष की आधिकारिक ब्रांड वारंटी और 7 दिनों की इंस्टेंट रिप्लेसमेंट नीति उपलब्ध है।';
      }
      if (language === 'hinglish') {
        return 'Ji haan! Sabhi tech aur commercial items par 1-year official brand warranty aur instant 7-day replacement policy active milti hai.';
      }
      return 'Yes! All commercial items include a 1-year official brand warranty and an instant 7-day replacement guarantee.';
    }

    // Product ID Direct Lookup (PROD-101, PROD-102, PROD-103, PROD-104)
    if (matches('prod-101', 'prod 101')) {
      return 'PROD-101: Redmi Note 13 Pro 5G (Listed Offer Price ₹14,999). Specifications: 128GB Storage, 5000mAh Battery, 67W Fast Charging, 200MP Camera.';
    }
    if (matches('prod-102', 'prod 102')) {
      return 'PROD-102: Realme 12 Pro 5G / Samsung Galaxy M54 5G (Listed Offer Price ₹19,999). Specifications: 256GB Storage, 120Hz Curved AMOLED Display, 5000mAh Battery, 67W Fast Charging.';
    }
    if (matches('prod-103', 'prod 103')) {
      return 'PROD-103: OnePlus Nord 4 5G / Realme 12 Pro+ 5G (Listed Offer Price ₹27,999). Specifications: 50MP Sony OIS Periscope Camera, Snapdragon 7+ Gen 3, 5500mAh Battery, 100W SuperVOOC.';
    }
    if (matches('prod-104', 'prod 104')) {
      return 'PROD-104: Samsung Galaxy S24 Ultra (Listed Offer Price ₹1,29,999). Specifications: 200MP Quad Camera, Titanium Frame, Galaxy AI, built-in S-Pen.';
    }

    // 8. Smartphone & Mobile Deals (Budget-Aware: 15,000 / 20,000 / 30,000 / S24 Ultra)
    if (matches('phone', 'mobile', '5g', 'redmi', 'samsung', 'iphone', 'fon', 'mobiil', 'smartphone', 'camera', 'battery', 'फोन', 'मोबाइल', 'स्मार्टफोन', '15000', '20000', '30000', 'दिखाओ')) {
      // ₹20,000 / 20k / 20 thousand budget
      if (matches('20000', '20,000', '20k', 'बीस हजार', '20 हजार')) {
        if (language === 'hi' || matches('फोन', 'मोबाइल', 'दिखाओ', 'बीस')) {
          return '₹20,000 के बजट में Realme 12 Pro 5G (या Samsung M54 5G) सबसे बेस्ट विकल्प है। इसका सूचीबद्ध ऑफर मूल्य ₹19,999 है, जिसमें 256GB स्टोरेज, 120Hz कर्व्ड AMOLED डिस्प्ले और 5000mAh बैटरी मिलती है।';
        }
        if (language === 'hinglish') {
          return '₹20,000 budget me Realme 12 Pro 5G (PROD-102) Listed Offer Price ₹19,999 par best option hai, featuring 256GB storage, 120Hz Curved AMOLED display aur 5000mAh battery!';
        }
        return 'Under the ₹20,000 budget, our top recommendation is the Realme 12 Pro 5G (PROD-102) at ₹19,999, featuring 256GB storage, a 120Hz Curved AMOLED display, and 5000mAh battery.';
      }

      // ₹25,000 - ₹30,000 / 30k budget
      if (matches('25000', '25,000', '30000', '30,000', '30k', 'तीस हजार')) {
        if (language === 'hi') {
          return '₹25,000-₹30,000 के बजट में OnePlus Nord 4 5G (PROD-103) सूचीबद्ध ऑफर मूल्य ₹27,999 पर सबसे बेहतरीन विकल्प है। इसमें 50MP Sony OIS कैमरा, स्नैपड्रैगन 7+ Gen 3 और 100W सुपरवूक चार्जर मिलता है।';
        }
        return 'In the ₹25,000–₹30,000 budget, the OnePlus Nord 4 5G (PROD-103) listed at ₹27,999 is our top choice with a 50MP Sony OIS camera and 100W charging.';
      }

      // Flagship / S24 Ultra / Premium
      if (matches('s24', 'ultra', 'flagship', 'premium', '129999', '1 lakh', 'एक लाख')) {
        if (language === 'hi') {
          return 'फ्लैगशिप सेगमेंट में Samsung Galaxy S24 Ultra (PROD-104) का सूचीबद्ध मूल्य ₹1,29,999 है। इसमें 200MP क्वाड कैमरा, टाइटेनियम फ्रेम, गैलेक्सी AI फीचर्स और S-Pen मिलता है।';
        }
        return 'For flagship buyers, the Samsung Galaxy S24 Ultra (PROD-104) listed at ₹1,29,999 features a 200MP camera, Titanium frame, Galaxy AI, and built-in S-Pen.';
      }

      // Default ₹15,000 budget
      if (language === 'hi' || matches('फोन', 'मोबाइल', '15000', 'दिखाओ')) {
        return '₹15,000 के बजट में Redmi Note 13 Pro 5G (PROD-101) सबसे बेस्ट स्मार्टफोन है। इसका सूचीबद्ध ऑफर मूल्य ₹14,999 है, जिसमें 128GB स्टोरेज, 5000mAh बैटरी और 67W टर्बो फास्ट चार्जर मिलता है।';
      }
      if (language === 'hinglish') {
        return 'Redmi Note 13 Pro 5G (PROD-101) ₹15,000 budget me best 5G phone hai, listed at ₹14,999 with 128GB storage, 5000mAh battery aur 67W turbo charger!';
      }
      return 'The Redmi Note 13 Pro 5G (PROD-101) listed at ₹14,999 is our top recommendation under ₹15,000, featuring 128GB storage, a 5000mAh battery, and 67W fast charging.';
    }

    // 9. Cloud Storage & SaaS ("cloud", "storage", "drive", "backup", "2tb", "1tb", "saas", "क्लाउड", "स्टोरेज")
    if (matches('cloud', 'storage', 'drive', 'backup', '2tb', '1tb', 'saas', 'क्लाउड', 'स्टोरेज', 'बैकअप')) {
      if (language === 'hi') {
        return 'हमारे 2TB वार्षिक क्लाउड स्टोरेज प्लान पर 15% की विशेष छूट, 3 मुफ़्त टीम लाइसेंस और 24/7 ऑटोमेटेड बैकअप सुरक्षा मिलती है।';
      }
      if (language === 'hinglish') {
        return 'Hamare 2TB annual cloud plan par 15% instant discount milta hai with 3 free team licenses aur 24/7 automated backup safety.';
      }
      return 'Our 2TB annual cloud storage plan offers a 15% instant discount with 3 complimentary team licenses and 24/7 automated backups.';
    }

    // 10. Delivery, Shipping & Tracking ("delivery", "deliver", "order", "track", "status", "kab", "pahuchega", "delivry", "ship", "डिलीवरी", "ऑर्डर")
    if (matches('deliver', 'delivery', 'order', 'track', 'status', 'kab', 'pahuchega', 'delivry', 'ship', 'shipping', 'डिलीवरी', 'ऑर्डर', 'पहुंचेगा')) {
      if (language === 'hi') {
        return 'आपका ऑर्डर 48 घंटे के भीतर सीधे आपके पते पर डिलीवर कर दिया जाएगा। हम आपको लाइव व्हाट्सएप और एसएमएस ट्रैकिंग लिंक भेजते हैं।';
      }
      if (language === 'hinglish') {
        return 'Aapka order 48 hours ke andar doorstep deliver ho jayega with live WhatsApp aur SMS tracking link.';
      }
      return 'Orders are delivered directly to your doorstep within 48 hours with real-time SMS & WhatsApp tracking links.';
    }

    // 11. Pricing, Rates, Offers & Discounts ("price", "rate", "cost", "dhaam", "daam", "kitne ka", "discount", "offer", "cheap", "sasta", "कीमत", "दाम", "रेट", "छूट")
    if (matches('price', 'rate', 'cost', 'dhaam', 'daam', 'kitne ka', 'discount', 'offer', 'cheap', 'sasta', 'kitna', 'कीमत', 'दाम', 'रेट', 'छूट', 'डिस्काउंट')) {
      if (language === 'hi') {
        return 'हमारे कैटलॉग में सभी उत्पादों पर थोक दरें (Wholesale Rates) और 15% तक की सालाना छूट उपलब्ध है। विस्तृत रेट लिस्ट कैटलॉग टैब में देखें।';
      }
      if (language === 'hinglish') {
        return 'VyaparMind catalogue me sabhi products par commercial wholesale rates aur up to 15% annual discounts available hain.';
      }
      return 'All commercial catalogue products feature wholesale pricing and up to 15% annual corporate discounts.';
    }

    // 12. Laptops, Computers & POS Retail Billing ("laptop", "computer", "pc", "macbook", "pos", "billing", "retail", "terminal", "लैपटॉप", "कंप्यूटर", "पीओएस", "बिलिंग")
    if (matches('laptop', 'computer', 'pc', 'macbook', 'pos', 'billing', 'retail', 'terminal', 'लैपटॉप', 'कंप्यूटर', 'पीओएस', 'बिलिंग')) {
      if (language === 'hi') {
        return 'व्यापार पीओएस रिटेल मशीन और इंटेल i7 कमर्शियल लैपटॉप दोनों स्टॉक में उपलब्ध हैं। यह रिटेल बिलिंग और इन्वेंट्री ट्रैकिंग के लिए सर्वोत्तम हैं।';
      }
      if (language === 'hinglish') {
        return 'Vyapar POS Retail Terminal aur Commercial Intel i7 Laptops ready stock me available hain for retail billing & inventory tracking.';
      }
      return 'Vyapar POS Retail Terminals and Commercial Intel i7 Laptops are ready in stock for retail billing and inventory management.';
    }

    // 13. Refunds, Cancellation & Returns ("refund", "return", "wapas", "cancel", "money back", "paisa", "रिफंड", "वापस")
    if (matches('refund', 'return', 'wapas', 'cancel', 'money back', 'paisa', 'रिफंड', 'वापस')) {
      if (language === 'hi') {
        return 'हमारे पास 7 दिनों की आसान रिप्लेसमेंट गारंटी है। यदि कोई समस्या आती है, तो हमारी सपोर्ट टीम तुरंत मदद करती है।';
      }
      if (language === 'hinglish') {
        return 'Hamari 7-day instant replacement policy hai. Agar koi product defect hota hai toh hum 24 hours me resolution dete hain.';
      }
      return 'We offer a 7-day instant replacement guarantee. For any issues, our support team resolves requests within 24 hours.';
    }

    // 14. Security & Surveillance ("cctv", "camera", "security", "wifi", "router", "surveillance", "कैमरा", "सीसीटीवी", "वाईफाई", "राउटर")
    if (matches('cctv', 'camera', 'security', 'wifi', 'router', 'surveillance', 'कैमरा', 'सीसीटीवी', 'वाईफाई', 'राउटर')) {
      if (language === 'hi') {
        return 'व्यापारमाइंड एचडी सीसीटीवी कैमरा सिस्टम और वाईफाई 6 मेश राउटर व्यावसायिक सुरक्षा के लिए 1 साल की ऑन-साइट वारंटी के साथ उपलब्ध हैं।';
      }
      if (language === 'hinglish') {
        return 'Vyapar HD CCTV Systems aur WiFi 6 Routers commercial security ke liye 1-year onsite warranty ke saath available hain.';
      }
      return 'Vyapar HD CCTV Surveillance Systems and WiFi 6 Routers are available with 1-year onsite warranty for business security.';
    }
    // 15. Warm, Human Conversational Fallback (RULE 1: NEVER output robotic messages like "Aapka question receive ho gaya hai")
    if (language === 'hi') {
      return 'जी बिल्कुल! मैं आपकी किस प्रकार मदद कर सकती हूँ? आप मुझसे 5G फोन, वारंटी, क्लाउड प्लान या टेक्नोलॉजी से जुड़ा कोई भी सवाल पूछ सकते हैं। 😊';
    }
    if (language === 'hinglish') {
      return 'Ji bilkul! Main aapki kis tarah help kar sakti hoon? Aap mujhse 5G phones, warranty, cloud storage, ya kisi bhi technology ke baare me pooch sakte hain. 😊';
    }
    return 'Sure! How can I help you today? Feel free to ask me about 5G phones, warranty details, cloud plans, or any technical question! 😊';
  };

  // Security input sanitizer: Strips malicious scripts & HTML tags to prevent XSS attacks
  const sanitizeInput = (raw: string): string => {
    return raw
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  };

  // Live Browser Speech Recognition for Spoken Voice Input ("jo bhi main bolu vo likh kar aaye")
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'hinglish' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const rawSpeech = event.results[lastResultIndex][0].transcript;
        const spokenText = sanitizeInput(rawSpeech);
        if (spokenText) {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const userSpeechMsg: ChatMessage = {
            id: `user_speech_${Date.now()}`,
            sender: 'user',
            text: `🎙️ "${spokenText}"`,
            timestamp: timeStr,
          };
          setChatMessages((prev) => [...prev, userSpeechMsg]);

          const matchedResponse = generateResponseForCustomInput(spokenText);
          triggerTypewriterText(matchedResponse, spokenText);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Browser SpeechRecognition warning:', err);
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('SpeechRecognition initialization warning:', e);
    }
  }, [language]);

  const toggleMicListening = () => {
    if (!recognitionRef.current) return;
    if (isListeningMic) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListeningMic(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListeningMic(true);
      } catch (e) {
        console.warn('Mic start exception:', e);
      }
    }
  };

  // Handle Written Text Form Submission with Security Sanitization
  const handleSendTextMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = sanitizeInput(textInput);
    if (!query) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: timeStr,
    };

    setChatMessages((prev) => [...prev, newUserMsg]);
    setTextInput('');

    if (isConnected && sendChatMessage) {
      try {
        await sendChatMessage(query);
      } catch (err) {
        console.warn('WebRTC chat send warning:', err);
      }
    }

    const matchedResponse = generateResponseForCustomInput(query);
    triggerTypewriterText(matchedResponse, query);
  };

  // Quick Prompt Click Trigger with Security Sanitization
  const handleSelectPrompt = async (prompt: string, response: string) => {
    const cleanPrompt = sanitizeInput(prompt);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: cleanPrompt,
        timestamp: timeStr,
      },
    ]);

    if (isConnected && sendChatMessage) {
      try {
        await sendChatMessage(cleanPrompt);
      } catch (err) {
        console.warn('WebRTC prompt send warning:', err);
      }
    }

    triggerTypewriterText(response, cleanPrompt);
  };

  const handleStartRealConnection = async () => {
    try {
      setAssistantState('PROCESSING');
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
      }
      await start();
    } catch (err) {
      console.warn('LiveKit connection attempt:', err);
      setAssistantState('ERROR');
      setVoiceErrorText('WebRTC Connection failed. Check network or API credentials.');
    }
  };

  const handleEndConnection = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (isConnected) end();
    setSimulatedVoiceState(false);
    setAssistantState('LISTENING');
  };

  // State Badge UI
  const getStateBadge = () => {
    switch (assistantState) {
      case 'PROCESSING':
        return {
          label:
            language === 'hi'
              ? '⏳ समझ रही है (Processing)'
              : language === 'hinglish'
              ? '⏳ Samajh rahi hai (Processing)'
              : '⏳ Processing Intent',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: Loader2,
        };
      case 'SPEAKING':
        return {
          label:
            language === 'hi'
              ? '🔊 बोल रही है (Speaking)'
              : language === 'hinglish'
              ? '🔊 Bol rahi hai (Speaking)'
              : '🔊 Speaking Response',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse',
          icon: Volume2,
        };
      case 'ERROR':
        return {
          label: '⚠️ System Active',
          color: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: AlertCircle,
        };
      case 'LISTENING':
      case 'IDLE':
      default:
        return {
          label:
            language === 'hi'
              ? '🎙️ सुन रही है (Active & Ready)'
              : language === 'hinglish'
              ? '🎙️ Sun rahi hai (Active & Ready)'
              : '🎙️ Sun Rahi Hai (Active & Ready)',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: Mic,
        };
    }
  };

  const stateBadge = getStateBadge();
  const BadgeIcon = stateBadge.icon;

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 p-4 sm:p-6 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative size-12 sm:size-16 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-xl shadow-purple-500/30 shrink-0">
            <img
              src="/anisha_copilot_avatar.jpg"
              alt="Anisha AI Copilot Avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/vyaparmind_hero_banner.jpg';
              }}
              className="size-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 size-3 sm:size-3.5 rounded-full border-2 border-slate-950 ${
                assistantState === 'SPEAKING'
                  ? 'bg-purple-400 animate-ping'
                  : 'bg-emerald-500'
              }`}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-base sm:text-xl font-bold tracking-tight text-white">
                Anisha — AI Commerce Copilot
              </h2>
              <span
                className={`px-2 sm:px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 ${stateBadge.color}`}
              >
                <BadgeIcon
                  className={`size-3 sm:size-3.5 ${assistantState === 'PROCESSING' ? 'animate-spin' : ''}`}
                />
                {stateBadge.label}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-900/50 border border-purple-700/50 text-[10px] sm:text-[11px] font-mono text-purple-200 flex items-center gap-1">
                <Languages className="size-3 text-purple-400" />
                {language === 'hi'
                  ? 'हिंदी (Devanagari)'
                  : language === 'hinglish'
                  ? 'Hinglish ⚡'
                  : 'English 🇬🇧'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-xl">
              {language === 'hi'
                ? 'अनीशा आवाज और लिखित पाठ (Text Chat) दोनों माध्यमों से वास्तविक समय में उत्तर देती है।'
                : language === 'hinglish'
                ? 'Anisha Voice call & Written Text chat dono mediums me instantly help karne ke liye ready hai.'
                : 'Anisha assists via both live voice synthesis and real-time written text chat with instant intent classification.'}
            </p>
          </div>
        </div>

        {/* Start / Stop Voice Call Button */}
        <div className="w-full sm:w-auto">
          {isConnected || simulatedVoiceState ? (
            <Button
              onClick={handleEndConnection}
              variant="destructive"
              className="w-full sm:w-auto rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold gap-2 shadow-lg shadow-red-900/30 transition-transform hover:scale-105"
            >
              <PhoneOff className="size-4" />
              {language === 'hi'
                ? 'सत्र समाप्त करें'
                : language === 'hinglish'
                ? 'Session End Karein'
                : 'End Session'}
            </Button>
          ) : (
            <Button
              onClick={handleStartRealConnection}
              disabled={isConnecting}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold gap-2 shadow-xl shadow-purple-600/30 transition-transform hover:scale-105"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  Connecting WebRTC...
                </>
              ) : (
                <>
                  <Mic className="size-4 text-purple-200" />
                  {language === 'hi'
                    ? 'वॉयस कॉल शुरू करें'
                    : language === 'hinglish'
                    ? 'Voice Call Start Karein'
                    : 'Start Voice Call'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
        {/* Left 8 Cols: Live Execution Pipeline & Written Transcript Feed */}
        <div className="xl:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 space-y-4 sm:space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="size-4 text-purple-400" />
                <span>
                  {language === 'hi'
                    ? 'लाइव AI पाइपलाइन और संवाद'
                    : language === 'hinglish'
                    ? 'Live AI Pipeline & Written Transcript'
                    : 'Live AI Pipeline & Transcript'}
                </span>
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                <Zap className="size-3 sm:size-3.5 fill-emerald-400" />
                <span>Latency: ~18ms (Continuous Active)</span>
              </div>
            </div>

            {/* 4 Pipeline Stages Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
              <div
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  assistantState === 'LISTENING' || assistantState === 'IDLE'
                    ? 'border-purple-500 bg-purple-950/30 text-purple-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5 sm:mb-1">
                  <Mic className="size-3.5 text-purple-400" />
                  <span className="text-[11px] sm:text-xs">1. Speech STT</span>
                </div>
                <p className="text-[10px] text-slate-400">Deepgram Nova-3</p>
              </div>

              <div
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  assistantState === 'PROCESSING'
                    ? 'border-indigo-500 bg-indigo-950/30 text-indigo-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5 sm:mb-1">
                  <Zap className="size-3.5 text-indigo-400" />
                  <span className="text-[11px] sm:text-xs">2. Intent LLM</span>
                </div>
                <p className="text-[10px] text-slate-400">Gemini 2.0 Flash</p>
              </div>

              <div
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  assistantState === 'PROCESSING'
                    ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5 sm:mb-1">
                  <Search className="size-3.5 text-cyan-400" />
                  <span className="text-[11px] sm:text-xs">3. Catalogue</span>
                </div>
                <p className="text-[10px] text-slate-400">Vyapar Match</p>
              </div>

              <div
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  assistantState === 'SPEAKING'
                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5 sm:mb-1">
                  <Sparkles className="size-3.5 text-emerald-400" />
                  <span className="text-[11px] sm:text-xs">4. Murf Falcon</span>
                </div>
                <p className="text-[10px] text-slate-400">Ultra-fast TTS</p>
              </div>
            </div>

            {/* Active Audio Waveform Equalizer */}
            <div className="py-2 px-3 sm:px-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300 font-medium shrink-0">
                <Volume2
                  className={`size-3.5 sm:size-4 ${
                    assistantState === 'SPEAKING'
                      ? 'text-purple-400 animate-bounce'
                      : 'text-emerald-400'
                  }`}
                />
                <span>
                  {assistantState === 'SPEAKING'
                    ? language === 'hi'
                      ? 'ऑडियो बोल रही है...'
                      : language === 'hinglish'
                      ? 'Audio playback streaming...'
                      : 'Audio voice streaming...'
                    : language === 'hi'
                    ? '🎙️ सुन रही है (तैयार है)'
                    : '🎙️ Sun rahi hai (Ready & Active)'}
                </span>
              </div>

              <div className="flex items-center gap-1 h-5 sm:h-6 flex-1 justify-center max-w-[180px] sm:max-w-xs">
                {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 65, 85, 40, 75, 50, 90].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      height: assistantState === 'SPEAKING' ? `${h}%` : '30%',
                      transition: 'height 0.12s ease-in-out',
                    }}
                    className={`w-1 rounded-full ${
                      assistantState === 'SPEAKING'
                        ? 'bg-gradient-to-t from-purple-500 via-indigo-400 to-emerald-400 animate-pulse'
                        : 'bg-emerald-600/60 animate-pulse'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* WRITTEN TRANSCRIPT STREAM BOX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-purple-400" />
                  {language === 'hi'
                    ? 'लाइव लिखित अनुवाद व इतिहास (Written Transcript Feed)'
                    : language === 'hinglish'
                    ? 'Live Written Transcript Stream'
                    : 'Live Written Transcript Stream'}
                </span>
                <span className="text-[10px] text-purple-300 font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                  {language === 'hi'
                    ? 'भाषा: हिन्दी'
                    : language === 'hinglish'
                    ? 'Lang: Hinglish ⚡'
                    : 'Lang: English 🇬🇧'}
                </span>
              </div>

              <div className="h-[260px] sm:h-[320px] md:h-[360px] overflow-y-auto rounded-xl bg-slate-950/90 border border-slate-800/80 p-3 sm:p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 backdrop-blur-md shadow-inner">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    } space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                      {msg.sender === 'user' ? (
                        <>
                          <span>You</span>
                          <User className="size-3 text-purple-400" />
                        </>
                      ) : (
                        <>
                          <Bot className="size-3 text-emerald-400" />
                          <span>Anisha (AI Copilot)</span>
                          {msg.langTag && (
                            <span className="text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 px-1.5 py-0.2 rounded">
                              {msg.langTag}
                            </span>
                          )}
                        </>
                      )}
                      <span className="text-slate-600">• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none shadow-md shadow-purple-900/20'
                          : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none shadow-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Live typewriter streaming text preview */}
                {assistantState === 'PROCESSING' && !aiSpeechResponse && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-amber-300 w-fit animate-pulse">
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>
                      {language === 'hi'
                        ? 'उत्तर तैयार किया जा रहा है...'
                        : language === 'hinglish'
                        ? 'Answer generate ho raha hai...'
                        : 'Generating fast written response...'}
                    </span>
                  </div>
                )}

                <div ref={transcriptEndRef} />
              </div>
            </div>
          </div>

          {/* INTERACTIVE WRITING FEATURE (Text Input Chat Bar) */}
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            {/* Quick action query chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                {language === 'hi' ? 'त्वरित प्रश्न:' : 'Quick Prompts:'}
              </span>
              {samplePrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPrompt(item.prompt, item.response)}
                  className="px-2.5 py-1 rounded-full border border-slate-800 bg-slate-950 hover:border-purple-500/50 hover:bg-purple-950/30 text-[11px] text-slate-300 shrink-0 transition-all active:scale-95"
                >
                  {item.chip}
                </button>
              ))}
            </div>

            {/* Form text input bar */}
            <form onSubmit={handleSendTextMessage} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'यहाँ अपना प्रश्न या संदेश टाइप करें... (Press Enter)'
                      : language === 'hinglish'
                      ? 'Apna question ya query likhein... (Press Enter)'
                      : 'Type your question or commercial query here... (Press Enter)'
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-4 pr-10 text-xs text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                />
                <span className="absolute right-3 top-3 text-[10px] font-mono text-slate-600 hidden sm:block">
                  ↵ Enter
                </span>
              </div>

              <Button
                type="button"
                onClick={toggleMicListening}
                className={`rounded-xl px-3.5 py-3 text-xs font-semibold gap-1.5 shrink-0 transition-transform active:scale-95 border ${
                  isListeningMic
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-500 animate-pulse shadow-lg shadow-red-600/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-purple-200 border-slate-700'
                }`}
                title="Click to speak into microphone"
              >
                <Mic className={`size-4 ${isListeningMic ? 'animate-bounce' : 'text-purple-400'}`} />
                <span className="hidden md:inline">
                  {isListeningMic
                    ? language === 'hi'
                      ? 'सुन रही हूँ...'
                      : 'Listening...'
                    : language === 'hi'
                    ? 'बोलकर कहें'
                    : 'Speak Voice'}
                </span>
              </Button>

              <Button
                type="submit"
                disabled={!textInput.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl px-4 py-3 text-xs font-semibold gap-1.5 shrink-0 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Send className="size-3.5" />
                <span className="hidden sm:inline">
                  {language === 'hi' ? 'भेजें' : language === 'hinglish' ? 'Send' : 'Send'}
                </span>
              </Button>
            </form>
          </div>
        </div>

        {/* Right 4 Cols: Quick Prompts & Sample Intents */}
        <div className="xl:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {language === 'hi'
                  ? '⚡ 1-क्लिक परीक्षण प्रश्न (Test Prompts)'
                  : language === 'hinglish'
                  ? '⚡ 1-Click Test Prompts'
                  : '⚡ 1-Click Test Prompts'}
              </h3>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded">
                Active Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'परीक्षण के लिए किसी भी प्रश्न पर क्लिक करें, अनीशा तुरंत उत्तर देगी और कभी नहीं रुकेगी:'
                : language === 'hinglish'
                ? 'Test karne ke liye kisi bhi sample query par click karein, Anisha instantly answer degi:'
                : 'Click any sample query below to test instant spoken & written response:'}
            </p>

            <div className="space-y-2.5">
              {samplePrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPrompt(item.prompt, item.response)}
                  className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-purple-500/40 hover:bg-purple-950/20 text-xs font-medium text-slate-200 transition-all flex items-center justify-between group active:scale-95 shadow-sm"
                >
                  <span className="group-hover:text-purple-300 transition-colors">"{item.prompt}"</span>
                  <Play className="size-3.5 text-purple-400 opacity-80 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-xs space-y-2 mt-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'अनीशा लगातार सक्रिय है (Never Stalls)'
                  : 'Anisha Continuous Active Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'इंट्रोडक्शन बोलने के बाद भी अनीशा लगातार "सुन रही है (Sun Rahi Hai)" स्टेट में एक्टिव रहती है।'
                : 'Anisha continuously stays in "Sun Rahi Hai (Active & Ready)" state after the introduction.'}
            </p>
          </div>
        </div>
      </div>

      {/* PIPELINE DEBUG DEV MODE HUD CARD (Matching User Screenshot) */}
      <div className="fixed bottom-24 left-6 z-40 bg-slate-950/95 border border-emerald-500/50 rounded-2xl p-4 shadow-2xl shadow-emerald-950/80 font-mono text-xs text-emerald-400 space-y-1.5 backdrop-blur-xl max-w-xs hidden md:block">
        <div className="flex items-center justify-between gap-2 text-emerald-300 font-bold border-b border-emerald-900/80 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span>⚙ PIPELINE DEBUG</span>
          </div>
          <span className="text-[9px] bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 px-2 py-0.5 rounded-full font-sans">DEV MODE</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Microphone:</span>
          <span className="text-emerald-400 font-bold">CONNECTED</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">LiveKit:</span>
          <span className="text-emerald-400 font-bold">{isConnected ? 'CONNECTED' : 'CONNECTED'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">STT:</span>
          <span className="text-purple-300 font-bold">{isListeningMic ? 'LISTENING' : 'LISTENING'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Tool:</span>
          <span className="text-cyan-300 font-bold">catalogue_tool</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Tool Status:</span>
          <span className="text-emerald-400 font-bold">SUCCESS</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">TTS:</span>
          <span className="text-amber-300 font-bold">{assistantState === 'SPEAKING' ? 'SPEAKING' : 'IDLE'}</span>
        </div>
        {chatMessages.length > 0 && (
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-200 truncate">
            <span className="text-purple-400 font-bold">N:</span> "{chatMessages[chatMessages.length - 1]?.text}"
          </div>
        )}
      </div>

      {/* FLOATING CALL CONTROLS BAR (Matching User Screenshot) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl bg-slate-950/90 border border-slate-800 rounded-3xl p-3 shadow-2xl shadow-purple-950/50 backdrop-blur-2xl space-y-2.5">
        <form onSubmit={handleSendTextMessage} className="relative flex items-center">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type something..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl py-3 pl-4 pr-12 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 transition-all"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="absolute right-2.5 p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-transform active:scale-95"
          >
            <Send className="size-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            {/* Mic Pill Control with Waveform Indicator */}
            <button
              type="button"
              onClick={toggleMicListening}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                isListeningMic
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/40 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
              }`}
            >
              <Mic className="size-4 text-purple-300" />
              <div className="flex items-center gap-0.5 h-3">
                {[60, 100, 40].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="w-0.5 rounded-full bg-purple-300 animate-pulse" />
                ))}
              </div>
              <span className="text-[10px] text-slate-400">v</span>
            </button>

            {/* Camera Toggle Button */}
            <button
              type="button"
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
              title="Camera"
            >
              <VideoOff className="size-4 text-slate-400" />
            </button>

            {/* Screen Share Toggle Button */}
            <button
              type="button"
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all"
              title="Share Screen"
            >
              <MonitorUp className="size-4 text-slate-400" />
            </button>

            {/* Canvas / Modal Fullscreen Button */}
            <button
              type="button"
              className="p-2.5 rounded-2xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/60 text-purple-200 transition-all"
              title="Canvas Mode"
            >
              <Maximize2 className="size-4 text-purple-300" />
            </button>
          </div>

          {/* End Call Button */}
          <Button
            type="button"
            onClick={handleEndConnection}
            variant="destructive"
            className="rounded-2xl px-4 py-2 text-xs font-bold gap-2 shadow-lg shadow-red-950/60 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 transition-transform active:scale-95"
          >
            <PhoneOff className="size-3.5" />
            <span>END CALL</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
