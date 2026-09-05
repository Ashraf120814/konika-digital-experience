/**
 * Conversation store — localStorage as durable client-side DB for the prototype.
 * Architecture mirrors a real DB:
 *   Customer → Saru → Backend → Database
 * Swap load/save implementations with API calls without changing callers.
 */

import type { ConversationRecord, DailyAnalytics, EmailLog } from '../../types/saru';

const LS_CONV = 'konika_saru_conversations';
const LS_EMAIL = 'konika_saru_email_log';
const LS_REPORTS = 'konika_saru_report_meta';

export function loadConversations(): ConversationRecord[] {
  try {
    const raw = localStorage.getItem(LS_CONV);
    return raw ? (JSON.parse(raw) as ConversationRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveConversations(list: ConversationRecord[]) {
  localStorage.setItem(LS_CONV, JSON.stringify(list));
}

export function upsertConversation(record: ConversationRecord) {
  const list = loadConversations();
  const idx = list.findIndex((c) => c.conversationId === record.conversationId);
  if (idx >= 0) list[idx] = record;
  else list.unshift(record);
  saveConversations(list);
  return record;
}

export function getConversation(id: string): ConversationRecord | undefined {
  return loadConversations().find((c) => c.conversationId === id);
}

export function conversationsForDate(date: string): ConversationRecord[] {
  return loadConversations().filter((c) => c.date === date);
}

export function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export function computeDailyAnalytics(date: string): DailyAnalytics {
  const list = conversationsForDate(date);
  const chat = list.filter((c) => c.channel === 'Chat').length;
  const voice = list.filter((c) => c.channel === 'Voice').length;
  const resolved = list.filter((c) => c.result === 'Resolved').length;
  const escalated = list.filter((c) => c.result === 'Human Escalation').length;
  const unresolved = list.filter(
    (c) => c.result === 'Unresolved' || c.result === 'Partially Resolved'
  ).length;
  const abandoned = list.filter((c) => c.result === 'Customer Abandoned').length;
  const followUp = list.filter((c) => c.followUpRequired).length;
  const total = list.length || 1;
  const avg =
    list.reduce((s, c) => s + c.resolutionTimeMinutes, 0) / (list.length || 1);
  const cats: Record<string, number> = {};
  const prods: Record<string, number> = {};
  list.forEach((c) => {
    cats[c.category] = (cats[c.category] || 0) + 1;
    c.products.split(';').forEach((p) => {
      const t = p.trim();
      if (t) prods[t] = (prods[t] || 0) + 1;
    });
  });
  const topCategory =
    Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const topProducts = Object.entries(prods)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([n]) => n)
    .join('; ') || '—';

  return {
    date,
    totalConversations: list.length,
    chatConversations: chat,
    voiceConversations: voice,
    resolved,
    escalated,
    unresolved,
    abandoned,
    followUp,
    resolutionRate: list.length ? Math.round((resolved / total) * 1000) / 10 : 0,
    avgResolutionMinutes: Math.round(avg * 10) / 10,
    positive: list.filter((c) => c.sentiment === 'Positive').length,
    neutral: list.filter((c) => c.sentiment === 'Neutral').length,
    negative: list.filter((c) => c.sentiment === 'Negative').length,
    topCategory,
    topProducts,
    followUpsRequired: followUp,
  };
}

export function loadEmailLog(): EmailLog[] {
  try {
    const raw = localStorage.getItem(LS_EMAIL);
    return raw ? (JSON.parse(raw) as EmailLog[]) : [];
  } catch {
    return [];
  }
}

export function appendEmailLog(entry: EmailLog) {
  const list = loadEmailLog();
  list.unshift(entry);
  localStorage.setItem(LS_EMAIL, JSON.stringify(list.slice(0, 200)));
}

export interface ReportMeta {
  date: string;
  filename: string;
  generatedAt: string;
  emailed: boolean;
  emailStatus: string;
}

export function loadReportMeta(): ReportMeta[] {
  try {
    const raw = localStorage.getItem(LS_REPORTS);
    return raw ? (JSON.parse(raw) as ReportMeta[]) : [];
  } catch {
    return [];
  }
}

export function saveReportMeta(meta: ReportMeta) {
  const list = loadReportMeta().filter((m) => m.date !== meta.date);
  list.unshift(meta);
  localStorage.setItem(LS_REPORTS, JSON.stringify(list));
}
