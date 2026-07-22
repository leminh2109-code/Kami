import { prisma } from "@/lib/db";
import WorkshopForm from "@/components/WorkshopForm";

export const dynamic = "force-dynamic";

export default async function NewWorkshopPage() {
  const count = await prisma.workshop.count();
  const defaultCode = `XG-${String(count + 1).padStart(3, "0")}`;

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Thêm xưởng gia công</h1>
      <WorkshopForm
        initial={{
          code: defaultCode,
          name: "",
          contactName: "",
          phone: "",
          address: "",
          specialty: "",
          notes: "",
          isActive: true,
        }}
      />
    </div>
  );
}
