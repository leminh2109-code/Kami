import CustomerForm from "@/components/CustomerForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewCustomerPage() {
  const count = await prisma.customer.count();
  const suggestedCode = `KH-${String(count + 1).padStart(3, "0")}`;

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Thêm khách hàng</h1>
      <CustomerForm initial={{ code: suggestedCode, name: "", type: "", contactName: "", phone: "", email: "", address: "", taxCode: "", notes: "", isActive: true }} />
    </div>
  );
}
