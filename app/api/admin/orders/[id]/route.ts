import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  status: z
    .enum(["DAT_COC", "DANG_SAN_XUAT", "KIEM_TRA", "SAN_SANG_GIAO", "DA_GIAO", "HOAN_TAT", "HUY"])
    .optional(),
  depositAmount: z.number().min(0).optional(),
  totalAmount: z.number().min(0).optional(),
  expectedDelivery: z.string().nullable().optional(),
  assignedTo: z.string().optional(),
  internalNote: z.string().optional(),
  deliveredAt: z.string().nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const { expectedDelivery, deliveredAt, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (expectedDelivery !== undefined) {
    data.expectedDelivery = expectedDelivery ? new Date(expectedDelivery) : null;
  }
  if (deliveredAt !== undefined) {
    data.deliveredAt = deliveredAt ? new Date(deliveredAt) : null;
  }
  if (rest.status === "DA_GIAO" && !deliveredAt) {
    data.deliveredAt = new Date();
  }

  try {
    const order = await prisma.order.update({ where: { id: params.id }, data });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Không cập nhật được đơn hàng" }, { status: 500 });
  }
}
