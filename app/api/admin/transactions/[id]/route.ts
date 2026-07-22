import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  type: z.enum(["THU", "CHI"]),
  category: z.enum(["THU_KHACH_HANG", "CHI_XUONG", "CHI_NGUYEN_LIEU", "CHI_VAN_HANH", "KHAC"]),
  amount: z.number().min(0),
  date: z.string(),
  description: z.string().default(""),
  orderId: z.string().optional(),
  customerId: z.string().optional(),
  workshopId: z.string().optional(),
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const tx = await prisma.transaction.findUnique({
    where: { id: params.id },
    include: {
      order: { select: { id: true, code: true } },
      customer: { select: { id: true, name: true } },
      workshop: { select: { id: true, name: true } },
    },
  });
  if (!tx) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(tx);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  const { date, orderId, customerId, workshopId, ...rest } = parsed.data;
  try {
    const tx = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        ...rest,
        date: new Date(date),
        orderId: orderId || null,
        customerId: customerId || null,
        workshopId: workshopId || null,
      },
    });
    return NextResponse.json(tx);
  } catch {
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.transaction.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
