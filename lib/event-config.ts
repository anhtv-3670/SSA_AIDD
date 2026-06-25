/**
 * Event target configuration.
 * Override at build/runtime via NEXT_PUBLIC_EVENT_START_ISO env var.
 * Default: 2026-12-26T19:00:00+07:00 (next SAA placeholder).
 */
export const EVENT_START_ISO =
  process.env.NEXT_PUBLIC_EVENT_START_ISO ?? "2026-12-26T19:00:00+07:00";

/**
 * Returns the event start time as a Unix timestamp (ms).
 * H-2: guards a malformed NEXT_PUBLIC_EVENT_START_ISO — instead of a silent NaN
 * (which would freeze the countdown), it logs and returns 0 (→ 00/00/00) so the
 * misconfiguration is visible in logs rather than mysterious.
 */
export function eventStartMs(): number {
  const ms = new Date(EVENT_START_ISO).getTime();
  if (!Number.isFinite(ms)) {
    console.error(
      `[event-config] Invalid NEXT_PUBLIC_EVENT_START_ISO: "${EVENT_START_ISO}" — countdown will read 00/00/00.`,
    );
    return 0;
  }
  return ms;
}

/**
 * Formats the event start as a Vietnamese DD/MM/YYYY date string.
 * Reads the calendar date straight from the ISO prefix (timezone-independent &
 * deterministic — avoids server/client TZ drift); falls back to Date parsing,
 * and returns "" for an unparseable value. Pure → unit-testable.
 */
export function formatEventDate(iso: string = EVENT_START_ISO): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}
