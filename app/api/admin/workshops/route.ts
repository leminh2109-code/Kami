import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const workshops = await prisma.workshop.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { orders: true } } },
  });
  return NextResponse.json(workshops);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.code || !body?.name) {
    return NextResponse.json({ error: "Thiếu mã hoặc tên xưởng" }, { status: 400 });
  }
  try {
    const workshop = await prisma.workshop.create({
      data: {
        code: body.code,
        name: body.name,
        contactName: body.contactName ?? "",
        phone: body.phone ?? "",
        address: body.address ?? "",
        specialty: body.specialty ?? "",
        notes: body.notes ?? "",
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(workshop, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Mã xưởng đã tồn tại" }, { status: 409 });
    }
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
