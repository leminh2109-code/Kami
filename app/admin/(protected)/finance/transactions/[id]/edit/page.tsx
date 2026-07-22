import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import TransactionForm from "@/components/TransactionForm";

export const dynamic = "force-dynamic";

export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const [tx, customers, workshops, orders] = await Promise.all([
    prisma.transaction.findUnique({ where: { id: params.id } }),
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
  ]);

  if (!tx) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl mb-2">Sửa phiếu giao dịch</h1>
      <p className="text-sm text-ink/50 mb-8 font-mono">{tx.code}</p>
      <TransactionForm
        customers={customers}
        workshops={workshops}
        orders={orders}
        defaultCode={tx.code}
        initial={{
          id: tx.id,
          type: tx.type as "THU" | "CHI",
          category: tx.category,
          amount: tx.amount,
          date: tx.date.toISOString().split("T")[0],
          description: tx.description,
          orderId: tx.orderId,
          customerId: tx.customerId,
          workshopId: tx.workshopId,
        }}
      />
    </div>
  );
}
