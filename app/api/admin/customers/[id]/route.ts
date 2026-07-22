import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  type: z.string().optional(),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  taxCode: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 10 },
      _count: { select: { orders: true } },
    },
  });
  if (!customer) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  try {
    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(customer);
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Mã khách hàng đã tồn tại" }, { status: 409 });
    }
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
