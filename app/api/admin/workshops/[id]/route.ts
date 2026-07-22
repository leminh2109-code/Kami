import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const workshop = await prisma.workshop.findUnique({ where: { id: params.id } });
  if (!workshop) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(workshop);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: "Thiếu tên xưởng" }, { status: 400 });
  try {
    const workshop = await prisma.workshop.update({
      where: { id: params.id },
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
    return NextResponse.json(workshop);
  } catch {
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
