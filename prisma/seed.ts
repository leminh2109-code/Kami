import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Sample data only — replace via the admin panel with your real products,
// codes, images and descriptions.
const products = [
  {
    code: "MN-0001",
    name: "Kỷ niệm chương mạ vàng 24K",
    slug: "ky-niem-chuong-ma-vang-24k-mn-0001",
    category: "QUA_LUU_NIEM" as const,
    material: "HOP_KIM" as const,
    description:
      "Kỷ niệm chương đế gỗ, mặt biểu trưng mạ vàng 24K, nhận khắc logo và tên đơn vị theo yêu cầu. Phù hợp làm quà tặng đối ngoại, kỷ niệm sự kiện.",
    imageUrl: "https://images.unsplash.com/photo-1610375461369-d613b564f4c4?w=800&q=80",
    minQuantity: 20,
    isCustomizable: true,
    isActive: true,
  },
  {
    code: "MN-0002",
    name: "Nhẫn bạc 925 đính đá quý",
    slug: "nhan-bac-925-dinh-da-quy-mn-0002",
    category: "NHAN" as const,
    material: "BAC_925" as const,
    description:
      "Nhẫn bạc 925 nguyên khối, đính đá quý tổng hợp, thiết kế trơn thanh lịch. Phù hợp làm quà tặng nhân viên, đối tác.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    minQuantity: 50,
    isCustomizable: true,
    isActive: true,
  },
  {
    code: "MN-0003",
    name: "Dây chuyền vàng 18K khắc logo",
    slug: "day-chuyen-vang-18k-khac-logo-mn-0003",
    category: "DAY_CHUYEN" as const,
    material: "VANG_18K" as const,
    description:
      "Dây chuyền vàng 18K, mặt dây có thể khắc logo hoặc biểu trưng của tổ chức. Thường dùng làm quà tặng cao cấp cho khách hàng VIP.",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    minQuantity: 10,
    isCustomizable: true,
    isActive: true,
  },
  {
    code: "MN-0004",
    name: "Bộ quà tặng biểu trưng bạc 925",
    slug: "bo-qua-tang-bieu-trung-bac-925-mn-0004",
    category: "QUA_TANG" as const,
    material: "BAC_925" as const,
    description:
      "Bộ quà tặng gồm biểu trưng bạc 925 và hộp đựng cao cấp, phù hợp làm quà tặng khai trương, hội nghị, đối ngoại.",
    imageUrl: "https://images.unsplash.com/photo-1620656798932-e9ab0eb4e78d?w=800&q=80",
    minQuantity: 30,
    isCustomizable: true,
    isActive: true,
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  console.log(`Đã thêm ${products.length} sản phẩm mẫu.`);
  console.log(
    "Lưu ý: đây là dữ liệu và ảnh mẫu để demo. Hãy vào trang /admin/products để thay bằng sản phẩm thật của bạn."
  );

  // Print a ready-to-use bcrypt hash for the default admin password if the
  // person wants a quick local default (still recommend changing this).
  const sampleHash = await bcrypt.hash("doimatkhaunay", 10);
  console.log("\nVí dụ ADMIN_PASSWORD_HASH cho mật khẩu 'doimatkhaunay':");
  console.log(sampleHash);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
