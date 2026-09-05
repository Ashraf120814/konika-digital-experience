/**
 * Daily report scheduler (IST).
 * Checks every minute whether configured report time has been reached today.
 * Production: use server cron (node-cron / Cloud Scheduler) instead of browser timer.
 */

import { loadSettings } from '../knowledge';
import { loadReportMeta, todayIST } from './conversationStore';
import { sendDailyReportEmail } from './emailService';

const LS_LAST_TICK = 'konika_saru_scheduler_last_date';

let timer: ReturnType<typeof setInterval> | null = null;

function nowMinutesIST(): { date: string; hm: string } {
  const date = todayIST();
  const hm = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  return { date, hm };
}

export async function maybeRunDailyReport(): Promise<boolean> {
  const settings = loadSettings();
  const { date, hm } = nowMinutesIST();
  const target = settings.reportTime || '19:00';

  // Only fire at or after target time, once per day
  if (hm < target) return false;

  const last = localStorage.getItem(LS_LAST_TICK);
  if (last === date) return false;

  const already = loadReportMeta().find((m) => m.date === date && m.emailed);
  if (already) {
    localStorage.setItem(LS_LAST_TICK, date);
    return false;
  }

  const result = await sendDailyReportEmail(date);
  if (result.ok) {
    localStorage.setItem(LS_LAST_TICK, date);
    return true;
  }
  // Failed — do not set LAST_TICK so retry can happen
  return false;
}

export function startSaruScheduler() {
  if (timer) return;
  // Initial check
  void maybeRunDailyReport();
  timer = setInterval(() => {
    void maybeRunDailyReport();
  }, 60_000);
}

export function stopSaruScheduler() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
