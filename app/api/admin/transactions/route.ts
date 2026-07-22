import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  code: z.string().min(1),
  type: z.enum(["THU", "CHI"]),
  category: z.enum(["THU_KHACH_HANG", "CHI_XUONG", "CHI_NGUYEN_LIEU", "CHI_VAN_HANH", "KHAC"]),
  amount: z.number().min(0),
  date: z.string(),
  description: z.string().default(""),
  orderId: z.string().optional(),
  customerId: z.string().optional(),
  workshopId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as "THU" | "CHI" | null;

  const transactions = await prisma.transaction.findMany({
    where: type ? { type } : undefined,
    orderBy: { date: "desc" },
    include: {
      order: { select: { id: true, code: true } },
      customer: { select: { id: true, name: true } },
      workshop: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ", detail: parsed.error.flatten() }, { status: 400 });
  }

  const { date, orderId, customerId, workshopId, ...rest } = parsed.data;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        ...rest,
        date: new Date(date),
        orderId: orderId || null,
        customerId: customerId || null,
        workshopId: workshopId || null,
      },
    });
    return NextResponse.json(transaction, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Mã phiếu đã tồn tại" }, { status: 409 });
    }
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
