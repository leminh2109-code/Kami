import Link from "next/link";
import { prisma } from "@/lib/db";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatVND } from "@/lib/labels";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { customerId?: string; status?: string };
}) {
  const where: Record<string, unknown> = {};
  if (searchParams.customerId) where.customerId = searchParams.customerId;
  if (searchParams.status) where.status = searchParams.status;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, code: true } },
      _count: { select: { items: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl">Đơn hàng</h1>
          {searchParams.customerId && (
            <p className="text-sm text-ink/50 mt-1">
              Đang lọc theo khách hàng ·{" "}
              <Link href="/admin/orders" className="text-brass-dark hover:underline">
                Xem tất cả
              </Link>
            </p>
          )}
        </div>
        <Link
          href="/admin/orders/new"
          className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring"
        >
          + Tạo đơn hàng
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-ink/60">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink/50">
                <th className="px-4 py-3 font-normal">Mã đơn</th>
                <th className="px-4 py-3 font-normal">Khách hàng</th>
                <th className="px-4 py-3 font-normal">Trạng thái</th>
                <th className="px-4 py-3 font-normal text-right">Giá trị</th>
                <th className="px-4 py-3 font-normal">Hạn giao</th>
                <th className="px-4 py-3 font-normal">Phụ trách</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-ink/70">{o.code}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${o.customer.id}/edit`}
                      className="hover:underline text-ink"
                    >
                      {o.customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect id={o.id} status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium">{formatVND(o.totalAmount)}</span>
                    {o.depositAmount > 0 && (
                      <span className="block text-xs text-ink/40">
                        cọc {formatVND(o.depositAmount)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink/60">
                    {o.expectedDelivery
                      ? new Intl.DateTimeFormat("vi-VN").format(o.expectedDelivery)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{o.assignedTo || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-sm text-brass-dark hover:underline focus-ring"
                    >
                      Chi tiết
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
