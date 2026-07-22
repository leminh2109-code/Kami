import { prisma } from "@/lib/db";
import TransactionForm from "@/components/TransactionForm";

export const dynamic = "force-dynamic";

export default async function NewTransactionPage() {
  const [customers, workshops, orders, txCount] = await Promise.all([
    prisma.customer.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, code: true, name: true },
    }),
    prisma.workshop.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, code: true, name: true },
    }),
    prisma.order.findMany({
      where: { status: { notIn: ["HOAN_TAT", "HUY"] } },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, code: true, customer: { select: { name: true } } },
    }),
    prisma.transaction.count(),
  ]);

  const year = new Date().getFullYear();
  const defaultCode = `GD-${year}-${String(txCount + 1).padStart(4, "0")}`;

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Ghi phiếu giao dịch</h1>
      <TransactionForm
        customers={customers}
        workshops={workshops}
        orders={orders}
        defaultCode={defaultCode}
      />
    </div>
  );
}
