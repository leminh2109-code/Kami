import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [monthlyThu, monthlyChi, recentTransactions, allCustomers] = await Promise.all([
    prisma.transaction.aggregate({
      where: { type: "THU", date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { type: "CHI", date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: 8,
      include: {
        customer: { select: { name: true } },
        workshop: { select: { name: true } },
        order: { select: { id: true, code: true } },
      },
    }),
    prisma.customer.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        code: true,
        orders: {
          where: { status: { notIn: ["HOAN_TAT", "HUY"] } },
          select: { totalAmount: true, depositAmount: true },
        },
      },
    }),
  ]);

  const thu = monthlyThu._sum.amount ?? 0;
  const chi = monthlyChi._sum.amount ?? 0;
  const net = thu - chi;

  const customerDebt = allCustomers
    .map((c) => ({
      ...c,
      debt: c.orders.reduce((sum, o) => sum + Math.max(0, o.totalAmount - o.depositAmount), 0),
    }))
    .filter((c) => c.debt > 0)
    .sort((a, b) => b.debt - a.debt)
    .slice(0, 5);

  const monthLabel = new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(now);

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Tài chính</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs text-emerald-700 mb-1 capitalize">{monthLabel}</p>
          <p className="text-3xl font-display text-emerald-800">{formatVND(thu)}</p>
          <p className="text-sm text-emerald-700/70 mt-1">Tổng thu</p>
        </div>
        <div className="border border-red-200 bg-red-50 p-5">
          <p className="text-xs text-red-700 mb-1 capitalize">{monthLabel}</p>
          <p className="text-3xl font-display text-red-800">{formatVND(chi)}</p>
          <p className="text-sm text-red-700/70 mt-1">Tổng chi</p>
        </div>
        <div className={`border p-5 ${net >= 0 ? "border-line" : "border-amber-200 bg-amber-50"}`}>
          <p className="text-xs text-ink/50 mb-1 capitalize">{monthLabel}</p>
          <p className={`text-3xl font-display ${net >= 0 ? "text-ink" : "text-amber-800"}`}>
            {formatVND(net)}
          </p>
          <p className="text-sm text-ink/60 mt-1">Cân đối</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Giao dịch gần đây */}
        <div className="border border-line">
          <div className="flex items-center justify-between px-5 py-3 border-b border-line">
            <h2 className="text-sm font-medium">Giao dịch gần đây</h2>
            <div className="flex gap-4">
              <Link href="/admin/finance/transactions/new" className="text-xs text-brass-dark hover:underline">
                + Ghi phiếu
              </Link>
              <Link href="/admin/finance/transactions" className="text-xs text-ink/50 hover:underline">
                Xem tất cả
              </Link>
            </div>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink/60">Chưa có giao dịch nào.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${
                          tx.type === "THU" ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {tx.type === "THU" ? "Thu" : "Chi"}
                      </span>
                      <p className="text-ink/60 text-xs mt-0.5">
                        {tx.description || tx.customer?.name || tx.workshop?.name || "—"}
                      </p>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        tx.type === "THU" ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {tx.type === "THU" ? "+" : "−"}{formatVND(tx.amount)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-ink/40">
                      {new Intl.DateTimeFormat("vi-VN").format(tx.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Công nợ khách hàng */}
        <div className="border border-line">
          <div className="flex items-center justify-between px-5 py-3 border-b border-line">
            <h2 className="text-sm font-medium">Công nợ khách hàng</h2>
            <Link href="/admin/finance/debt" className="text-xs text-ink/50 hover:underline">
              Xem tất cả
            </Link>
          </div>
          {customerDebt.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink/60">Không có công nợ.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {customerDebt.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-ink/40">{c.code}</p>
                    </td>
                    <td className="px-5 py-3 text-right font-display text-amber-700">
                      {formatVND(c.debt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
