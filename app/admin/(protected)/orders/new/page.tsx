import OrderForm from "@/components/OrderForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const [customers, products, quotes, orderCount] = await Promise.all([
    prisma.customer.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, code: true, name: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { code: "asc" },
      select: { id: true, code: true, name: true },
    }),
    prisma.quoteRequest.findMany({
      where: { status: { in: ["MOI", "DANG_XU_LY", "DA_BAO_GIA"] } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, companyName: true, createdAt: true },
    }),
    prisma.order.count(),
  ]);

  const year = new Date().getFullYear();
  const defaultCode = `DH-${year}-${String(orderCount + 1).padStart(3, "0")}`;

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Tạo đơn hàng</h1>
      {customers.length === 0 ? (
        <div className="border border-line p-6 text-sm text-ink/60">
          <p>Cần có ít nhất một khách hàng trước khi tạo đơn hàng.</p>
          <a href="/admin/customers/new" className="text-brass-dark hover:underline mt-2 inline-block">
            → Thêm khách hàng
          </a>
        </div>
      ) : (
        <OrderForm
          customers={customers}
          products={products}
          quotes={quotes.map((q) => ({ ...q, createdAt: q.createdAt.toISOString() }))}
          defaultCode={defaultCode}
        />
      )}
    </div>
  );
}
