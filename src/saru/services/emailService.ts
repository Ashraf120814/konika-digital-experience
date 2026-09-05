/**
 * Email service abstraction.
 * Prototype: queues + logs emails in localStorage and surfaces them in admin.
 * Production: replace sendEmail() with server endpoint (SendGrid / SES / SMTP)
 * using env-stored API keys — never expose keys in the browser.
 */

import type { ConversationRecord, EmailLog } from '../../types/saru';
import { appendEmailLog, todayIST } from './conversationStore';
import { buildDailyReportContent, persistReportRecord } from './excelReport';
import { loadSettings } from '../knowledge';

function uid() {
  return `em-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export interface SendResult {
  ok: boolean;
  log: EmailLog;
}

/**
 * Simulated send — always "succeeds" in demo but logs the full payload.
 * Wire to POST /api/saru/email in production.
 */
export async function sendEmail(params: {
  type: EmailLog['type'];
  to: string;
  subject: string;
  body: string;
  attachmentName?: string;
  attachmentContent?: string;
  conversationId?: string;
}): Promise<SendResult> {
  const log: EmailLog = {
    id: uid(),
    type: params.type,
    to: params.to,
    subject: params.subject,
    status: 'queued',
    attempts: 1,
    createdAt: new Date().toISOString(),
    lastAttemptAt: new Date().toISOString(),
    attachmentName: params.attachmentName,
    conversationId: params.conversationId,
  };

  try {
    // Production: await fetch('/api/saru/email', { method:'POST', body: JSON.stringify(params) })
    // Demo: persist payload for admin visibility
    const payloadKey = `konika_saru_email_payload_${log.id}`;
    localStorage.setItem(
      payloadKey,
      JSON.stringify({
        ...params,
        attachmentContent: params.attachmentContent
          ? `[${params.attachmentContent.length} chars attached]`
          : undefined,
      })
    );
    log.status = 'sent';
    appendEmailLog(log);
    return { ok: true, log };
  } catch (e) {
    log.status = 'failed';
    log.error = e instanceof Error ? e.message : 'Unknown error';
    appendEmailLog(log);
    return { ok: false, log };
  }
}

export async function sendEscalationEmail(record: ConversationRecord): Promise<SendResult> {
  const settings = loadSettings();
  const body = [
    `URGENT escalation from Saru AI`,
    ``,
    `Conversation ID: ${record.conversationId}`,
    `Channel: ${record.channel}`,
    `Priority: ${record.priority}`,
    `Customer: ${record.customerName || '—'}`,
    `Email: ${record.email || '—'}`,
    `Phone: ${record.phone || '—'}`,
    `Order ID: ${record.orderId || '—'}`,
    ``,
    `Query: ${record.query}`,
    `Category: ${record.category} / ${record.subcategory}`,
    ``,
    `AI Summary: ${record.aiSummary}`,
    `Actions taken: ${record.actionsTaken}`,
    `Escalation reason: ${record.escalationReason}`,
    `Recommended next action: Review transcript and contact customer.`,
    ``,
    `--- Transcript ---`,
    record.transcript,
  ].join('\n');

  return sendEmail({
    type: 'escalation',
    to: settings.adminEmail,
    subject: `URGENT — Saru AI Customer Escalation — Conversation #${record.conversationId}`,
    body,
    conversationId: record.conversationId,
  });
}

export async function sendDailyReportEmail(date?: string): Promise<SendResult> {
  const settings = loadSettings();
  const d = date || todayIST();
  const { filename, content, analytics } = buildDailyReportContent(d);

  const body = [
    `Saru AI — Daily Customer Support Report — ${d}`,
    ``,
    `Total conversations: ${analytics.totalConversations}`,
    `Resolved: ${analytics.resolved}`,
    `Escalated: ${analytics.escalated}`,
    `Unresolved: ${analytics.unresolved}`,
    `Chat: ${analytics.chatConversations}`,
    `Voice: ${analytics.voiceConversations}`,
    `Resolution rate: ${analytics.resolutionRate}%`,
    `Follow-ups required: ${analytics.followUpsRequired}`,
    `Most common category: ${analytics.topCategory}`,
    `Top products: ${analytics.topProducts}`,
    ``,
    `The full multi-sheet report is attached as ${filename}.`,
    `Timezone: ${settings.timezone}`,
  ].join('\n');

  const result = await sendEmail({
    type: 'daily_report',
    to: settings.adminEmail,
    subject: `Saru AI — Daily Customer Support Report — ${d}`,
    body,
    attachmentName: filename,
    attachmentContent: content,
  });

  persistReportRecord(d, filename, result.ok, result.log.status);
  return result;
}

/** Retry failed daily reports */
export async function retryFailedDailyReports(): Promise<void> {
  const { loadEmailLog } = await import('./conversationStore');
  const failed = loadEmailLog().filter(
    (e) => e.type === 'daily_report' && e.status === 'failed' && e.attempts < 3
  );
  for (const f of failed) {
    await sendDailyReportEmail();
  }
}
