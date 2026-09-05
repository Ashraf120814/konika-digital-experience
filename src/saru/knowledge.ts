import type { KnowledgeItem, MockOrder, SaruSettings } from '../types/saru';
import { products } from '../data/products';
import { formatPrice } from '../data/products';

const LS_KB = 'konika_saru_knowledge';
const LS_SETTINGS = 'konika_saru_settings';

export const defaultSettings: SaruSettings = {
  adminEmail: 'admin@konika-concept.demo',
  reportTime: '19:00',
  timezone: 'Asia/Kolkata',
  businessName: 'Konika Jewellery (Digital Experience Concept)',
  storeAddress: '55 NSC Bose Rd, Sowcarpet, George Town, Chennai, Tamil Nadu 600003',
  storePhone: '+91 73970 85346 / +91 86677 09038',
  storeHours: 'Monday–Saturday 10:00 AM – 8:00 PM IST; Sunday 11:00 AM – 6:00 PM IST (demo hours)',
  whatsapp: '+91 73970 85346',
};

export const defaultKnowledge: KnowledgeItem[] = [
  {
    id: 'kb-ship-1',
    type: 'shipping',
    title: 'Shipping & delivery (demo policy)',
    content:
      'Standard delivery within India typically takes 5–7 business days after dispatch. Express options may be available at checkout. PIN-code serviceability is confirmed on the product page. Shipping charges, if any, are shown before payment. This is demo policy text for the concept — confirm final terms at the store or official channels.',
    tags: ['shipping', 'delivery', 'timeline'],
    updatedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'kb-ret-1',
    type: 'returns',
    title: 'Returns, exchange & buyback (demo)',
    content:
      'Exchange and buyback policies for jewellery typically depend on product type, hallmarking, and invoice. In this concept demo: customers may request exchange guidance via support; final eligibility is confirmed by the store. Refund timelines, when applicable, follow the payment method used. Saru will not invent specific percentages or timelines not listed here — escalate for case-specific confirmation.',
    tags: ['returns', 'exchange', 'refund', 'buyback'],
    updatedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'kb-pay-1',
    type: 'policy',
    title: 'Payments',
    content:
      'Accepted methods in a typical jewellery ecommerce flow include UPI, cards, net banking, and store payment. Saru never asks for OTP, CVV, full card number, or passwords. Payment issues are escalated to human support after collecting order ID only.',
    tags: ['payment', 'upi', 'card'],
    updatedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'kb-care-1',
    type: 'care',
    title: 'Jewellery care',
    content:
      'Store pieces separately to avoid scratches. Remove jewellery before swimming, bathing, or applying perfume/cosmetics. Clean with a soft dry cloth. For meenakari and polki, avoid harsh chemicals and ultrasonic cleaners unless advised by the jeweller. Professional cleaning is recommended periodically.',
    tags: ['care', 'maintenance', 'cleaning'],
    updatedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'kb-store-1',
    type: 'store',
    title: 'Store information',
    content:
      'Concept reference store: 55 NSC Bose Rd, Sowcarpet, George Town, Chennai. Contact: +91 73970 85346 / +91 86677 09038. Hours (demo): Mon–Sat 10 AM–8 PM IST, Sun 11 AM–6 PM IST. This concept is not the official website.',
    tags: ['store', 'address', 'hours', 'contact'],
    updatedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'kb-plan-1',
    type: 'policy',
    title: 'Purchase plans (public scheme summary)',
    content:
      'Based on publicly available Zero% Gold Purchase Plan information: monthly premiums of ₹2,000, ₹5,000 or ₹10,000 for 11 months. Option A: no wastage up to 10% & no making charges on 916 gold jewellery at maturity (terms apply). Option B: 1 month bonus after maturity. Final benefits depend on official scheme terms at enrolment. Saru will not invent additional benefits.',
    tags: ['purchase plan', 'gold scheme', 'emi', 'monthly'],
    updatedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'kb-faq-1',
    type: 'faq',
    title: 'Is jewellery hallmarked?',
    content:
      'Hallmarking is standard practice for gold jewellery purity verification in India. For specific piece certification, check the product page or ask in-store. Saru does not invent certificate numbers.',
    tags: ['hallmark', 'purity', '22k', '18k'],
    updatedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'kb-faq-2',
    type: 'faq',
    title: 'How do I track my order?',
    content:
      'Share your Order ID (e.g. KJ10245). Saru looks up the mock order database for status, payment, and estimated delivery. If the order is not found, she will offer human support.',
    tags: ['order', 'track', 'status'],
    updatedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'kb-faq-3',
    type: 'faq',
    title: 'Do you offer discounts or offers?',
    content:
      'Only offers explicitly listed in the knowledge base or product catalogue are shared. Currently no live promotional percentages are stored in this concept demo unless an admin adds them under Knowledge Management. Saru will not invent discounts.',
    tags: ['offer', 'discount', 'sale'],
    updatedAt: new Date().toISOString(),
    active: true,
  },
];

/** Demo order database — replace with real Order API */
export const mockOrders: MockOrder[] = [
  {
    orderId: 'KJ10245',
    email: 'priya.sharma@example.com',
    phone: '9876543210',
    customerName: 'Priya Sharma',
    status: 'Shipped',
    paymentStatus: 'Paid',
    products: ['Temple Lakshmi Gold Ring', 'Antique Jhumka Earrings'],
    total: 80700,
    estimatedDelivery: '2026-09-12',
    shippingStatus: 'In transit — dispatched from Chennai hub',
    returnStatus: 'Not requested',
    placedAt: '2026-09-01T11:30:00+05:30',
  },
  {
    orderId: 'KJ10246',
    email: 'rahul.n@example.com',
    phone: '9123456780',
    customerName: 'Rahul Nair',
    status: 'Processing',
    paymentStatus: 'Paid',
    products: ['Minimal Solitaire Band'],
    total: 18900,
    estimatedDelivery: '2026-09-14',
    shippingStatus: 'Being prepared for dispatch',
    returnStatus: 'Not requested',
    placedAt: '2026-09-03T16:05:00+05:30',
  },
  {
    orderId: 'KJ10247',
    email: 'anita.k@example.com',
    phone: '9988776655',
    customerName: 'Anita Krishnan',
    status: 'Delivered',
    paymentStatus: 'Paid',
    products: ['Classic Gold Mangalsutra'],
    total: 48900,
    estimatedDelivery: '2026-08-28',
    shippingStatus: 'Delivered on 2026-08-27',
    returnStatus: 'Not requested',
    placedAt: '2026-08-20T10:00:00+05:30',
  },
];

export function loadKnowledge(): KnowledgeItem[] {
  try {
    const raw = localStorage.getItem(LS_KB);
    if (raw) return JSON.parse(raw) as KnowledgeItem[];
  } catch {
    /* ignore */
  }
  return [...defaultKnowledge];
}

export function saveKnowledge(items: KnowledgeItem[]) {
  localStorage.setItem(LS_KB, JSON.stringify(items));
}

export function loadSettings(): SaruSettings {
  try {
    const raw = localStorage.getItem(LS_SETTINGS);
    if (raw) return { ...defaultSettings, ...(JSON.parse(raw) as SaruSettings) };
  } catch {
    /* ignore */
  }
  return { ...defaultSettings };
}

export function saveSettings(s: SaruSettings) {
  localStorage.setItem(LS_SETTINGS, JSON.stringify(s));
}

export function searchProducts(query: string) {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export function findOrder(orderId: string, emailOrPhone?: string): MockOrder | null {
  const id = orderId.trim().toUpperCase();
  const order = mockOrders.find((o) => o.orderId.toUpperCase() === id);
  if (!order) return null;
  if (emailOrPhone) {
    const key = emailOrPhone.trim().toLowerCase();
    const match =
      order.email.toLowerCase() === key ||
      order.phone.includes(key.replace(/\D/g, '')) ||
      key.replace(/\D/g, '').length >= 10 && order.phone.includes(key.replace(/\D/g, '').slice(-10));
    if (!match) return null;
  }
  return order;
}

export function productCatalogueSummary(): string {
  const sample = products.slice(0, 8).map((p) => `${p.name} (${formatPrice(p.price)})`).join('; ');
  return `Catalogue has ${products.length} demo products across Rings, Earrings, Necklaces, Bracelets, Pendants, Mangalsutra. Examples: ${sample}. Ask for a category or name for specifics.`;
}

export function knowledgeSearch(query: string, items?: KnowledgeItem[]): KnowledgeItem[] {
  const kb = (items || loadKnowledge()).filter((k) => k.active);
  const q = query.toLowerCase();
  const scored = kb
    .map((k) => {
      let score = 0;
      if (k.title.toLowerCase().includes(q)) score += 5;
      k.tags.forEach((t) => {
        if (q.includes(t) || t.includes(q.split(' ')[0])) score += 3;
      });
      q.split(/\s+/).forEach((w) => {
        if (w.length > 3 && k.content.toLowerCase().includes(w)) score += 1;
      });
      return { k, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map((x) => x.k);
}
