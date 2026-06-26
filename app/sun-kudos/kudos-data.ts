// Decorative (presentational) constants for the Sun* Kudos Live Board.
// These items have NO backend table this pass — they are static UI fixtures.
// Components that render them carry a "presentational — not backed by DB this pass" note.
//
// The KudosEntry / KudosPerson types and the highlightKudos / allKudos arrays are
// kept here as minimal stubs so that kudos-filter.test.ts (which imports from this
// file) continues to compile and pass without touching test files.
// Real feed data comes from lib/data/kudos-queries.ts via page.tsx props.

// Re-export the canonical types so existing imports keep working.
export type { KudosEntry, KudosPerson } from "@/lib/data/types";

// KudosStats — sidebar shape (field names match the old mock; page maps ProfileStats → this).
export interface KudosStats {
  received: number;
  sent: number;
  hearts: number;
  boxOpened: number;
  boxUnopened: number;
}

// ---------------------------------------------------------------------------
// Stub feed arrays — kept non-empty so filter smoke tests pass.
// Real entries come from the DB; these stubs are never rendered in production.
// ---------------------------------------------------------------------------

import type { KudosEntry, KudosPerson } from "@/lib/data/types";

const STUB_PERSON: KudosPerson = {
  id: "stub",
  name: "Stub Person",
  dept: "CEVC10",
  title: "New Hero",
  initial: "S",
};

const STUB_ENTRY: KudosEntry = {
  id: "stub-1",
  sender: STUB_PERSON,
  receiver: { ...STUB_PERSON, id: "stub-2", name: "Stub Receiver", dept: "DXD01", initial: "R" },
  time: "10:00 - 01/01/2025",
  message: "Stub message for test compatibility",
  hashtags: ["#Dedicated"],
  likeCount: 0,
};

/** @deprecated Use real data from getHighlightKudos() — this stub exists only for test compatibility. */
export const highlightKudos: KudosEntry[] = [STUB_ENTRY];

/** @deprecated Use real data from getKudosFeed() — this stub exists only for test compatibility. */
export const allKudos: KudosEntry[] = [STUB_ENTRY];

// ---------------------------------------------------------------------------
// GiftRecipient — presentational only, not backed by DB this pass
// ---------------------------------------------------------------------------

export interface GiftRecipient {
  id: string;
  name: string;
  gift: string;
  initial: string;
}

// presentational — not backed by DB this pass
export const giftRecipients: GiftRecipient[] = [
  { id: "g1", name: "Huỳnh Dương Xuân", gift: "Nhận được 1 áo phông SAA", initial: "H" },
  { id: "g2", name: "Huỳnh Dương Xuân", gift: "Nhận được 1 áo phông SAA", initial: "H" },
  { id: "g3", name: "Huỳnh Dương Xuân", gift: "Nhận được 1 áo phông SAA", initial: "H" },
  { id: "g4", name: "Huỳnh Dương Xuân", gift: "Nhận được 1 áo phông SAA", initial: "H" },
  { id: "g5", name: "Huỳnh Dương Xuân", gift: "Nhận được 1 áo phông SAA", initial: "H" },
  { id: "g6", name: "Nguyễn Minh Tuấn", gift: "Nhận được 1 áo phông SAA", initial: "N" },
  { id: "g7", name: "Trần Thị Lan Anh", gift: "Nhận được 1 áo phông SAA", initial: "T" },
  { id: "g8", name: "Lê Văn Hùng", gift: "Nhận được 1 áo phông SAA", initial: "L" },
  { id: "g9", name: "Phạm Thu Hương", gift: "Nhận được 1 áo phông SAA", initial: "P" },
  { id: "g10", name: "Vũ Quốc Bảo", gift: "Nhận được 1 áo phông SAA", initial: "V" },
];

// ---------------------------------------------------------------------------
// Spotlight board — presentational only, not backed by DB this pass
// ---------------------------------------------------------------------------

export const spotlightNames: string[] = [
  "Huỳnh Dương Xuân Nhật",
  "Nguyễn Minh Tuấn",
  "Trần Thị Lan Anh",
  "Lê Văn Hùng",
  "Phạm Thu Hương",
  "Vũ Quốc Bảo",
  "Đặng Thị Mai",
  "Hoàng Văn Nam",
  "Bùi Thị Hoa",
  "Ngô Quốc Duy",
  "Cao Thị Thanh",
  "Đinh Văn Long",
  "Lý Thị Ngọc",
  "Phan Minh Khoa",
  "Dương Thị Bình",
  "Trịnh Văn Đức",
  "Lưu Thị Hạnh",
  "Mai Văn Thịnh",
  "Hồ Thị Kim Ngân",
  "Từ Quang Vinh",
];
// Name to highlight gold — presentational only, not backed by DB this pass
export const spotlightHighlighted = "Huỳnh Dương Xuân Nhật";

// ---------------------------------------------------------------------------
// Ticker lines — presentational only, not backed by DB this pass
// ---------------------------------------------------------------------------

export interface TickerLine {
  time: string;
  text: string;
}

// presentational — not backed by DB this pass
export const tickerEntries: TickerLine[] = [
  { time: "10:03", text: "Nguyễn Minh Tuấn đã nhận được một Kudos mới" },
  { time: "10:07", text: "Huỳnh Dương Xuân Nhật đã nhận được một Kudos mới" },
  { time: "10:12", text: "Trần Thị Lan Anh đã nhận được một Kudos mới" },
  { time: "10:18", text: "Lê Văn Hùng đã nhận được một Kudos mới" },
  { time: "10:25", text: "Phạm Thu Hương đã nhận được một Kudos mới" },
];
