// Typed data for the Thể lệ (SAA Rules) modal — F010.
// All Vietnamese copy is verbatim from the spec. Do NOT modify text here without spec update.

export interface HeroTier {
  name: string;
  countLabel: string;
  description: string;
}

export interface CollectibleBadge {
  name: string;
  imagePath: string;
}

// Section 1 — 4 Hero tiers rendered as CSS pills
export const HERO_TIERS: HeroTier[] = [
  {
    name: "New Hero",
    countLabel: "Có 1-4 người gửi Kudos cho bạn",
    description:
      "Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.",
  },
  {
    name: "Rising Hero",
    countLabel: "Có 5-9 người gửi Kudos cho bạn",
    description:
      "Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.",
  },
  {
    name: "Super Hero",
    countLabel: "Có 10–20 người gửi Kudos cho bạn",
    description:
      "Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến.",
  },
  {
    name: "Legend Hero",
    countLabel: "Có hơn 20 người gửi Kudos cho bạn",
    description:
      "Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình.",
  },
];

// Section 2 — 6 collectible badges rendered with next/image
export const COLLECTIBLE_BADGES: CollectibleBadge[] = [
  { name: "REVIVAL", imagePath: "/saa-2025/badge-revival.png" },
  { name: "TOUCH OF LIGHT", imagePath: "/saa-2025/badge-touch-of-light.png" },
  { name: "STAY GOLD", imagePath: "/saa-2025/badge-stay-gold.png" },
  { name: "FLOW TO HORIZON", imagePath: "/saa-2025/badge-flow-to-horizon.png" },
  { name: "BEYOND THE BOUNDARY", imagePath: "/saa-2025/badge-beyond-the-boundary.png" },
  { name: "ROOT FUTHER", imagePath: "/saa-2025/badge-root-further.png" },
];

// Section copy constants
export const SECTION_COPY = {
  // Section 1
  section1Title: "NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC",
  section1Desc:
    "Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile",

  // Section 2
  section2Title:
    "NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN",
  section2Desc:
    "Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA.",
  section2Footer:
    "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025.",

  // Section 3
  section3Title: "KUDOS QUỐC DÂN",
  section3Desc:
    "5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further.",
} as const;
