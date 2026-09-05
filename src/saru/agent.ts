/**
 * Saru AI Agent Engine
 *
 * Architecture (ready for real LLM + APIs):
 *   Website → Chat/Voice UI → processMessage() → Knowledge + Orders + Products → Response
 *
 * Currently: deterministic retrieval + intent engine grounded in catalogue & knowledge base.
 * To connect a real LLM: replace generateReply() body with secure server-side API call;
 * keep tool functions (findOrder, searchProducts, knowledgeSearch) as agent tools.
 */

import type {
  ChatMessage,
  ConversationRecord,
  QueryCategory,
  Sentiment,
  Priority,
  ConversationResult,
} from '../types/saru';
import {
  findOrder,
  knowledgeSearch,
  loadKnowledge,
  loadSettings,
  productCatalogueSummary,
  searchProducts,
} from './knowledge';
import { formatPrice } from '../data/products';

export interface AgentContext {
  messages: ChatMessage[];
  pendingOrderId?: string;
  awaitingOrderId?: boolean;
  awaitingContact?: boolean;
  customerName?: string;
  email?: string;
  phone?: string;
  lastIntent?: string;
  productsDiscussed: string[];
  orderId?: string;
  escalate?: boolean;
  escalationReason?: string;
}

export interface AgentReply {
  text: string;
  context: AgentContext;
  category: QueryCategory;
  subcategory: string;
  sentiment: Sentiment;
  priority: Priority;
  confidence: number;
  actions: string[];
  shouldEscalate: boolean;
  escalationReason?: string;
  endConversation?: boolean;
}

const ESCALATION_PHRASES = [
  'human',
  'real person',
  'customer care',
  'manager',
  'speak to someone',
  'talk to agent',
  'complaint',
  'lawyer',
  'legal',
  'fraud',
  'scam',
  'police',
  'refund immediately',
  'very angry',
  'worst service',
];

const SENSITIVE_REQUEST = [
  'password',
  'otp',
  'cvv',
  'card number',
  'pin number',
  'net banking password',
];

function detectIntent(text: string): { category: QueryCategory; subcategory: string } {
  const t = text.toLowerCase();
  if (/order|track|where is my|delivery status|kj\d+/i.test(t))
    return { category: 'Orders', subcategory: 'Order status' };
  if (/return|exchange|refund|buyback/i.test(t))
    return { category: 'Returns', subcategory: 'Returns & exchange' };
  if (/ship|deliver|courier|when will/i.test(t))
    return { category: 'Shipping', subcategory: 'Delivery timeline' };
  if (/pay|payment|upi|failed transaction/i.test(t))
    return { category: 'Payments', subcategory: 'Payment issue' };
  if (/care|clean|maintain|store jewellery/i.test(t))
    return { category: 'Jewellery Care', subcategory: 'Care tips' };
  if (/plan|scheme|monthly|instalment|installment/i.test(t))
    return { category: 'Purchase Plans', subcategory: 'Gold purchase plan' };
  if (/store|address|hours|open|location|contact|phone|visit/i.test(t))
    return { category: 'Store', subcategory: 'Store info' };
  if (/price|cost|how much|available|stock|product|ring|earring|necklace|mangalsutra|polki|temple/i.test(t))
    return { category: 'Products', subcategory: 'Product enquiry' };
  if (/offer|discount|sale|promo/i.test(t))
    return { category: 'Products', subcategory: 'Offers' };
  if (/complaint|angry|terrible|worst|fraud/i.test(t))
    return { category: 'Complaints', subcategory: 'Complaint' };
  if (/policy|return policy|shipping policy/i.test(t))
    return { category: 'Policies', subcategory: 'Policy' };
  return { category: 'General', subcategory: 'General enquiry' };
}

function detectSentiment(text: string): Sentiment {
  const t = text.toLowerCase();
  if (/thank|thanks|great|wonderful|appreciate|helpful|love/i.test(t)) return 'Positive';
  if (/angry|terrible|worst|fraud|scam|hate|useless|pathetic|disgusting/i.test(t))
    return 'Negative';
  return 'Neutral';
}

function detectPriority(text: string, category: QueryCategory, sentiment: Sentiment): Priority {
  if (/urgent|immediately|fraud|legal|police/i.test(text)) return 'Urgent';
  if (sentiment === 'Negative' || category === 'Complaints' || category === 'Payments')
    return 'High';
  if (category === 'Orders' || category === 'Returns') return 'Medium';
  return 'Low';
}

function extractOrderId(text: string): string | undefined {
  const m = text.match(/\b(KJ\d{4,})\b/i);
  return m ? m[1].toUpperCase() : undefined;
}

function shouldEscalate(text: string, confidence: number, category: QueryCategory): { yes: boolean; reason?: string } {
  const t = text.toLowerCase();
  if (ESCALATION_PHRASES.some((p) => t.includes(p))) {
    return { yes: true, reason: 'Customer requested human support or raised a sensitive complaint' };
  }
  if (category === 'Complaints' && /refund|fraud|legal/i.test(t)) {
    return { yes: true, reason: 'Complex complaint requiring human review' };
  }
  if (confidence < 40) {
    return { yes: true, reason: 'AI confidence too low to answer safely' };
  }
  return { yes: false };
}

function orderReply(order: NonNullable<ReturnType<typeof findOrder>>): string {
  return (
    `I found order **${order.orderId}** for ${order.customerName}.\n\n` +
    `• Status: ${order.status}\n` +
    `• Payment: ${order.paymentStatus}\n` +
    `• Products: ${order.products.join(', ')}\n` +
    `• Shipping: ${order.shippingStatus}\n` +
    `• Estimated delivery: ${order.estimatedDelivery}\n` +
    `• Return status: ${order.returnStatus}\n\n` +
    `If anything looks incorrect, I can connect you with a human representative.`
  );
}

/**
 * Core agent turn — pure function over context + user text.
 * Swap internals for LLM tool-calling without changing the UI contract.
 */
export function processMessage(
  userText: string,
  ctx: AgentContext
): AgentReply {
  const text = userText.trim();
  const actions: string[] = [];
  const settings = loadSettings();
  const kb = loadKnowledge();

  // Safety: never request secrets
  if (SENSITIVE_REQUEST.some((s) => text.toLowerCase().includes(s))) {
    return {
      text:
        "I will never ask for passwords, OTPs, CVV, or full card details. " +
        "For payment issues, please share only your Order ID and I can guide you or connect a human agent.",
      context: ctx,
      category: 'Payments',
      subcategory: 'Security',
      sentiment: detectSentiment(text),
      priority: 'High',
      confidence: 95,
      actions: ['Refused sensitive credential request'],
      shouldEscalate: false,
    };
  }

  const { category, subcategory } = detectIntent(text);
  const sentiment = detectSentiment(text);
  let priority = detectPriority(text, category, sentiment);
  let confidence = 75;
  let next: AgentContext = {
    ...ctx,
    productsDiscussed: [...ctx.productsDiscussed],
  };

  // Awaiting order ID follow-up
  if (ctx.awaitingOrderId) {
    const oid = extractOrderId(text) || text.trim().toUpperCase();
    const order = findOrder(oid);
    actions.push(`Looked up order ${oid}`);
    if (order) {
      next = {
        ...next,
        awaitingOrderId: false,
        orderId: order.orderId,
        customerName: next.customerName || order.customerName,
        email: next.email || order.email,
        productsDiscussed: [...new Set([...next.productsDiscussed, ...order.products])],
      };
      return {
        text: orderReply(order),
        context: next,
        category: 'Orders',
        subcategory: 'Order status',
        sentiment,
        priority: 'Medium',
        confidence: 92,
        actions,
        shouldEscalate: false,
      };
    }
    next.awaitingOrderId = false;
    return {
      text:
        `I couldn’t find an order matching “${oid}” in our system. ` +
        `Please double-check the Order ID (example format: KJ10245). ` +
        `If you’re sure it’s correct, I can connect you with a customer-support representative.`,
      context: next,
      category: 'Orders',
      subcategory: 'Order not found',
      sentiment,
      priority: 'Medium',
      confidence: 60,
      actions,
      shouldEscalate: false,
    };
  }

  const esc = shouldEscalate(text, confidence, category);
  if (esc.yes) {
    next.escalate = true;
    next.escalationReason = esc.reason;
    return {
      text:
        "I understand. Let me connect you with a customer-support representative who can assist you further. " +
        "Please hold on — your conversation details will be shared with the team so you don’t have to repeat yourself.",
      context: next,
      category,
      subcategory: subcategory + ' · Escalation',
      sentiment,
      priority: priority === 'Low' ? 'High' : priority,
      confidence: 90,
      actions: ['Initiated human handoff'],
      shouldEscalate: true,
      escalationReason: esc.reason,
      endConversation: true,
    };
  }

  // Order intent
  if (category === 'Orders') {
    const oid = extractOrderId(text);
    if (oid) {
      const order = findOrder(oid);
      actions.push(`Looked up order ${oid}`);
      if (order) {
        next.orderId = order.orderId;
        next.customerName = next.customerName || order.customerName;
        next.email = next.email || order.email;
        next.productsDiscussed = [...new Set([...next.productsDiscussed, ...order.products])];
        return {
          text: orderReply(order),
          context: next,
          category,
          subcategory,
          sentiment,
          priority,
          confidence: 92,
          actions,
          shouldEscalate: false,
        };
      }
      return {
        text: `I couldn’t verify order ${oid}. Could you re-check the ID, or would you like me to connect you with a human agent?`,
        context: next,
        category,
        subcategory: 'Order not found',
        sentiment,
        priority,
        confidence: 55,
        actions,
        shouldEscalate: false,
      };
    }
    next.awaitingOrderId = true;
    next.lastIntent = 'order_status';
    return {
      text: "I’d be happy to help with your order. What’s your Order ID? (For this demo you can try KJ10245, KJ10246, or KJ10247.)",
      context: next,
      category,
      subcategory,
      sentiment,
      priority,
      confidence: 85,
      actions: ['Requested Order ID'],
      shouldEscalate: false,
    };
  }

  // Products
  if (category === 'Products') {
    if (/offer|discount|sale/i.test(text)) {
      const offers = knowledgeSearch('offer discount', kb);
      const content =
        offers[0]?.content ||
        'I don’t have a verified live offer listed right now. An admin can add offers in Knowledge Management. I won’t invent discounts.';
      return {
        text: content,
        context: next,
        category,
        subcategory: 'Offers',
        sentiment,
        priority: 'Low',
        confidence: 80,
        actions: ['Checked offers knowledge'],
        shouldEscalate: false,
      };
    }

    const hits = searchProducts(text);
    if (hits.length > 0) {
      const top = hits.slice(0, 4);
      next.productsDiscussed = [
        ...new Set([...next.productsDiscussed, ...top.map((p) => p.name)]),
      ];
      actions.push(`Matched ${top.length} products from catalogue`);
      const lines = top
        .map(
          (p) =>
            `• **${p.name}** — ${formatPrice(p.price)} (${p.metal} ${p.purity}, ${p.collection})`
        )
        .join('\n');
      return {
        text:
          `Here’s what I found in our catalogue:\n\n${lines}\n\n` +
          `You can open a product page for full details, or tell me a budget or occasion and I’ll narrow it down. ` +
          `Prices shown are from the demo catalogue.`,
        context: next,
        category,
        subcategory,
        sentiment,
        priority: 'Low',
        confidence: 88,
        actions,
        shouldEscalate: false,
      };
    }

    if (/what do you (sell|have)|catalogue|collection/i.test(text)) {
      return {
        text: productCatalogueSummary(),
        context: next,
        category,
        subcategory: 'Catalogue overview',
        sentiment,
        priority: 'Low',
        confidence: 90,
        actions: ['Shared catalogue summary'],
        shouldEscalate: false,
      };
    }
  }

  // Knowledge / policies / store / care / plans
  const kbHits = knowledgeSearch(text, kb);
  if (kbHits.length > 0) {
    actions.push(`Retrieved knowledge: ${kbHits[0].title}`);
    return {
      text:
        `${kbHits[0].content}\n\n` +
        (kbHits[1] ? `Related: ${kbHits[1].title}. Ask if you’d like more detail.\n\n` : '') +
        `I’m Saru, your AI assistant — if this doesn’t fully answer you, I can connect a human colleague.`,
      context: next,
      category,
      subcategory,
      sentiment,
      priority,
      confidence: 86,
      actions,
      shouldEscalate: false,
    };
  }

  // Greetings
  if (/^(hi|hello|hey|namaste|good (morning|afternoon|evening))\b/i.test(text)) {
    return {
      text:
        `Hi! I’m Saru, your virtual customer-support assistant at ${settings.businessName}. ` +
        `I can help with products, orders, shipping, returns, purchase plans, and store information. What can I help you with today?`,
      context: next,
      category: 'General',
      subcategory: 'Greeting',
      sentiment: 'Positive',
      priority: 'Low',
      confidence: 95,
      actions: ['Greeted customer'],
      shouldEscalate: false,
    };
  }

  if (/thank/i.test(text)) {
    return {
      text: "You’re welcome! If anything else comes up — an order, a product, or a visit to the store — I’m right here.",
      context: next,
      category: 'General',
      subcategory: 'Thanks',
      sentiment: 'Positive',
      priority: 'Low',
      confidence: 95,
      actions: [],
      shouldEscalate: false,
    };
  }

  // Fallback — honest uncertainty
  confidence = 35;
  const fallbackEsc = shouldEscalate(text, confidence, category);
  if (fallbackEsc.yes) {
    next.escalate = true;
    next.escalationReason = fallbackEsc.reason;
    return {
      text:
        "I want to make sure you get accurate help. I don’t have verified information for that in my knowledge base, " +
        "so I’ll connect you with a customer-support representative.",
      context: next,
      category,
      subcategory,
      sentiment,
      priority: 'Medium',
      confidence,
      actions: ['Escalated due to low confidence'],
      shouldEscalate: true,
      escalationReason: fallbackEsc.reason,
      endConversation: true,
    };
  }

  return {
    text:
      "I’m not fully sure about that from the information I have access to, and I don’t want to guess. " +
      "Could you rephrase, or share an Order ID / product name? " +
      "Alternatively I can connect you with a human representative.",
    context: next,
    category,
    subcategory,
    sentiment,
    priority,
    confidence,
    actions: ['Admitted uncertainty'],
    shouldEscalate: false,
  };
}

export function welcomeMessage(): string {
  return "Hi! I’m Saru, your virtual customer-support assistant. How can I help you today?";
}

export function createConversationId(): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `SRU-${n}`;
}

export function summarizeConversation(
  messages: ChatMessage[],
  result: ConversationResult,
  category: string
): string {
  const customerLines = messages.filter((m) => m.role === 'customer').map((m) => m.content);
  const first = customerLines[0] || 'No customer message';
  return (
    `Customer discussed ${category.toLowerCase()}. Initial query: “${first.slice(0, 120)}”. ` +
    `Outcome: ${result}. ` +
    `Saru responded across ${messages.filter((m) => m.role === 'saru').length} assistant turns.`
  );
}

export function emptyContext(): AgentContext {
  return { messages: [], productsDiscussed: [] };
}

/** Build a closed ConversationRecord from a live session */
export function buildRecord(params: {
  conversationId: string;
  channel: 'Chat' | 'Voice';
  messages: ChatMessage[];
  ctx: AgentContext;
  category: QueryCategory;
  subcategory: string;
  sentiment: Sentiment;
  priority: Priority;
  result: ConversationResult;
  confidence: number;
  actions: string[];
  resolution: string;
  startedAt: string;
  endedAt: string;
}): ConversationRecord {
  const started = new Date(params.startedAt);
  const ended = new Date(params.endedAt);
  const date = started.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const time = started.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false });
  const mins = Math.max(1, Math.round((ended.getTime() - started.getTime()) / 60000));
  const transcript = params.messages
    .map((m) => `[${m.role}] ${m.content}`)
    .join('\n');
  const firstCustomer = params.messages.find((m) => m.role === 'customer')?.content || '';

  return {
    conversationId: params.conversationId,
    date,
    time,
    channel: params.channel,
    customerName: params.ctx.customerName || '',
    email: params.ctx.email || '',
    phone: params.ctx.phone || '',
    customerId: '',
    location: '',
    isReturning: false,
    query: firstCustomer,
    category: params.category,
    subcategory: params.subcategory,
    orderId: params.ctx.orderId || '',
    products: params.ctx.productsDiscussed.join('; '),
    transcript,
    messages: params.messages,
    aiSummary: summarizeConversation(params.messages, params.result, params.category),
    actionsTaken: params.actions.join('; '),
    resolution: params.resolution,
    result: params.result,
    sentiment: params.sentiment,
    priority: params.priority,
    humanHandoff: params.result === 'Human Escalation',
    escalationReason: params.ctx.escalationReason || '',
    humanAgent: '',
    followUpRequired: params.result === 'Follow-up Required' || params.result === 'Partially Resolved',
    customerFeedback: '',
    aiConfidence: params.confidence,
    resolutionTimeMinutes: mins,
    notes: '',
    startedAt: params.startedAt,
    endedAt: params.endedAt,
    status: 'closed',
  };
}
