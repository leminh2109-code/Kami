import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const itemSchema = z.object({
  productId: z.string().optional(),
  customName: z.string().default(""),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
  note: z.string().default(""),
});

const schema = z.object({
  code: z.string().min(1),
  customerId: z.string().min(1),
  quoteRequestId: z.string().optional(),
  workshopId: z.string().optional(),
  status: z
    .enum(["DAT_COC", "DANG_SAN_XUAT", "KIEM_TRA", "SAN_SANG_GIAO", "DA_GIAO", "HOAN_TAT", "HUY"])
    .default("DAT_COC"),
  depositAmount: z.number().min(0).default(0),
  totalAmount: z.number().min(0).default(0),
  expectedDelivery: z.string().optional(),
  assignedTo: z.string().default(""),
  internalNote: z.string().default(""),
  items: z.array(itemSchema).min(1),
});

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, code: true } },
      _count: { select: { items: true } },
    },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ", detail: parsed.error.flatten() }, { status: 400 });
  }

  const { items, expectedDelivery, quoteRequestId, workshopId, ...orderData } = parsed.data;

  try {
    const order = await prisma.order.create({
      data: {
        ...orderData,
        quoteRequestId: quoteRequestId || null,
        workshopId: workshopId || null,
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        items: {
          create: items.map((item) => ({
            productId: item.productId || null,
            customName: item.customName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            note: item.note,
          })),
        },
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Mã đơn hàng đã tồn tại" }, { status: 409 });
    }
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
