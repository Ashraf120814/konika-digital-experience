import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  computeDailyAnalytics,
  loadConversations,
  loadEmailLog,
  loadReportMeta,
  todayIST,
} from '../../saru/services/conversationStore';
import { downloadDailyReport } from '../../saru/services/excelReport';
import { sendDailyReportEmail } from '../../saru/services/emailService';
import { loadSettings, saveSettings } from '../../saru/knowledge';
import type { ConversationRecord, SaruSettings } from '../../types/saru';

export function SaruReportsPage() {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const all = useMemo(() => loadConversations(), [tick]);
  const emails = useMemo(() => loadEmailLog(), [tick]);
  const reports = useMemo(() => loadReportMeta(), [tick]);
  const [dateFilter, setDateFilter] = useState(todayIST());
  const [channel, setChannel] = useState('All');
  const [result, setResult] = useState('All');
  const [sentiment, setSentiment] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ConversationRecord | null>(null);
  const [settings, setSettings] = useState<SaruSettings>(() => loadSettings());
  const [emailMsg, setEmailMsg] = useState('');

  const analytics = computeDailyAnalytics(dateFilter);

  const filtered = all.filter((c) => {
    if (dateFilter && c.date !== dateFilter) return false;
    if (channel !== 'All' && c.channel !== channel) return false;
    if (result !== 'All' && c.result !== result) return false;
    if (sentiment !== 'All' && c.sentiment !== sentiment) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.conversationId.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.query.toLowerCase().includes(q) ||
        c.orderId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = [
    { label: 'Total', value: analytics.totalConversations },
    { label: 'Chat', value: analytics.chatConversations },
    { label: 'Voice', value: analytics.voiceConversations },
    { label: 'Resolved', value: analytics.resolved },
    { label: 'Escalated', value: analytics.escalated },
    { label: 'Unresolved', value: analytics.unresolved },
    { label: 'Resolution %', value: `${analytics.resolutionRate}%` },
    { label: 'Avg mins', value: analytics.avgResolutionMinutes },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gold-dark">Saru AI · Admin</p>
          <h1 className="font-serif text-3xl">Reports & Conversations</h1>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link to="/admin/saru/knowledge" className="border border-charcoal/15 px-3 py-2 hover:border-gold">
            Knowledge Base
          </Link>
          <Link to="/admin/analytics" className="border border-charcoal/15 px-3 py-2 hover:border-gold">
            Ecommerce Analytics
          </Link>
        </div>
      </div>
      <p className="text-[10px] text-muted mb-6 uppercase tracking-wide">
        Conversations auto-logged · Excel export · Email queue (demo)
      </p>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="border border-charcoal/8 p-3 bg-white">
            <p className="text-[9px] tracking-widest uppercase text-muted">{s.label}</p>
            <p className="font-serif text-xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => {
            downloadDailyReport(dateFilter);
            refresh();
          }}
          className="bg-charcoal text-ivory px-4 py-2 text-xs tracking-widest uppercase hover:bg-gold-dark"
        >
          Download Excel Report
        </button>
        <button
          type="button"
          onClick={async () => {
            const r = await sendDailyReportEmail(dateFilter);
            setEmailMsg(
              r.ok
                ? `Daily report queued/sent to ${settings.adminEmail} (demo log).`
                : `Email failed: ${r.log.error || 'unknown'}`
            );
            refresh();
          }}
          className="border border-charcoal px-4 py-2 text-xs tracking-widest uppercase hover:bg-charcoal hover:text-ivory"
        >
          Email Daily Report Now
        </button>
        <button type="button" onClick={refresh} className="border border-charcoal/15 px-4 py-2 text-xs tracking-widest uppercase">
          Refresh
        </button>
      </div>
      {emailMsg && <p className="text-xs text-muted mb-4">{emailMsg}</p>}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-charcoal/15 px-2 py-1.5 text-sm"
        />
        <select value={channel} onChange={(e) => setChannel(e.target.value)} className="border border-charcoal/15 px-2 py-1.5 text-sm">
          <option>All</option>
          <option>Chat</option>
          <option>Voice</option>
        </select>
        <select value={result} onChange={(e) => setResult(e.target.value)} className="border border-charcoal/15 px-2 py-1.5 text-sm">
          <option>All</option>
          <option>Resolved</option>
          <option>Human Escalation</option>
          <option>Unresolved</option>
          <option>Customer Abandoned</option>
          <option>Partially Resolved</option>
          <option>Follow-up Required</option>
        </select>
        <select value={sentiment} onChange={(e) => setSentiment(e.target.value)} className="border border-charcoal/15 px-2 py-1.5 text-sm">
          <option>All</option>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ID, customer, query…"
          className="border border-charcoal/15 px-2 py-1.5 text-sm flex-1 min-w-[160px]"
        />
      </div>

      {/* Table */}
      <div className="border border-charcoal/8 overflow-x-auto mb-10">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-[10px] tracking-widest uppercase text-muted border-b border-charcoal/10 bg-ivory-deep">
              <th className="p-2">ID</th>
              <th className="p-2">Time</th>
              <th className="p-2">Channel</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Query</th>
              <th className="p-2">Category</th>
              <th className="p-2">Result</th>
              <th className="p-2">Sentiment</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-muted text-sm">
                  No conversations yet. Open “Chat with Saru” on the site to generate records.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.conversationId} className="border-b border-charcoal/5 hover:bg-ivory-deep/50">
                <td className="p-2 font-mono text-xs">{c.conversationId}</td>
                <td className="p-2 text-xs">{c.time}</td>
                <td className="p-2 text-xs">{c.channel}</td>
                <td className="p-2 text-xs">{c.customerName || c.email || '—'}</td>
                <td className="p-2 text-xs max-w-[180px] truncate">{c.query}</td>
                <td className="p-2 text-xs">{c.category}</td>
                <td className="p-2 text-xs">{c.result}</td>
                <td className="p-2 text-xs">{c.sentiment}</td>
                <td className="p-2">
                  <button type="button" onClick={() => setSelected(c)} className="text-[10px] tracking-widest uppercase text-gold-dark">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Settings */}
      <div className="border border-charcoal/10 p-6 mb-10 max-w-lg">
        <h2 className="font-serif text-xl mb-4">Report settings</h2>
        <label className="text-[10px] tracking-widest uppercase text-muted block mb-1">Admin email</label>
        <input
          value={settings.adminEmail}
          onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
          className="w-full border border-charcoal/15 px-3 py-2 text-sm mb-3"
        />
        <label className="text-[10px] tracking-widest uppercase text-muted block mb-1">
          Daily report time (IST)
        </label>
        <input
          type="time"
          value={settings.reportTime}
          onChange={(e) => setSettings({ ...settings, reportTime: e.target.value })}
          className="w-full border border-charcoal/15 px-3 py-2 text-sm mb-3"
        />
        <p className="text-xs text-muted mb-3">Timezone: {settings.timezone}</p>
        <button
          type="button"
          onClick={() => {
            saveSettings(settings);
            setEmailMsg('Settings saved.');
          }}
          className="bg-charcoal text-ivory px-4 py-2 text-xs tracking-widest uppercase"
        >
          Save settings
        </button>
      </div>

      {/* Email log + reports */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-charcoal/8 p-4">
          <h3 className="font-serif text-lg mb-3">Email delivery log</h3>
          <ul className="space-y-2 max-h-48 overflow-y-auto text-xs">
            {emails.length === 0 && <li className="text-muted">No emails yet.</li>}
            {emails.slice(0, 20).map((e) => (
              <li key={e.id} className="border-b border-charcoal/5 pb-2">
                <span className="font-medium">{e.type}</span> · {e.status} · {e.to}
                <br />
                <span className="text-muted">{e.subject}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-charcoal/8 p-4">
          <h3 className="font-serif text-lg mb-3">Historical reports</h3>
          <ul className="space-y-2 max-h-48 overflow-y-auto text-xs">
            {reports.length === 0 && <li className="text-muted">No reports generated yet.</li>}
            {reports.map((r) => (
              <li key={r.date + r.generatedAt} className="border-b border-charcoal/5 pb-2">
                {r.filename} · emailed: {r.emailed ? 'yes' : 'no'} ({r.emailStatus})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4">
          <div className="bg-ivory max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-lg p-6 shadow-xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-serif text-xl">{selected.conversationId}</h3>
              <button type="button" onClick={() => setSelected(null)} className="text-sm">
                Close
              </button>
            </div>
            <p className="text-xs text-muted mb-2">
              {selected.date} {selected.time} · {selected.channel} · {selected.result} ·{' '}
              {selected.sentiment} · Priority {selected.priority}
            </p>
            <p className="text-sm mb-2">
              <strong>Summary:</strong> {selected.aiSummary}
            </p>
            <p className="text-sm mb-2">
              <strong>Actions:</strong> {selected.actionsTaken || '—'}
            </p>
            {selected.escalationReason && (
              <p className="text-sm mb-2 text-red-800">
                <strong>Escalation:</strong> {selected.escalationReason}
              </p>
            )}
            <pre className="mt-4 bg-white border border-charcoal/8 p-3 text-xs whitespace-pre-wrap max-h-64 overflow-y-auto">
              {selected.transcript}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
