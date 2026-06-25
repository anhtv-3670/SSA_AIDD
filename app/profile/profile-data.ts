// Mock data for the Personal Profile page (F007).
// All profile links resolve to this single page — per-user "Profile người khác" deferred.

import type { KudosEntry } from "@/app/sun-kudos/kudos-data";

export interface ProfileStats {
  kudosReceived: number;
  kudosSent: number;
  hearts: number;
  boxOpened: number;
  boxUnopened: number;
}

export interface ProfileData {
  name: string;
  dept: string;
  title: string;
  avatarInitial: string;
  stats: ProfileStats;
}

export const PROFILE: ProfileData = {
  name: "Huỳnh Dương Xuân Nhật",
  dept: "CEVC3",
  title: "Legend Hero",
  avatarInitial: "H",
  stats: {
    kudosReceived: 5,
    kudosSent: 25,
    hearts: 25,
    boxOpened: 25,
    boxUnopened: 25,
  },
};

// Reuse KudosEntry type from F005 — consistent data shape.
const ME = { id: "me", name: "Huỳnh Dương Xuân Nhật", dept: "CEVC3", title: "Legend Hero" as const, initial: "H" };
const MINH = { id: "p2", name: "Nguyễn Minh Tuấn", dept: "CEVC10", title: "Rising Hero" as const, initial: "N" };
const LAN = { id: "p3", name: "Trần Thị Lan Anh", dept: "DXD01", title: "New Hero" as const, initial: "T" };
const HUNG = { id: "p4", name: "Lê Văn Hùng", dept: "PMG02", title: "Legend Hero" as const, initial: "L" };
const HUONG = { id: "p5", name: "Phạm Thu Hương", dept: "HRD01", title: "Rising Hero" as const, initial: "P" };

export interface ProfileKudosEntry extends KudosEntry {
  spam?: boolean;
}

export const SENT_KUDOS: ProfileKudosEntry[] = [
  {
    id: "s1",
    sender: ME,
    receiver: MINH,
    time: "14:00 - 10/30/2025",
    message: "Anh Tuấn giải quyết vấn đề kỹ thuật cực kỳ nhanh và hiệu quả. Học được rất nhiều từ anh trong sprint vừa rồi!",
    hashtags: ["#Technical", "#Mentoring"],
    likeCount: 500,
    spam: false,
  },
  {
    id: "s2",
    sender: ME,
    receiver: LAN,
    time: "09:00 - 10/31/2025",
    message: "Lan Anh phân tích yêu cầu cực kỳ cẩn thận, tài liệu rõ ràng giúp cả team tiết kiệm rất nhiều thời gian.",
    hashtags: ["#Communication", "#Dedicated"],
    likeCount: 312,
    spam: false,
  },
  {
    id: "s3",
    sender: ME,
    receiver: HUNG,
    time: "15:30 - 11/01/2025",
    message: "Anh Hùng review code rất kỹ và chia sẻ kiến thức tận tâm. Rất biết ơn anh!",
    hashtags: ["#Teamwork", "#Leadership"],
    likeCount: 278,
    spam: true,
  },
  {
    id: "s4",
    sender: ME,
    receiver: HUONG,
    time: "10:15 - 11/02/2025",
    message: "Chị Hương xử lý tình huống khó khăn với khách hàng rất khéo léo. Đội mình may mắn có chị!",
    hashtags: ["#Inspiring", "#Communication"],
    likeCount: 410,
    spam: false,
  },
  {
    id: "s5",
    sender: ME,
    receiver: MINH,
    time: "16:45 - 11/03/2025",
    message: "Cảm ơn anh đã hỗ trợ setup CI/CD cho project. Workflow mới nhanh hơn hẳn!",
    hashtags: ["#Technical", "#Dedicated"],
    likeCount: 189,
    spam: true,
  },
];

export const RECEIVED_KUDOS: ProfileKudosEntry[] = [
  {
    id: "r1",
    sender: MINH,
    receiver: ME,
    time: "10:00 - 10/30/2025",
    message: "Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất lớn cho team trong suốt sprint này.",
    hashtags: ["#Dedicated", "#Inspiring"],
    likeCount: 1000,
    spam: false,
  },
  {
    id: "r2",
    sender: LAN,
    receiver: ME,
    time: "11:30 - 10/30/2025",
    message: "Nhật luôn sẵn sàng hỗ trợ mọi người dù bận rộn đến đâu. Tinh thần đồng đội tuyệt vời!",
    hashtags: ["#Teamwork", "#Dedicated"],
    likeCount: 642,
    spam: false,
  },
  {
    id: "r3",
    sender: HUNG,
    receiver: ME,
    time: "14:20 - 10/31/2025",
    message: "Nhật fix bug production cực nhanh giữa đêm. Không có bạn sprint này chắc nguy to rồi.",
    hashtags: ["#Technical", "#Dedicated"],
    likeCount: 777,
    spam: true,
  },
  {
    id: "r4",
    sender: HUONG,
    receiver: ME,
    time: "09:00 - 11/01/2025",
    message: "Nhật luôn mang năng lượng tích cực đến cho cả team. Cảm ơn bạn vì những buổi retro thú vị!",
    hashtags: ["#Inspiring", "#Leadership"],
    likeCount: 523,
    spam: false,
  },
  {
    id: "r5",
    sender: MINH,
    receiver: ME,
    time: "11:00 - 11/02/2025",
    message: "Kỹ năng trình bày và viết tài liệu của Nhật thực sự xuất sắc. Khách hàng rất ấn tượng!",
    hashtags: ["#Communication", "#Technical"],
    likeCount: 390,
    spam: false,
  },
];
