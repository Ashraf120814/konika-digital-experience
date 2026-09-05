/**
 * Excel-compatible daily report generator.
 * Produces CSV sheets packaged as a multi-section downloadable file.
 * For production: swap with SheetJS (xlsx) or server-side Excel generation.
 * Primary source of truth remains the conversation database (localStorage/API).
 */

import type { ConversationRecord, DailyAnalytics } from '../../types/saru';
import {
  computeDailyAnalytics,
  conversationsForDate,
  saveReportMeta,
} from './conversationStore';

const HEADERS = [
  'Conversation ID',
  'Date',
  'Time',
  'Channel',
  'Customer Name',
  'Email',
  'Phone',
  'Customer ID',
  'Query',
  'Category',
  'Subcategory',
  'Order ID',
  'Products',
  'Transcript',
  'AI Summary',
  'Actions Taken',
  'Resolution',
  'Result',
  'Sentiment',
  'Priority',
  'Human Handoff',
  'Escalation Reason',
  'Follow-up Required',
  'Customer Feedback',
  'AI Confidence',
  'Resolution Time',
  'Notes',
] as const;

function escapeCsv(v: string | number | boolean): string {
  const s = String(v ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowFromRecord(c: ConversationRecord): string {
  const vals = [
    c.conversationId,
    c.date,
    c.time,
    c.channel,
    c.customerName,
    c.email,
    c.phone,
    c.customerId,
    c.query,
    c.category,
    c.subcategory,
    c.orderId,
    c.products,
    c.transcript,
    c.aiSummary,
    c.actionsTaken,
    c.resolution,
    c.result,
    c.sentiment,
    c.priority,
    c.humanHandoff ? 'Yes' : 'No',
    c.escalationReason,
    c.followUpRequired ? 'Yes' : 'No',
    c.customerFeedback,
    c.aiConfidence,
    c.resolutionTimeMinutes,
    c.notes,
  ];
  return vals.map(escapeCsv).join(',');
}

function sheetCsv(title: string, records: ConversationRecord[]): string {
  const lines = [`### SHEET: ${title}`, HEADERS.join(',')];
  records.forEach((r) => lines.push(rowFromRecord(r)));
  return lines.join('\n');
}

function analyticsSheet(a: DailyAnalytics): string {
  const lines = [
    '### SHEET: AI Analytics',
    'Metric,Value',
    `Date,${a.date}`,
    `Total conversations,${a.totalConversations}`,
    `Chat conversations,${a.chatConversations}`,
    `Voice conversations,${a.voiceConversations}`,
    `Resolved,${a.resolved}`,
    `Escalated,${a.escalated}`,
    `Unresolved,${a.unresolved}`,
    `Abandoned,${a.abandoned}`,
    `Follow-up required,${a.followUpsRequired}`,
    `Resolution rate %,${a.resolutionRate}`,
    `Avg resolution minutes,${a.avgResolutionMinutes}`,
    `Positive sentiment,${a.positive}`,
    `Neutral sentiment,${a.neutral}`,
    `Negative sentiment,${a.negative}`,
    `Top category,${escapeCsv(a.topCategory)}`,
    `Top products,${escapeCsv(a.topProducts)}`,
  ];
  return lines.join('\n');
}

function customerSheet(records: ConversationRecord[]): string {
  const lines = [
    '### SHEET: Customer Data',
    'Customer Name,Email,Phone,Customer ID,Conversations,Channels',
  ];
  const map = new Map<string, { name: string; email: string; phone: string; id: string; n: number; channels: Set<string> }>();
  records.forEach((c) => {
    const key = (c.email || c.phone || c.customerName || c.conversationId).toLowerCase();
    const cur = map.get(key) || {
      name: c.customerName,
      email: c.email,
      phone: c.phone,
      id: c.customerId,
      n: 0,
      channels: new Set<string>(),
    };
    cur.n += 1;
    cur.channels.add(c.channel);
    if (c.customerName) cur.name = c.customerName;
    if (c.email) cur.email = c.email;
    if (c.phone) cur.phone = c.phone;
    map.set(key, cur);
  });
  map.forEach((v) => {
    lines.push(
      [v.name, v.email, v.phone, v.id, v.n, [...v.channels].join('/')].map(escapeCsv).join(',')
    );
  });
  return lines.join('\n');
}

/** Build multi-sheet report text (Excel-compatible via CSV import / .xlsx pipeline) */
export function buildDailyReportContent(date: string): {
  filename: string;
  content: string;
  analytics: DailyAnalytics;
} {
  const all = conversationsForDate(date);
  const analytics = computeDailyAnalytics(date);
  const resolved = all.filter((c) => c.result === 'Resolved');
  const escalated = all.filter((c) => c.result === 'Human Escalation');
  const unresolved = all.filter(
    (c) =>
      c.result === 'Unresolved' ||
      c.result === 'Follow-up Required' ||
      c.result === 'Partially Resolved' ||
      c.result === 'Customer Abandoned'
  );

  const content = [
    `Saru AI Customer Support Report — ${date}`,
    `Generated (IST concept): ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    '',
    sheetCsv('All Conversations', all),
    '',
    sheetCsv('Resolved Queries', resolved),
    '',
    sheetCsv('Escalated Queries', escalated),
    '',
    sheetCsv('Unresolved / Follow-Up', unresolved),
    '',
    customerSheet(all),
    '',
    analyticsSheet(analytics),
  ].join('\n');

  const filename = `Saru_Customer_Support_Report_${date}.csv`;
  return { filename, content, analytics };
}

/** Trigger browser download of the daily report */
export function downloadDailyReport(date: string) {
  const { filename, content, analytics } = buildDailyReportContent(date);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  saveReportMeta({
    date,
    filename,
    generatedAt: new Date().toISOString(),
    emailed: false,
    emailStatus: 'downloaded_locally',
  });
  return { filename, analytics };
}

/** Store report blob metadata (production would write to object storage) */
export function persistReportRecord(date: string, filename: string, emailed: boolean, emailStatus: string) {
  saveReportMeta({
    date,
    filename,
    generatedAt: new Date().toISOString(),
    emailed,
    emailStatus,
  });
}
