import Link from "next/link";
import type { QuoteRequest } from "@prisma/client";
import { prisma } from "@/lib/db";
import { STATUS_LABELS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatVND } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, newQuoteCount, activeOrderCount, recentOrders, recentQuotes] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.quoteRequest.count({ where: { status: "MOI" } }),
      prisma.order.count({ where: { status: { notIn: ["HOAN_TAT", "HUY"] } } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { customer: { select: { name: true } } },
      }),
      prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    ]);

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Tổng quan</h1>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Đơn hàng đang xử lý" value={activeOrderCount} highlight />
        <StatCard label="Báo giá mới chờ xử lý" value={newQuoteCount} />
        <StatCard label="Sản phẩm đang hiển thị" value={productCount} />
      </div>

      {/* Đơn hàng gần đây */}
      <div className="border border-line mb-6">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line">
          <h2 className="text-sm font-medium">Đơn hàng gần đây</h2>
          <Link href="/admin/orders" className="text-sm text-brass-dark hover:underline focus-ring">
            Xem tất cả
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink/60">Chưa có đơn hàng nào.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-ink/50">{o.code}</td>
                  <td className="px-5 py-3 font-medium">{o.customer.name}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 border ${ORDER_STATUS_COLORS[o.status]}`}>
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-ink/70">{formatVND(o.totalAmount)}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="text-xs text-brass-dark hover:underline">
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Báo giá gần đây */}
      <div className="border border-line">
        <div className="flex items-center justify-between px-5 py-3 border-b border-line">
          <h2 className="text-sm font-medium">Báo giá gần đây</h2>
          <Link href="/admin/quotes" className="text-sm text-brass-dark hover:underline focus-ring">
            Xem tất cả
          </Link>
        </div>
        {recentQuotes.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink/60">Chưa có yêu cầu nào.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {recentQuotes.map((q: QuoteRequest) => (
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
