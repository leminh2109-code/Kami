import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Khách hàng</h1>
        <Link
          href="/admin/customers/new"
          className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring"
        >
          + Thêm khách hàng
        </Link>
      </div>

      {customers.length === 0 ? (
        <p className="text-sm text-ink/60">Chưa có khách hàng nào.</p>
      ) : (
        <div className="border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink/50">
                <th className="px-4 py-3 font-normal">Mã</th>
                <th className="px-4 py-3 font-normal">Tên tổ chức</th>
                <th className="px-4 py-3 font-normal">Loại</th>
                <th className="px-4 py-3 font-normal">Liên hệ</th>
                <th className="px-4 py-3 font-normal text-right">Đơn hàng</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink/60 font-mono text-xs">{c.code}</td>
                  <td className="px-4 py-3 font-medium">
                    {c.name}
                    {!c.isActive && (
                      <span className="ml-2 text-xs text-ink/40">(Không hoạt động)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{c.type || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-ink/70">{c.contactName || "—"}</span>
                    {c.phone && (
                      <span className="text-ink/40 ml-2 text-xs">{c.phone}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders?customerId=${c.id}`}
                      className="text-brass-dark hover:underline"
                    >
                      {c._count.orders}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/customers/${c.id}/edit`}
                      className="text-sm text-brass-dark hover:underline focus-ring"
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
