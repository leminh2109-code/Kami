import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function DebtPage() {
  const customers = await prisma.customer.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      code: true,
      name: true,
      phone: true,
      orders: {
        where: { status: { notIn: ["HOAN_TAT", "HUY"] } },
        select: {
          id: true,
          code: true,
          totalAmount: true,
          depositAmount: true,
          expectedDelivery: true,
        },
      },
    },
  });

  const rows = customers
    .map((c) => ({
      ...c,
      debt: c.orders.reduce((sum, o) => sum + Math.max(0, o.totalAmount - o.depositAmount), 0),
    }))
    .filter((c) => c.debt > 0)
    .sort((a, b) => b.debt - a.debt);

  const totalDebt = rows.reduce((sum, c) => sum + c.debt, 0);

  return (
    <div>
      <h1 className="font-display text-2xl mb-2">Công nợ khách hàng</h1>
      <p className="text-sm text-ink/60 mb-8">
        Số tiền còn lại chưa thanh toán từ các đơn đang xử lý.
      </p>

      {rows.length === 0 ? (
        <p className="text-sm text-ink/60 border border-line p-6">Không có công nợ.</p>
      ) : (
        <>
          <div className="border border-amber-200 bg-amber-50 px-5 py-4 mb-6 flex justify-between items-center">
            <p className="text-sm text-amber-800">Tổng công nợ hiện tại</p>
            <p className="font-display text-xl text-amber-900">{formatVND(totalDebt)}</p>
          </div>

          <div className="space-y-4">
            {rows.map((c) => (
              <div key={c.id} className="border border-line">
                <div className="flex items-center justify-between px-5 py-3 bg-line/10 border-b border-line">
                  <div>
                    <Link
                      href={`/admin/customers/${c.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {c.name}
                    </Link>
                    <span className="text-xs text-ink/40 ml-2">{c.code}</span>
                    {c.phone && <span className="text-xs text-ink/50 ml-3">{c.phone}</span>}
                  </div>
                  <span className="font-display text-amber-700">{formatVND(c.debt)}</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-ink/40 border-b border-line/50">
                      <th className="px-5 py-1.5 font-normal text-left">Đơn hàng</th>
                      <th className="px-5 py-1.5 font-normal text-left">Hạn giao</th>
                      <th className="px-5 py-1.5 font-normal text-right">Tổng giá trị</th>
                      <th className="px-5 py-1.5 font-normal text-right">Đã cọc</th>
                      <th className="px-5 py-1.5 font-normal text-right">Còn lại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.orders.map((o) => {
                      const remaining = Math.max(0, o.totalAmount - o.depositAmount);
                      if (remaining <= 0) return null;
                      return (
                        <tr key={o.id} className="border-b border-line/50 last:border-0">
                          <td className="px-5 py-2">
                            <Link
                              href={`/admin/orders/${o.id}`}
                              className="font-mono text-xs text-brass-dark hover:underline"
                            >
                              {o.code}
                            </Link>
                          </td>
                          <td className="px-5 py-2 text-ink/60 text-xs">
                            {o.expectedDelivery
                              ? new Intl.DateTimeFormat("vi-VN").format(o.expectedDelivery)
                              : "—"}
                          </td>
                          <td className="px-5 py-2 text-right text-xs text-ink/60">
                            {formatVND(o.totalAmount)}
                          </td>
                          <td className="px-5 py-2 text-right text-xs text-emerald-700">
                            {formatVND(o.depositAmount)}
                          </td>
                          <td className="px-5 py-2 text-right font-medium text-amber-700">
                            {formatVND(remaining)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
