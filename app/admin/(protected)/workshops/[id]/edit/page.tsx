import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import WorkshopForm from "@/components/WorkshopForm";

export const dynamic = "force-dynamic";

export default async function EditWorkshopPage({ params }: { params: { id: string } }) {
  const workshop = await prisma.workshop.findUnique({ where: { id: params.id } });
  if (!workshop) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Sửa xưởng: {workshop.name}</h1>
      <WorkshopForm initial={workshop} />
    </div>
  );
}
