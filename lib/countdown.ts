/**
 * Pure countdown math — no Date.now() inside.
 * Caller supplies both targetMs and nowMs so this is fully unit-testable.
 */

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Compute countdown from nowMs to targetMs.
 *
 * Rules (per F008 test cases):
 * - diff = targetMs - nowMs; if diff <= 0 → {0,0,0,0}
 * - days  = floor(diff / 86_400_000)  capped 0–99 by pad2 clamp
 * - hours = floor(diff / 3_600_000) % 24   → always 0–23
 * - minutes = floor(diff / 60_000) % 60    → always 0–59
 * - seconds = floor(diff / 1_000) % 60     → always 0–59
 */
export function computeCountdown(
  targetMs: number,
  nowMs: number,
): CountdownResult {
  const diff = targetMs - nowMs;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000) % 24;
  const minutes = Math.floor(diff / 60_000) % 60;
  const seconds = Math.floor(diff / 1_000) % 60;

  return { days, hours, minutes, seconds };
}

/**
 * Zero-pad a number to 2 digits.
 * Clamp: negative numbers and values > 99 (or out of expected range)
 * always render "00" — covers EC-4 (HOURS > 23), EC-5 (negative).
 * NaN or non-finite → "00".
 */
export function pad2(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "00";
  const clamped = Math.min(Math.floor(n), 99);
  return clamped < 10 ? `0${clamped}` : `${clamped}`;
}
