export const CATEGORY_LABELS: Record<string, string> = {
  NHAN: "Nhẫn",
  VONG_LAC: "Vòng, lắc",
  DAY_CHUYEN: "Dây chuyền",
  QUA_TANG: "Quà tặng, biểu trưng",
  QUA_LUU_NIEM: "Kỷ niệm chương",
  KHAC: "Khác",
};

export const MATERIAL_LABELS: Record<string, string> = {
  VANG_24K: "Vàng 24K (999)",
  VANG_18K: "Vàng 18K (750)",
  VANG_14K: "Vàng 14K (585)",
  BAC_925: "Bạc 925",
  DA_QUY: "Đá quý",
  HOP_KIM: "Hợp kim mạ vàng/bạc",
};

export const STATUS_LABELS: Record<string, string> = {
  MOI: "Mới",
  DANG_XU_LY: "Đang xử lý",
  DA_BAO_GIA: "Đã báo giá",
  HOAN_TAT: "Hoàn tất",
  HUY: "Đã huỷ",
};

export const STATUS_ORDER = ["MOI", "DANG_XU_LY", "DA_BAO_GIA", "HOAN_TAT", "HUY"];

export const CATEGORY_ORDER = [
  "NHAN",
  "VONG_LAC",
  "DAY_CHUYEN",
  "QUA_TANG",
  "QUA_LUU_NIEM",
  "KHAC",
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  DAT_COC: "Đã đặt cọc",
  DANG_SAN_XUAT: "Đang sản xuất",
  KIEM_TRA: "Kiểm tra CL",
  SAN_SANG_GIAO: "Sẵn sàng giao",
  DA_GIAO: "Đã giao hàng",
  HOAN_TAT: "Hoàn tất",
  HUY: "Đã huỷ",
};

export const ORDER_STATUS_ORDER = [
  "DAT_COC",
  "DANG_SAN_XUAT",
  "KIEM_TRA",
  "SAN_SANG_GIAO",
  "DA_GIAO",
  "HOAN_TAT",
  "HUY",
];

export const ORDER_STATUS_COLORS: Record<string, string> = {
  DAT_COC: "bg-blue-50 text-blue-800 border-blue-200",
  DANG_SAN_XUAT: "bg-amber-50 text-amber-800 border-amber-200",
  KIEM_TRA: "bg-purple-50 text-purple-800 border-purple-200",
  SAN_SANG_GIAO: "bg-emerald-50 text-emerald-800 border-emerald-200",
  DA_GIAO: "bg-teal-50 text-teal-800 border-teal-200",
  HOAN_TAT: "bg-stone-100 text-stone-600 border-stone-200",
  HUY: "bg-red-50 text-red-700 border-red-200",
};

export const CUSTOMER_TYPE_OPTIONS = [
  "Cơ quan nhà nước",
  "Doanh nghiệp",
  "Tổ chức",
  "Cá nhân",
  "Khác",
];

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}
