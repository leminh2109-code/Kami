import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  companyName: z.string().min(1, "Vui lòng nhập tên đơn vị"),
  contactName: z.string().min(1, "Vui lòng nhập người liên hệ"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  email: z.string().email("Email không hợp lệ"),
  organizationType: z.string().optional().default(""),
  message: z.string().optional().default(""),
  productId: z.string().optional(),
  quantity: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const { productId, quantity, ...data } = parsed.data;

  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      ...data,
      ...(productId
        ? {
            items: {
              create: [
                {
                  productId,
                  quantity: quantity ?? 1,
                },
              ],
            },
          }
        : {}),
    },
  });

  return NextResponse.json({ id: quoteRequest.id }, { status: 201 });
}
