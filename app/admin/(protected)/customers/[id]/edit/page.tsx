import { notFound } from "next/navigation";
import CustomerForm from "@/components/CustomerForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({ where: { id: params.id } });
  if (!customer) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Sửa khách hàng</h1>
      <CustomerForm
        initial={{
          id: customer.id,
          code: customer.code,
          name: customer.name,
          type: customer.type,
          contactName: customer.contactName,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          taxCode: customer.taxCode,
          notes: customer.notes,
          isActive: customer.isActive,
        }}
      />
    </div>
  );
}
