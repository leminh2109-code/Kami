import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatVND, TRANSACTION_CATEGORY_LABELS } from "@/lib/labels";
import DeleteTransactionButton from "@/components/DeleteTransactionButton";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [monthlyThu, monthlyChi, allTransactions] = await Promise.all([
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
      include: {
        order: { select: { id: true, code: true } },
        customer: { select: { name: true } },
        workshop: { select: { name: true } },
      },
    }),
  ]);

  const thu = monthlyThu._sum.amount ?? 0;
  const chi = monthlyChi._sum.amount ?? 0;
  const net = thu - chi;

  const totalThu = allTransactions.filter((t) => t.type === "THU").reduce((s, t) => s + t.amount, 0);
  const totalChi = allTransactions.filter((t) => t.type === "CHI").reduce((s, t) => s + t.amount, 0);

  const monthLabel = new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(now);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Tài chính</h1>
        <Link
          href="/admin/finance/transactions/new"
          className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring"
        >
          + Ghi phiếu
        </Link>
      </div>

      {/* Summary tháng này */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
          <p className="text-sm text-ink/60 mt-1">Cân đối tháng</p>
        </div>
      </div>

      {/* Tổng toàn bộ */}
      <div className="flex flex-wrap gap-6 mb-6 text-sm border border-line px-5 py-3 bg-line/10">
        <span className="text-emerald-700">Tổng thu: <strong>{formatVND(totalThu)}</strong></span>
        <span className="text-red-700">Tổng chi: <strong>{formatVND(totalChi)}</strong></span>
        <span className={totalThu - totalChi >= 0 ? "text-ink" : "text-amber-700"}>
          Cân đối: <strong>{formatVND(totalThu - totalChi)}</strong>
        </span>
      </div>

      {/* Danh sách giao dịch */}
      {allTransactions.length === 0 ? (
        <p className="text-sm text-ink/60 border border-line p-6">Chưa có giao dịch nào.</p>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink/50 bg-line/20">
                <th className="px-5 py-3 font-normal">Mã</th>
                <th className="px-5 py-3 font-normal">Ngày</th>
                <th className="px-5 py-3 font-normal">Loại</th>
                <th className="px-5 py-3 font-normal">Danh mục</th>
                <th className="px-5 py-3 font-normal">Diễn giải</th>
                <th className="px-5 py-3 font-normal text-right">Số tiền</th>
                <th className="px-5 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {allTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-ink/50">{tx.code}</td>
                  <td className="px-5 py-3 text-ink/60 text-xs whitespace-nowrap">
                    {new Intl.DateTimeFormat("vi-VN").format(tx.date)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 border ${
                      tx.type === "THU"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {tx.type === "THU" ? "Thu" : "Chi"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink/70 whitespace-nowrap">
                    {TRANSACTION_CATEGORY_LABELS[tx.category]}
                  </td>
                  <td className="px-5 py-3 text-ink/70">
                    <p>{tx.description || "—"}</p>
                    {tx.order && (
                      <Link href={`/admin/orders/${tx.order.id}`} className="text-xs text-brass-dark hover:underline">
                        {tx.order.code}
                      </Link>
                    )}
                  </td>
                  <td className={`px-5 py-3 text-right font-medium whitespace-nowrap ${
                    tx.type === "THU" ? "text-emerald-700" : "text-red-700"
                  }`}>
                    {tx.type === "THU" ? "+" : "−"}{formatVND(tx.amount)}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/finance/transactions/${tx.id}/edit`}
                      className="text-xs text-brass-dark hover:underline mr-3"
                    >
                      Sửa
                    </Link>
                    <DeleteTransactionButton id={tx.id} />
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
