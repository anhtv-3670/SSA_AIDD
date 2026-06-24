// Mock data for Sun* Kudos Live Board — extracted from Figma design (MaZUn5xHXZ)
// Content is representative, not exhaustive.

export type TitleBadge = "New Hero" | "Rising Hero" | "Legend Hero" | "IDOL GIỚI TRẺ";

export interface KudosPerson {
  id: string;
  name: string;
  dept: string;
  title: TitleBadge;
  initial: string;
}

export interface KudosEntry {
  id: string;
  sender: KudosPerson;
  receiver: KudosPerson;
  time: string;
  message: string;
  hashtags: string[];
  likeCount: number;
  images?: string[];
}

export interface GiftRecipient {
  id: string;
  name: string;
  gift: string;
  initial: string;
}

export interface TickerLine {
  time: string;
  text: string;
}

export interface KudosStats {
  received: number;
  sent: number;
  hearts: number;
  boxOpened: number;
  boxUnopened: number;
}

// --- People ---
const HUYNH_DUONG: KudosPerson = {
  id: "p1",
  name: "Huỳnh Dương Xuân Nhật",
  dept: "CECV10",
  title: "IDOL GIỚI TRẺ",
  initial: "H",
};
const NGUYEN_MINH: KudosPerson = {
  id: "p2",
  name: "Nguyễn Minh Tuấn",
  dept: "CEVC10",
  title: "Rising Hero",
  initial: "N",
};
const TRAN_THI: KudosPerson = {
  id: "p3",
  name: "Trần Thị Lan Anh",
  dept: "DXD01",
  title: "New Hero",
  initial: "T",
};
const LE_VAN: KudosPerson = {
  id: "p4",
  name: "Lê Văn Hùng",
  dept: "PMG02",
  title: "Legend Hero",
  initial: "L",
};
const PHAM_THU: KudosPerson = {
  id: "p5",
  name: "Phạm Thu Hương",
  dept: "HRD01",
  title: "Rising Hero",
  initial: "P",
};
const VU_QUOC: KudosPerson = {
  id: "p6",
  name: "Vũ Quốc Bảo",
  dept: "CEVC10",
  title: "New Hero",
  initial: "V",
};

// --- Highlight Kudos (carousel) ---
export const highlightKudos: KudosEntry[] = [
  {
    id: "h1",
    sender: NGUYEN_MINH,
    receiver: HUYNH_DUONG,
    time: "10:00 - 10/30/2025",
    message:
      "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất...",
    hashtags: ["#Dedicated", "#Inspiring"],
    likeCount: 1000,
  },
  {
    id: "h2",
    sender: TRAN_THI,
    receiver: LE_VAN,
    time: "11:30 - 10/30/2025",
    message:
      "Anh Hùng đã hỗ trợ team rất nhiều trong dự án lần này. Sự tận tâm và chuyên nghiệp của anh thật đáng khâm phục!",
    hashtags: ["#Teamwork", "#Dedicated"],
    likeCount: 842,
  },
  {
    id: "h3",
    sender: VU_QUOC,
    receiver: PHAM_THU,
    time: "09:15 - 10/30/2025",
    message:
      "Chị Hương luôn là người truyền cảm hứng cho cả team. Cảm ơn chị vì những lời động viên đúng lúc và sự quan tâm chân thành.",
    hashtags: ["#Inspiring", "#Leadership"],
    likeCount: 654,
  },
  {
    id: "h4",
    sender: HUYNH_DUONG,
    receiver: NGUYEN_MINH,
    time: "14:00 - 10/30/2025",
    message:
      "Anh Tuấn giải quyết vấn đề kỹ thuật cực kỳ nhanh và hiệu quả. Học được rất nhiều từ anh trong sprint vừa rồi!",
    hashtags: ["#Technical", "#Mentoring"],
    likeCount: 500,
  },
  {
    id: "h5",
    sender: PHAM_THU,
    receiver: TRAN_THI,
    time: "08:45 - 10/31/2025",
    message:
      "Lan Anh xử lý toàn bộ phần requirement với khách hàng cực kỳ khéo léo và chuyên nghiệp. Rất tự hào về bạn!",
    hashtags: ["#Communication", "#Dedicated"],
    likeCount: 312,
  },
];

// --- All Kudos feed ---
export const allKudos: KudosEntry[] = [
  {
    id: "a1",
    sender: NGUYEN_MINH,
    receiver: HUYNH_DUONG,
    time: "10:00 - 10/30/2025",
    message:
      "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất lớn cho team trong suốt sprint này.",
    hashtags: ["#Dedicated", "#Inspiring"],
    likeCount: 1000,
  },
  {
    id: "a2",
    sender: TRAN_THI,
    receiver: LE_VAN,
    time: "11:30 - 10/30/2025",
    message:
      "Anh Hùng đã hỗ trợ team rất nhiều trong dự án lần này. Sự tận tâm và chuyên nghiệp của anh thật đáng khâm phục và noi gương.",
    hashtags: ["#Teamwork", "#Dedicated"],
    likeCount: 842,
  },
  {
    id: "a3",
    sender: VU_QUOC,
    receiver: PHAM_THU,
    time: "09:15 - 10/30/2025",
    message:
      "Chị Hương luôn là người truyền cảm hứng cho cả team. Cảm ơn chị vì những lời động viên đúng lúc và sự quan tâm chân thành đến từng thành viên.",
    hashtags: ["#Inspiring", "#Leadership"],
    likeCount: 654,
  },
  {
    id: "a4",
    sender: HUYNH_DUONG,
    receiver: NGUYEN_MINH,
    time: "14:00 - 10/30/2025",
    message:
      "Anh Tuấn giải quyết vấn đề kỹ thuật cực kỳ nhanh và hiệu quả. Học được rất nhiều từ anh trong sprint vừa rồi!",
    hashtags: ["#Technical", "#Mentoring"],
    likeCount: 500,
  },
  {
    id: "a5",
    sender: PHAM_THU,
    receiver: TRAN_THI,
    time: "08:45 - 10/31/2025",
    message:
      "Lan Anh xử lý toàn bộ phần requirement với khách hàng cực kỳ khéo léo. Rất tự hào về bạn và những gì bạn đã cống hiến!",
    hashtags: ["#Communication", "#Dedicated"],
    likeCount: 312,
  },
];

// --- Spotlight board names ---
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
// Name to highlight gold
export const spotlightHighlighted = "Huỳnh Dương Xuân Nhật";

// --- Ticker lines ---
export const tickerEntries: TickerLine[] = [
  { time: "10:03", text: "Nguyễn Minh Tuấn đã nhận được một Kudos mới" },
  { time: "10:07", text: "Huỳnh Dương Xuân Nhật đã nhận được một Kudos mới" },
  { time: "10:12", text: "Trần Thị Lan Anh đã nhận được một Kudos mới" },
  { time: "10:18", text: "Lê Văn Hùng đã nhận được một Kudos mới" },
  { time: "10:25", text: "Phạm Thu Hương đã nhận được một Kudos mới" },
];

// --- Stats ---
export const kudosStats: KudosStats = {
  received: 25,
  sent: 25,
  hearts: 25,
  boxOpened: 25,
  boxUnopened: 25,
};

// --- 10 Sunner gift recipients ---
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

// --- Filter options ---
export const hashtags: string[] = [
  "#Dedicated",
  "#Inspiring",
  "#Teamwork",
  "#Leadership",
  "#Technical",
  "#Communication",
  "#Mentoring",
];

export const departments: string[] = [
  "CECV10",
  "CEVC10",
  "DXD01",
  "PMG02",
  "HRD01",
];
