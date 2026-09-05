/** Saru AI Customer Support — types */

export type SupportChannel = 'Chat' | 'Voice';

export type ConversationResult =
  | 'Resolved'
  | 'Partially Resolved'
  | 'Human Escalation'
  | 'Unresolved'
  | 'Customer Abandoned'
  | 'Follow-up Required';

export type Sentiment = 'Positive' | 'Neutral' | 'Negative';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type QueryCategory =
  | 'Products'
  | 'Orders'
  | 'Shipping'
  | 'Returns'
  | 'Payments'
  | 'Policies'
  | 'Store'
  | 'Jewellery Care'
  | 'Purchase Plans'
  | 'Complaints'
  | 'General'
  | 'Other';

export interface ChatMessage {
  id: string;
  role: 'customer' | 'saru' | 'system' | 'human';
  content: string;
  timestamp: string;
  /** Voice segment metadata when channel is Voice */
  isVoice?: boolean;
}

export interface ConversationRecord {
  conversationId: string;
  date: string; // YYYY-MM-DD (IST)
  time: string; // HH:mm:ss
  channel: SupportChannel;
  customerName: string;
  email: string;
  phone: string;
  customerId: string;
  location: string;
  isReturning: boolean;
  query: string;
  category: QueryCategory;
  subcategory: string;
  orderId: string;
  products: string;
  transcript: string;
  messages: ChatMessage[];
  aiSummary: string;
  actionsTaken: string;
  resolution: string;
  result: ConversationResult;
  sentiment: Sentiment;
  priority: Priority;
  humanHandoff: boolean;
  escalationReason: string;
  humanAgent: string;
  followUpRequired: boolean;
  customerFeedback: string;
  aiConfidence: number; // 0–100
  resolutionTimeMinutes: number;
  notes: string;
  startedAt: string;
  endedAt: string;
  status: 'active' | 'closed';
}

export interface KnowledgeItem {
  id: string;
  type: 'faq' | 'policy' | 'shipping' | 'returns' | 'store' | 'offer' | 'care' | 'custom';
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  active: boolean;
}

export interface MockOrder {
  orderId: string;
  email: string;
  phone: string;
  customerName: string;
  status: string;
  paymentStatus: string;
  products: string[];
  total: number;
  estimatedDelivery: string;
  shippingStatus: string;
  returnStatus: string;
  placedAt: string;
}

export interface SaruSettings {
  adminEmail: string;
  reportTime: string; // HH:mm in IST
  timezone: string;
  businessName: string;
  storeAddress: string;
  storePhone: string;
  storeHours: string;
  whatsapp: string;
}

export interface DailyAnalytics {
  date: string;
  totalConversations: number;
  chatConversations: number;
  voiceConversations: number;
  resolved: number;
  escalated: number;
  unresolved: number;
  abandoned: number;
  followUp: number;
  resolutionRate: number;
  avgResolutionMinutes: number;
  positive: number;
  neutral: number;
  negative: number;
  topCategory: string;
  topProducts: string;
  followUpsRequired: number;
}

export interface EmailLog {
  id: string;
  type: 'daily_report' | 'escalation' | 'retry';
  to: string;
  subject: string;
  status: 'queued' | 'sent' | 'failed';
  attempts: number;
  createdAt: string;
  lastAttemptAt: string;
  error?: string;
  attachmentName?: string;
  conversationId?: string;
}
