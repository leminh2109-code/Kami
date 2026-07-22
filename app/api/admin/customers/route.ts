import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  type: z.string().default(""),
  contactName: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  address: z.string().default(""),
  taxCode: z.string().default(""),
  notes: z.string().default(""),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });
  return NextResponse.json(customers);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  try {
    const customer = await prisma.customer.create({ data: parsed.data });
    return NextResponse.json(customer, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Mã khách hàng đã tồn tại" }, { status: 409 });
    }
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
