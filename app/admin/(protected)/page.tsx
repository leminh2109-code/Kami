import Link from "next/link";
import { prisma } from "@/lib/db";
import { STATUS_LABELS } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, newQuoteCount, totalQuoteCount, recentQuotes] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.quoteRequest.count({ where: { status: "MOI" } }),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Tổng quan</h1>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Sản phẩm đang hiển thị" value={productCount} />
        <StatCard label="Yêu cầu báo giá mới" value={newQuoteCount} highlight />
        <StatCard label="Tổng yêu cầu báo giá" value={totalQuoteCount} />
      </div>

      <div className="border border-line">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line">
          <h2 className="text-sm font-medium">Yêu cầu báo giá gần đây</h2>
          <Link href="/admin/quotes" className="text-sm text-brass-dark hover:underline focus-ring">
            Xem tất cả
          </Link>
        </div>
        {recentQuotes.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink/60">Chưa có yêu cầu nào.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {recentQuotes.map((q) => (
                <tr key={q.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3">{q.companyName}</td>
                  <td className="px-5 py-3 text-ink/60">{q.contactName}</td>
                  <td className="px-5 py-3 text-ink/60">
                    {new Intl.DateTimeFormat("vi-VN").format(q.createdAt)}
                  </td>
                  <td className="px-5 py-3">{STATUS_LABELS[q.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border p-5 ${highlight ? "border-brass bg-brass/5" : "border-line"}`}
    >
      <p className="text-3xl font-display">{value}</p>
      <p className="text-sm text-ink/60 mt-1">{label}</p>
    </div>
  );
}
