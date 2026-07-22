import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
  const workshops = await prisma.workshop.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Xưởng gia công</h1>
        <Link
          href="/admin/workshops/new"
          className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring"
        >
          + Thêm xưởng
        </Link>
      </div>

      {workshops.length === 0 ? (
        <p className="text-sm text-ink/60 border border-line p-6">Chưa có xưởng nào.</p>
      ) : (
        <div className="border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink/50 bg-line/20">
                <th className="px-5 py-3 font-normal">Mã</th>
                <th className="px-5 py-3 font-normal">Tên xưởng</th>
                <th className="px-5 py-3 font-normal">Liên hệ</th>
                <th className="px-5 py-3 font-normal">Chuyên môn</th>
                <th className="px-5 py-3 font-normal text-right">Đơn hàng</th>
                <th className="px-5 py-3 font-normal">Trạng thái</th>
                <th className="px-5 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {workshops.map((w) => (
                <tr key={w.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-ink/50">{w.code}</td>
                  <td className="px-5 py-3 font-medium">{w.name}</td>
                  <td className="px-5 py-3 text-ink/70">
                    {w.contactName && <span>{w.contactName}</span>}
                    {w.phone && <span className="text-ink/50 ml-2">{w.phone}</span>}
                  </td>
                  <td className="px-5 py-3 text-ink/60">{w.specialty || "—"}</td>
                  <td className="px-5 py-3 text-right text-ink/70">{w._count.orders}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 border ${
                        w.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-stone-100 text-stone-500 border-stone-200"
                      }`}
                    >
                      {w.isActive ? "Hoạt động" : "Ngừng"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/workshops/${w.id}/edit`}
                      className="text-xs text-brass-dark hover:underline"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
