import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatVND, TRANSACTION_CATEGORY_LABELS } from "@/lib/labels";
import DeleteTransactionButton from "@/components/DeleteTransactionButton";

export const dynamic = "force-dynamic";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const type = searchParams.type as "THU" | "CHI" | undefined;

  const transactions = await prisma.transaction.findMany({
    where: type ? { type } : undefined,
    orderBy: { date: "desc" },
    include: {
      order: { select: { id: true, code: true } },
      customer: { select: { name: true } },
      workshop: { select: { name: true } },
    },
  });

  const totalThu = transactions
    .filter((t) => t.type === "THU")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalChi = transactions
    .filter((t) => t.type === "CHI")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Sổ giao dịch</h1>
        <Link
          href="/admin/finance/transactions/new"
          className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring"
        >
          + Ghi phiếu
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <FilterLink href="/admin/finance/transactions" label="Tất cả" active={!type} />
        <FilterLink href="/admin/finance/transactions?type=THU" label="Thu" active={type === "THU"} />
        <FilterLink href="/admin/finance/transactions?type=CHI" label="Chi" active={type === "CHI"} />
      </div>

      {/* Tóm tắt */}
      <div className="flex gap-6 mb-6 text-sm border border-line px-5 py-3 bg-line/10">
        <span className="text-emerald-700">
          Thu: <strong>{formatVND(totalThu)}</strong>
        </span>
        <span className="text-red-700">
          Chi: <strong>{formatVND(totalChi)}</strong>
        </span>
        <span className={totalThu - totalChi >= 0 ? "text-ink" : "text-amber-700"}>
          Cân đối: <strong>{formatVND(totalThu - totalChi)}</strong>
        </span>
      </div>

      {transactions.length === 0 ? (
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
                <th className="px-5 py-3 font-normal">Diễn giải / Liên kết</th>
                <th className="px-5 py-3 font-normal text-right">Số tiền</th>
                <th className="px-5 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-ink/50">{tx.code}</td>
                  <td className="px-5 py-3 text-ink/60 text-xs">
                    {new Intl.DateTimeFormat("vi-VN").format(tx.date)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 border ${
                        tx.type === "THU"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {tx.type === "THU" ? "Thu" : "Chi"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{TRANSACTION_CATEGORY_LABELS[tx.category]}</td>
                  <td className="px-5 py-3 text-ink/70">
                    <p>{tx.description || "—"}</p>
                    <div className="flex gap-2 mt-0.5">
                      {tx.order && (
                        <Link
                          href={`/admin/orders/${tx.order.id}`}
                          className="text-xs text-brass-dark hover:underline"
                        >
                          {tx.order.code}
                        </Link>
                      )}
                      {tx.customer && (
                        <span className="text-xs text-ink/50">{tx.customer.name}</span>
                      )}
                      {tx.workshop && (
                        <span className="text-xs text-ink/50">{tx.workshop.name}</span>
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-5 py-3 text-right font-medium ${
                      tx.type === "THU" ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
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

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-1.5 text-sm border ${
        active
          ? "bg-ink text-parchment border-ink"
          : "border-line text-ink/60 hover:border-ink"
      }`}
    >
      {label}
    </Link>
  );
}
