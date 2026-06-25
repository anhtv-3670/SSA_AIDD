// Mock data for the Write Kudo modal — recipients and hashtag options.
// Reuses people already in kudos-data.ts; extends with a few more names for search variety.

export interface MockSunner {
  id: string;
  name: string;
  dept: string;
  initial: string;
}

export const mockSunners: MockSunner[] = [
  { id: "s1", name: "Huỳnh Dương Xuân Nhật", dept: "CECV10", initial: "H" },
  { id: "s2", name: "Nguyễn Minh Tuấn", dept: "CEVC10", initial: "N" },
  { id: "s3", name: "Trần Thị Lan Anh", dept: "DXD01", initial: "T" },
  { id: "s4", name: "Lê Văn Hùng", dept: "PMG02", initial: "L" },
  { id: "s5", name: "Phạm Thu Hương", dept: "HRD01", initial: "P" },
  { id: "s6", name: "Vũ Quốc Bảo", dept: "CEVC10", initial: "V" },
  { id: "s7", name: "Đặng Thị Mai", dept: "DXD01", initial: "Đ" },
  { id: "s8", name: "Hoàng Văn Nam", dept: "PMG02", initial: "H" },
  { id: "s9", name: "Bùi Thị Hoa", dept: "HRD01", initial: "B" },
  { id: "s10", name: "Ngô Quốc Duy", dept: "CECV10", initial: "N" },
  { id: "s11", name: "Cao Thị Thanh", dept: "DXD01", initial: "C" },
  { id: "s12", name: "Đinh Văn Long", dept: "PMG02", initial: "Đ" },
];

export const mockHashtags: string[] = [
  "#Dedicated",
  "#Inspiring",
  "#Teamwork",
  "#Leadership",
  "#Technical",
  "#Communication",
  "#Mentoring",
  "#Innovation",
  "#Supportive",
];
